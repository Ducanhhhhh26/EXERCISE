import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data)).catch(() => { });
    }, []);
    return categories;
}