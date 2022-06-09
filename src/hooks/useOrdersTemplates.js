import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrdersTemplates = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrdersTemplates] = useAxios({ url: '/orders-templates', ...axiosConfig }, options);

  const [ordersTemplates, setOrdersTemplates] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrdersTemplates(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ ordersTemplates, total, numberOfPages, size, error, loading }, getOrdersTemplates];
};

export default useOrdersTemplates;