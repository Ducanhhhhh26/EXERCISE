import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

export default function useProductSearch({ q = '', category = '', status = '', page = 1, limit = 10 }) {
    const [state, setState] = useState({ products: [], total: 0, loading: true, error: null });
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const params = { page, limit };
        if (q) params.q = q;
        if (category) params.category = category;
        if (status) params.status = status;

        setState((s) => ({ ...s, loading: true, error: null }));
        api.get('/products', { params, signal: controller.signal })
            .then((res) => setState({ products: res.data.data, total: res.data.total, loading: false, error: null }))
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return; // request cũ bị huỷ, bỏ qua
                setState((s) => ({ ...s, loading: false, error: err.response?.data?.message ?? err.message }));
            });

        return () => controller.abort(); // tham số đổi hoặc component gỡ → huỷ request cũ
    }, [q, category, status, page, limit, reloadKey]);

    return { ...state, reload: () => setReloadKey((k) => k + 1) };
}