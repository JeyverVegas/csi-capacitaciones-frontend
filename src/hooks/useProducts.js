import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useProducts = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getProducts] = useAxios({ url: '/products', ...axiosConfig }, { ...options, useCache: false });

  const [products, setProducts] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setProducts(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ products, total, numberOfPages, size, error, loading }, getProducts];
};

export default useProducts;
