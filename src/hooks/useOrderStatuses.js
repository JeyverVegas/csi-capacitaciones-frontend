import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrderStatuses = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrderStatuses] = useAxios({ url: '/order-statuses', ...axiosConfig }, options);

  const [orderStatuses, setOrderStatuses] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrderStatuses(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ orderStatuses, total, numberOfPages, size, error, loading }, getOrderStatuses];
};

export default useOrderStatuses;
