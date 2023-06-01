import React, { createContext } from "react";
import { from, Observable } from "rxjs";

const FormContext = React.createContext({});

export const Form: React.FC<React.PropsWithChildren<{}>> = (props) => {
  return (
    <FormContext.Provider value={{}}>{props.children}</FormContext.Provider>
  );
};
