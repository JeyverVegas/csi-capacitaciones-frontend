import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useAccountAccreditationProcesses = ({ options, ...axiosConfig } = {}) => {
  const [{ data, error, loading }, getAccreditationProcess] = useAxios({ url: '/my-account/accreditation-processes', ...axiosConfig }, options);

  const [accreditationProcess, setAccreditationProcess] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setAccreditationProcess(data?.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ accreditationProcess, total, numberOfPages, size, error, loading }, getAccreditationProcess];
};

export default useAccountAccreditationProcesses;
