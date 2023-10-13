import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useActivityLogs = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getActivityLogs] = useAxios({ url: '/activity-logs', ...axiosConfig }, options);

  const [activityLogs, setActivityLogs] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setActivityLogs(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ activityLogs, total, numberOfPages, size, error, loading }, getActivityLogs];
};

export default useActivityLogs;
