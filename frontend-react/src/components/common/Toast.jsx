import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

const ICONS = {
    success: { icon: 'fa-check', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
    error:   { icon: 'fa-times', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    warning: { icon: 'fa-exclamation', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    info:    { icon: 'fa-info', bg: 'rgba(37,99,235,0.15)', color: '#3B82F6' }
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => {
                    const cfg = ICONS[toast.type] || ICONS.info;
                    return (
                        <div key={toast.id} className="toast">
                            <div className="toast__icon" style={{ background: cfg.bg, color: cfg.color }}>
                                <i className={`fas ${cfg.icon}`}></i>
                            </div>
                            <span className="toast__message">{toast.message}</span>
                            <button className="toast__close" onClick={() => removeToast(toast.id)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
}
