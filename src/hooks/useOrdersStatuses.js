import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useOrdersStatuses = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getOrdersStatuses] = useAxios({ url: '/order-statuses', ...axiosConfig }, options);

  const [ordersStatuses, setOrdersStatuses] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setOrdersStatuses(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ ordersStatuses, total, numberOfPages, size, error, loading }, getOrdersStatuses];
};

export default useOrdersStatuses;
