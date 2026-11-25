import { Component } from 'react';
import { STORAGE_KEYS } from '../utils/storage.js';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Runtime error caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearStorageAndReload = () => {
    try {
      for (const key of Object.values(STORAGE_KEYS)) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage access errors
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const message =
      this.state.error?.message || String(this.state.error || 'Unknown error');
    const stack =
      this.state.errorInfo?.componentStack || this.state.error?.stack || '';

    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-mono text-xs font-semibold text-rose-700">
            Runtime Error
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Ứng dụng gặp lỗi khi hiển thị
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            ErrorBoundary đã bắt lỗi thay vì để màn hình trắng. Chi tiết lỗi bên dưới:
          </p>

          <div className="mt-4 rounded-xl border border-rose-200/80 bg-rose-50/70 p-4 font-mono text-xs leading-relaxed text-rose-900">
            {message}
          </div>

          {stack && (
            <pre className="mt-3 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-5 text-slate-700">
              <code>{stack.trim()}</code>
            </pre>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Tải lại trang
            </button>
            <button
              type="button"
              onClick={this.handleClearStorageAndReload}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Xóa dữ liệu localStorage &amp; Tải lại
            </button>
          </div>
        </div>
      </div>
    );
  }
}
