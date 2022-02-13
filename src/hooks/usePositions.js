import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePositions = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getPositions] = useAxios({ url: '/positions', ...axiosConfig }, options);

  const [positions, setPositions] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPositions(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ positions, total, numberOfPages, size, error, loading }, getPositions];
};

export default usePositions;
