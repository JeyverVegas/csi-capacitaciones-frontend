import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useProviders = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getProviders] = useAxios({ url: '/providers', ...axiosConfig }, options);

  const [providers, setProviders] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setProviders(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ providers, total, numberOfPages, size, error, loading }, getProviders];
};

export default useProviders;
