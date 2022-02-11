import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useHelps = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getHelps] = useAxios({ url: '/helps', ...axiosConfig }, { useCache: false, ...options });

  const [helps, setHelps] = useState([]);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setHelps(data.results);
      setTotal(data.total);
      setNumberOfPages(data.numberOfPages)
    }
  }, [data]);

  return [{ helps, total, numberOfPages, error, loading }, getHelps];
};

export default useHelps;
