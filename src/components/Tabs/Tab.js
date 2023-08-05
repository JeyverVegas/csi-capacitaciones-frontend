import clsx from "clsx";

const Tab = ({ children, value, onClick, canContinue = true }) => {

    return <div
        className={clsx([
            'px-5 py-2 md:font-semibold font-medium md:text-lg text-sm cursor-pointer',
            { 'border-b-2 border-main': value === value }
        ])}
        onClick={() => {
            if (canContinue) {
                onClick?.(value);
            }
        }}
    >
        {children}
    </div>;
};

export default Tab;