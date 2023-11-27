import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useStatuses = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getStatuses] = useAxios({ url: '/statuses', ...axiosConfig }, options);

  const [statuses, setStatuses] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setStatuses(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ statuses, total, numberOfPages, size, error, loading }, getStatuses];
};

export default useStatuses;
