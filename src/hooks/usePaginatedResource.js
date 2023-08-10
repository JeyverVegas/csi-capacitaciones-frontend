import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePaginatedResource = (url, { options, ...axiosConfig } = {}) => {
    const [{ data, error, loading }, getResource] = useAxios({ ...axiosConfig, url }, { useCache: false, ...options });

    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [size, setSize] = useState(0);

    useEffect(() => {
        if (data) {
            setResults(data.data);
            setTotal(data.meta.total);
            setNumberOfPages(data.meta.last_page);
            setSize(data.meta.per_page);
        }
    }, [data]);

    return [{ results, total, size, numberOfPages, error, loading }, getResource];
};

export default usePaginatedResource;