import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAnalysts = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAnalysts] = useAxios({ url: '/analysts', ...axiosConfig }, options);

  const [analysts, setAnalysts] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAnalysts(data?.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ analysts, total, numberOfPages, size, error, loading }, getAnalysts];
};

export default useAnalysts;
