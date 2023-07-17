import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAccountClassifications = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAccountClassifications] = useAxios({ url: '/account-classifications', ...axiosConfig }, options);

  const [accountClassifications, setAccountClassifications] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAccountClassifications(data?.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ accountClassifications, total, numberOfPages, size, error, loading }, getAccountClassifications];
};

export default useAccountClassifications;
