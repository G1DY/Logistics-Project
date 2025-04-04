import { createContext, useContext } from "react";

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

export const FormItemProvider = FormItemContext.Provider;

export const useFormItem = () => {
  const itemContext = useContext(FormItemContext);
  if (!itemContext) {
    throw new Error("useFormItem must be used within a FormItemProvider.");
  }

  return itemContext;
};
