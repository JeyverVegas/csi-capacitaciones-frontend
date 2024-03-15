import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAreas = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAreas] = useAxios({ url: '/areas', ...axiosConfig }, options);

  const [areas, setAreas] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAreas(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ areas, total, numberOfPages, size, error, loading }, getAreas];
};

export default useAreas;
