import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePlanningProcesses = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getPlanningProcesses] = useAxios({ url: '/planning-processes', ...axiosConfig }, options);

  const [planningProcesses, setPlanningProcesses] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPlanningProcesses(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ planningProcesses, total, numberOfPages, size, error, loading }, getPlanningProcesses];
};

export default usePlanningProcesses;
