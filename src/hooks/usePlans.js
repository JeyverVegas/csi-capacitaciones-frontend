import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePlans = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getPlans] = useAxios({ url: '/plans', ...axiosConfig }, options);

  const [plans, setPlans] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPlans(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ plans, total, numberOfPages, size, error, loading }, getPlans];
};

export default usePlans;
