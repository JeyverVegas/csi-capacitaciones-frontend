import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePowerBi = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getPowerBi] = useAxios({ url: '/power-bi', ...axiosConfig }, options);

  const [powerBi, setPowerBi] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPowerBi(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ powerBi, total, numberOfPages, size, error, loading }, getPowerBi];
};

export default usePowerBi;
