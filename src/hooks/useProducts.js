import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useProducts = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getProducts] = useAxios({ url: '/products', ...axiosConfig }, options);

  const [products, setProducts] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setProducts(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ products, total, numberOfPages, size, error, loading }, getProducts];
};

export default useProducts;
