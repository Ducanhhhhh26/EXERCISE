import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => setMessage(''), 3000);
        return () => clearTimeout(t);
    }, [message]);

    return (
        <ToastContext.Provider value={{ showToast: setMessage }}>
            {children}
            {message && <div data-testid="toast" className="toast">{message}</div>}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);