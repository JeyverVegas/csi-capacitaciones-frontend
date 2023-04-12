import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAccreditationProcessObservations = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAccreditationProcessObservations] = useAxios({ url: '/accreditation-process-observations', ...axiosConfig }, options);

  const [accreditationProcessObservations, setAccreditationProcessObservations] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAccreditationProcessObservations(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ accreditationProcessObservations, total, numberOfPages, size, error, loading }, getAccreditationProcessObservations];
};

export default useAccreditationProcessObservations;
