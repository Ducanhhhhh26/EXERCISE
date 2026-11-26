import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import ProductTable from '../components/ProductTable';
import ConfirmDialog from '../components/ConfirmDialog';
import useProductSearch from '../hooks/useProductSearch';
import useCategories from '../hooks/useCategories';
import { useToast } from '../context/ToastContext';

export default function ProductListPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const categories = useCategories();
    const { products, loading, error, reload } = useProductSearch({ page: 1 });
    const [target, setTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function confirmDelete() {
        setDeleting(true);
        try {
            await api.delete(`/products/${target.id}`);
            showToast('Đã xoá sản phẩm');
            setTarget(null);
            reload();
        } catch (err) {
            showToast(err.response?.data?.message ?? 'Xoá thất bại');
            setTarget(null);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <div className="page-head">
                <h1>Sản phẩm</h1>
                <button type="button" data-testid="add-button" onClick={() => navigate('/products/new')}>
                    Thêm sản phẩm
                </button>
            </div>

            {loading && <p data-testid="loading">Đang tải...</p>}

            {!loading && error && (
                <div data-testid="error-message" className="error-box">
                    <p>{error}</p>
                    <button type="button" data-testid="retry-button" onClick={reload}>Thử lại</button>
                </div>
            )}

            {!loading && !error && products.length === 0 && <p data-testid="empty-state">Không có sản phẩm nào</p>}

            {!loading && !error && products.length > 0 && (
                <ProductTable
                    products={products}
                    categories={categories}
                    onEdit={(p) => navigate(`/products/${p.id}/edit`)}
                    onDelete={setTarget}
                />
            )}

            {target && (
                <ConfirmDialog
                    message={`Xoá sản phẩm "${target.name}"?`}
                    busy={deleting}
                    onYes={confirmDelete}
                    onNo={() => setTarget(null)}
                />
            )}
        </>
    );
}