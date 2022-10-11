import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useUserNotifications = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getUserNotifications] = useAxios({ url: '/notifications/current-user', ...axiosConfig }, options);

  const [userNotifications, setUserNotifications] = useState([]);

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setUserNotifications(data.data);
      setTotal(data?.meta?.total);
      setSize(data?.meta?.per_page);
      setNumberOfPages(data.meta?.last_page);
    }

  }, [data, loading, error]);

  return [{ userNotifications, total, numberOfPages, size, error, loading }, getUserNotifications];
};

export default useUserNotifications;
