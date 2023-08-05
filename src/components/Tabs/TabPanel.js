

const TabPanel = ({ children, className, value, eventKey }) => {

    if (value !== eventKey) return null;

    return <div className={className}>{children}</div>;
};

export default TabPanel;