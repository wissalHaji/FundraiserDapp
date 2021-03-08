import React, { useContext } from "react";

const ServicesContext = React.createContext(null);

export function ServicesProvider(props) {
  const contextValue = {
    // add services
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
