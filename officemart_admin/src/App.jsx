import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProductTable from './components/ProductTable';
import { products as sampleProducts } from './data/sample'; // đúng tên export trong file
import './App.css';

function TempList() {
  return (
    <>
      <div className="page-head">
        <h1>Sản phẩm</h1>
        <button data-testid="add-button">Thêm sản phẩm</button>
      </div>
      <ProductTable products={sampleProducts} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<TempList />} />
      </Route>
    </Routes>
  );
}