import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';
import useCategories from '../hooks/useCategories';
import { useToast } from '../context/ToastContext';

const EMPTY = { name: '', sku: '', category: '', price: '', stock: '0', status: 'active' };

function validate(f) {
    const e = {};
    const name = f.name.trim();
    if (name.length < 3 || name.length > 100) e.name = 'Tên phải từ 3 đến 100 ký tự';
    if (!/^[A-Z]{3}-\d{4}$/.test(f.sku)) e.sku = 'SKU phải đúng dạng ABC-1234';
    if (!f.category) e.category = 'Vui lòng chọn danh mục';
    const price = Number(f.price);
    if (f.price.trim() === '' || !(price > 0)) e.price = 'Giá phải là số lớn hơn 0';
    const stock = Number(f.stock);
    if (f.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) e.stock = 'Tồn kho phải là số nguyên không âm';
    return e;
}

function Field({ name, label, error, children }) {
    return (
        <div className="field">
            <label htmlFor={name}>{label}</label>
            {children}
            {error && <p className="field-error" data-testid={`field-error-${name}`}>{error}</p>}
        </div>
    );
}

export default function ProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const categories = useCategories();

    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [loadState, setLoadState] = useState(isEdit ? 'loading' : 'ready');

    useEffect(() => {
        if (!isEdit) return;
        const controller = new AbortController();
        setLoadState('loading');
        api.get(`/products/${id}`, { signal: controller.signal })
            .then((res) => {
                const p = res.data;
                setForm({ name: p.name, sku: p.sku, category: p.category, price: String(p.price), stock: String(p.stock), status: p.status });
                setLoadState('ready');
            })
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return;
                setLoadState(err.response?.status === 404 ? 'notfound' : 'error');
            });
        return () => controller.abort();
    }, [id, isEdit]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (saving) return;
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return; // sai thì không gọi API

        setSaving(true);
        const body = { ...form, name: form.name.trim(), price: Number(form.price), stock: Number(form.stock) };
        try {
            if (isEdit) await api.put(`/products/${id}`, body);
            else await api.post('/products', body);
            showToast(isEdit ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
            navigate('/products');
        } catch (err) {
            const data = err.response?.data;
            if (data?.field) setErrors({ [data.field]: data.message }); // 400/409 → lỗi dưới đúng trường
            else setErrors({ form: data?.message ?? 'Có lỗi xảy ra' });
            setSaving(false); // giữ nguyên dữ liệu đã nhập
        }
    }

    if (loadState === 'loading') return <p data-testid="loading">Đang tải...</p>;
    if (loadState === 'notfound') return <p>Không tìm thấy sản phẩm</p>;
    if (loadState === 'error') return <p data-testid="error-message">Không tải được sản phẩm</p>;

    return (
        <>
            <h1>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
            <form data-testid="product-form" onSubmit={handleSubmit} noValidate>
                <Field name="name" label="Tên" error={errors.name}>
                    <input id="name" name="name" value={form.name} onChange={handleChange} />
                </Field>
                <Field name="sku" label="SKU" error={errors.sku}>
                    <input id="sku" name="sku" value={form.sku} onChange={handleChange} />
                </Field>
                <Field name="category" label="Danh mục" error={errors.category}>
                    <select id="category" name="category" value={form.category} onChange={handleChange}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </Field>
                <Field name="price" label="Giá" error={errors.price}>
                    <input id="price" name="price" inputMode="decimal" value={form.price} onChange={handleChange} />
                </Field>
                <Field name="stock" label="Tồn kho" error={errors.stock}>
                    <input id="stock" name="stock" inputMode="numeric" value={form.stock} onChange={handleChange} />
                </Field>
                <Field name="status" label="Trạng thái" error={errors.status}>
                    <select id="status" name="status" value={form.status} onChange={handleChange}>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Ngừng bán</option>
                    </select>
                </Field>

                {errors.form && <p className="error-box">{errors.form}</p>}
                <button type="submit" data-testid="submit-button" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
            </form>
        </>
    );
}