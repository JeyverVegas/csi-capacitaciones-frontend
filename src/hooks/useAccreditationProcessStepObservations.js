import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAccreditationProcessStepObservations = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAccreditationProcessStepObservations] = useAxios({ url: '/accreditation-process-step-observations', ...axiosConfig }, options);

  const [accreditationProcessStepObservations, setAccreditationProcessStepObservations] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAccreditationProcessStepObservations(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ accreditationProcessStepObservations, total, numberOfPages, size, error, loading }, getAccreditationProcessStepObservations];
};

export default useAccreditationProcessStepObservations;
