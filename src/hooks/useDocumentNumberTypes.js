import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useDocumentNumberTypes = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getDocumentNumberTypes] = useAxios({ url: '/document-number-types', ...axiosConfig }, options);

  const [documentNumberTypes, setDocumentNumberTypes] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDocumentNumberTypes(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ documentNumberTypes, total, numberOfPages, size, error, loading }, getDocumentNumberTypes];
};

export default useDocumentNumberTypes;
