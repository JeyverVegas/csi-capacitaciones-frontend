import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useForms = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getForms] = useAxios({ url: '/forms', ...axiosConfig }, options);

  const [forms, setForms] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setForms(data?.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ forms, total, numberOfPages, size, error, loading }, getForms];
};

export default useForms;
