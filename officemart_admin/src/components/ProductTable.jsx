import ProductRow from './ProductRow';

export default function ProductTable({ products, categories = [], onEdit, onDelete }) {
    const nameOf = (id) => categories.find((c) => c.id === id)?.name;

    return (
        <table data-testid="product-table">
            <thead>
                <tr>
                    <th>Tên</th><th>SKU</th><th>Danh mục</th><th>Giá</th>
                    <th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => (
                    <ProductRow key={p.id} product={p} categoryName={nameOf(p.category)} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    );
}