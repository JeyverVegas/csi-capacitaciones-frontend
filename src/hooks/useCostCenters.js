import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useCostCenters = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getCostCenters] = useAxios({ url: '/cost-centers', ...axiosConfig }, options);

  const [costCenters, setCostCenters] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCostCenters(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ costCenters, total, numberOfPages, size, error, loading }, getCostCenters];
};

export default useCostCenters;
