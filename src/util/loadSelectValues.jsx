import mapValues from "./mapValues";

const handleLoadSelectOptions = async (e, functionGetter, defaultParams) => {
    const getData = await functionGetter({ params: { ...defaultParams, name: e, perPage: 30, page: 1 } });
    return mapValues(getData?.data?.data);
}

export default handleLoadSelectOptions;