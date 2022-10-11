import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useUserQuotes = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getQuotes] = useAxios({ url: '/user/quotes', ...axiosConfig }, options);

  const [quotes, setQuotes] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setQuotes(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ quotes, total, numberOfPages, size, error, loading }, getQuotes];
};

export default useUserQuotes;