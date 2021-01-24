import React, { useContext } from "react";
import FactoryService from "./contracts/FactoryService";
import FundraiserService from "./contracts/FundraiserService";

const ServicesContext = React.createContext(null);

export function ServicesProvider(props) {
  const contextValue = {
    factoryService: new FactoryService(),
    fundraiserService: new FundraiserService(),
  };

  return (
    <ServicesContext.Provider value={contextValue}>
      {props.children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  return context;
}
