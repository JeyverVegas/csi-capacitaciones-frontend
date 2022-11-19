const TabsContainer = ({ children, className }) => {
    const finalChildren = Array.isArray(children) ? children : [children];

    return <div className={`${className}`}>{finalChildren}</div>;
}

export default TabsContainer;