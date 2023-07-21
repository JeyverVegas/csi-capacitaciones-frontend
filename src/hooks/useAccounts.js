import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAccounts = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAccounts] = useAxios({ url: '/accounts', ...axiosConfig }, options);

  const [accounts, setAccounts] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAccounts(data?.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ accounts, total, numberOfPages, size, error, loading }, getAccounts];
};

export default useAccounts;
