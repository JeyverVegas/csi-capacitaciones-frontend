import clsx from "clsx";
import { useTabs } from "../contexts/TabsContext";

const Tab = ({ children, value, onClick, canContinue = true }) => {
    const { value: contextValue, setValue } = useTabs();

    return <div
        className={clsx([
            'px-5 py-2 md:font-semibold font-medium md:text-lg text-sm cursor-pointer',
            { 'border-b-2 border-main': value === contextValue }
        ])}
        onClick={() => {
            if (canContinue) {
                setValue(value);
                onClick?.(value);
            }
        }}
    >
        {children}
    </div>;
};

export default Tab;