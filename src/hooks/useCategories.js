import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useCategories = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getCategories] = useAxios({ url: '/store-categories', ...axiosConfig }, { useCache: false, ...options });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (data) {
      setCategories(data.results);
    }
  }, [data]);

  return [{ categories, error, loading }, getCategories];
};

export default useCategories;
