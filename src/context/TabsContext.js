import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export const TabsProvider = ({ children, initialValue = 0 }) => {
    const [value, setValue] = useState(initialValue);

    return <TabsContext.Provider value={{
        value,
        setValue,
    }}>
        {children}
    </TabsContext.Provider>
};

export const useTabs = () => useContext(TabsContext);