import mapValues from "./mapValues";

const handleLoadSelectOptions = async (e, functionGetter, additionalParams) => {
    const getData = await functionGetter({ params: { name: e, perPage: 30, page: 1, ...additionalParams } }, { useCache: false });
    return mapValues(getData?.data?.data);
}

export default handleLoadSelectOptions;