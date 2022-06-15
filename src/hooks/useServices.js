import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useServices = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getServices] = useAxios({ url: '/services', ...axiosConfig }, options);

  const [services, setServices] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setServices(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ services, total, numberOfPages, size, error, loading }, getServices];
};

export default useServices;
