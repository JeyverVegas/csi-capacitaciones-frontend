import { isEqual } from "lodash";
import { useEffect, useRef } from "react"

const useDeepCompareMemoize = (value) => {
    const ref = useRef();

    if (!isEqual(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

const useDeepCompareEffect = (callback, dependencies) => {
    useEffect(
        callback,
        dependencies?.map(useDeepCompareMemoize)
    );
}

export default useDeepCompareEffect;