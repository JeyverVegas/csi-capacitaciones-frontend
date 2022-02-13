import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useRoles = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getRoles] = useAxios({ url: '/roles', ...axiosConfig }, options);

  const [roles, setRoles] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setRoles(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ roles, total, numberOfPages, size, error, loading }, getRoles];
};

export default useRoles;
