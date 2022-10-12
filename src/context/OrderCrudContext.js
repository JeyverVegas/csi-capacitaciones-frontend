import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const OrderCrudContext = createContext({

});

export const OrderCrudProvider = ({ children }) => {

  const [data, setData] = useState({
    isReplacement: false,
    orderTypeId: '',
    serviceId: '',
    orderItems: [],
    authorizedBy: '',
    account: '',
    seven: '',
    chargePerForm: false
  });

  const [canNext, setCanNext] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  return <OrderCrudContext.Provider value={{
    data,
    setData,
    canNext,
    setCanNext,
    currentStep,
    setCurrentStep
  }}>
    {children}
  </OrderCrudContext.Provider>;
};

export const useOrderCrud = () => useContext(OrderCrudContext);
