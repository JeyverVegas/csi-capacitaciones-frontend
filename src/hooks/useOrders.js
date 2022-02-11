import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrders = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrders] = useAxios({ url: '/orders', ...axiosConfig }, options);

  const [orders, setOrders] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrders(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ orders, total, numberOfPages, size, error, loading }, getOrders];
};

export default useOrders;
