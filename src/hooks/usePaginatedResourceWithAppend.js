import { useCallback, useEffect, useState } from "react";
import usePaginatedResource from "./usePaginatedResource";
import useDeepCompareEffect from './useDeepCompareEffect';

const usePaginatedResourceWithAppend = (url, { options, params, ...axiosConfig } = { params: {} }) => {
    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState({});

    const [localResults, setLocalResults] = useState([]);

    const [canLoadMore, setCanLoadMore] = useState(false);

    const finalParams = { ...filters, page };

    const [{ results, loading, error, numberOfPages, total }, getResources] = usePaginatedResource(url, {
        options,
        params: finalParams,
        ...axiosConfig
    });

    useDeepCompareEffect(() => {
        setPage(1);

        setLocalResults([]);
    }, [filters]);

    useEffect(() => {
        setLocalResults(internalResults => [...internalResults, ...results]);
    }, [results]);

    useEffect(() => {
        if (numberOfPages === page) {
            setCanLoadMore(false);
        } else {
            setCanLoadMore(true);
        }
    }, [numberOfPages, page])

    const loadMore = useCallback(() => {
        if (loading || numberOfPages === page) {
            return;
        }

        setPage(page => page + 1);
    }, [loading, numberOfPages, page]);

    const reset = useCallback(() => {
        setLocalResults([]);
        setPage(1);
        refresh();
    }, [page, localResults]);

    const refresh = () => {
        getResources();
    }

    return {
        results: localResults,
        loadMore,
        refresh,
        reset,
        canLoadMore,
        loading,
        error,
        filters,
        setFilters,
        total,
        getResources,
    }
}

export default usePaginatedResourceWithAppend;