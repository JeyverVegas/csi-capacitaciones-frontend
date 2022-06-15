import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrdersTypes = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrdersTypes] = useAxios({ url: '/order-types', ...axiosConfig }, options);

  const [ordersTypes, setOrdersTypes] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrdersTypes(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ ordersTypes, total, numberOfPages, size, error, loading }, getOrdersTypes];
};

export default useOrdersTypes;
