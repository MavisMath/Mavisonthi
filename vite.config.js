import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { explainTermWithGemini } from './api/explain.js';

function createExplainMiddleware(env) {
  return async (req, res, next) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, reason: 'method_not_allowed' }));
      return;
    }

    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const body = chunks.length
        ? JSON.parse(Buffer.concat(chunks).toString('utf8'))
        : {};

      const result = await explainTermWithGemini({
        term: body?.term,
        wikiSummary: body?.wikiSummary,
        context: body?.context,
        apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
        preferredModel: env.GEMINI_MODEL || process.env.GEMINI_MODEL,
      });

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      if (!result.ok) {
        res.statusCode = result.status || 503;
        res.end(JSON.stringify({ ok: false, reason: result.reason || 'failed' }));
        return;
      }

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          ok: true,
          model: result.model,
          whatIsIt: result.whatIsIt,
          aiRole: result.aiRole,
          formulaPlain: result.formulaPlain,
        })
      );
    } catch {
      next();
    }
  };
}

function localApiExplainPlugin(env) {
  const middleware = createExplainMiddleware(env);
  return {
    name: 'local-api-explain',
    configureServer(server) {
      server.middlewares.use('/api/explain', middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/explain', middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), localApiExplainPlugin(env)],
    server: {
      host: 'localhost',
      port: 5173,
    },
  };
});
