import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrders = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrders] = useAxios({ url: '/orders', ...axiosConfig }, options);

  const [orders, setOrders] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrders(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ orders, total, numberOfPages, size, error, loading }, getOrders];
};

export default useOrders;