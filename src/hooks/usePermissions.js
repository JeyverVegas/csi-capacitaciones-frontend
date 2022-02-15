import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePermissions = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getPermissions] = useAxios({ url: '/permissions', ...axiosConfig }, options);

  const [permissions, setPermissions] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPermissions(data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ permissions, total, numberOfPages, size, error, loading }, getPermissions];
};

export default usePermissions;
