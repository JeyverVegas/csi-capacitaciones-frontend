import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useZones = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getZones] = useAxios({ url: '/zones', ...axiosConfig }, options);

  const [zones, setZones] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setZones(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ zones, total, numberOfPages, size, error, loading }, getZones];
};

export default useZones;
