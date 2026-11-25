import { useSyncExternalStore } from 'react';
import { GLOSSARY_DATA } from '../data/glossaryData.js';
import {
  loadCustomFlashcards,
  loadCustomGlossary,
  saveCustomFlashcards,
  saveCustomGlossary,
} from './storage.js';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildAliasPattern(alias) {
  const escaped = escapeRegex(alias).replace(/\\\+/g, '\\s*\\+\\s*');
  const startsWithWord = /^[\p{L}\p{N}_]/u.test(alias);
  const endsWithWord = /[\p{L}\p{N}_]$/u.test(alias);
  const prefix = startsWithWord ? '(?<![\\p{L}\\p{N}_])' : '';
  const suffix = endsWithWord ? '(?![\\p{L}\\p{N}_])' : '';
  return `${prefix}${escaped}${suffix}`;
}

function compileGlossaryMatcher(customEntries) {
  // Custom entries take priority if user overrides or adds a new term
  const combined = [...(customEntries ?? []), ...GLOSSARY_DATA];
  const records = [];
  const seen = new Set();

  for (const entry of combined) {
    const candidates = [entry.term, ...(entry.aliases ?? [])];
    for (const raw of candidates) {
      const cleaned = raw.trim();
      const normalized = cleaned.toLowerCase().replace(/\s*\+\s*/g, '+');
      if (!normalized || cleaned.length < 2 || seen.has(normalized)) continue;
      seen.add(normalized);
      records.push({ alias: cleaned, normalized, entry });
    }
  }

  records.sort((a, b) => b.alias.length - a.alias.length);

  const lookup = new Map(records.map((r) => [r.normalized, r.entry]));
  const regex =
    records.length > 0
      ? new RegExp(
          `(${records.map((r) => buildAliasPattern(r.alias)).join('|')})`,
          'giu'
        )
      : null;

  return { regex, lookup, combined };
}

// Module-level store synced with localStorage
let customGlossaryState = loadCustomGlossary();
let customFlashcardsState = loadCustomFlashcards();
let matcherSnapshot = compileGlossaryMatcher(customGlossaryState);

const glossaryListeners = new Set();
const flashcardListeners = new Set();

function notifyGlossary() {
  matcherSnapshot = compileGlossaryMatcher(customGlossaryState);
  for (const fn of glossaryListeners) fn();
}

function notifyFlashcards() {
  for (const fn of flashcardListeners) fn();
}

export function subscribeGlossaryMatcher(listener) {
  glossaryListeners.add(listener);
  return () => glossaryListeners.delete(listener);
}

export function getGlossaryMatcherSnapshot() {
  return matcherSnapshot;
}

export function useGlossaryMatcher() {
  return useSyncExternalStore(
    subscribeGlossaryMatcher,
    getGlossaryMatcherSnapshot,
    getGlossaryMatcherSnapshot
  );
}

export function subscribeCustomFlashcards(listener) {
  flashcardListeners.add(listener);
  return () => flashcardListeners.delete(listener);
}

export function getCustomFlashcardsSnapshot() {
  return customFlashcardsState;
}

export function useCustomFlashcards() {
  return useSyncExternalStore(
    subscribeCustomFlashcards,
    getCustomFlashcardsSnapshot,
    getCustomFlashcardsSnapshot
  );
}

export function upsertCustomGlossaryEntry(entry) {
  const normalizedTerm = entry.term.trim().toLowerCase();
  const next = [
    entry,
    ...customGlossaryState.filter(
      (item) =>
        item.id !== entry.id &&
        item.term.trim().toLowerCase() !== normalizedTerm
    ),
  ];
  customGlossaryState = next;
  saveCustomGlossary(next);
  notifyGlossary();
  return entry;
}

export function removeCustomGlossaryEntry(id) {
  const next = customGlossaryState.filter((item) => item.id !== id);
  customGlossaryState = next;
  saveCustomGlossary(next);
  notifyGlossary();
}

export function addCustomFlashcard(card) {
  const next = [
    card,
    ...customFlashcardsState.filter((item) => item.id !== card.id),
  ];
  customFlashcardsState = next;
  saveCustomFlashcards(next);
  notifyFlashcards();
  return card;
}

export function removeCustomFlashcard(id) {
  const next = customFlashcardsState.filter((item) => item.id !== id);
  customFlashcardsState = next;
  saveCustomFlashcards(next);
  notifyFlashcards();
}
