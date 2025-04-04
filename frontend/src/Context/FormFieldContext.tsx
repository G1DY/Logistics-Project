import { createContext, useContext } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const FormFieldProvider = FormFieldContext.Provider;

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormFieldProvider.");
  }

  return fieldContext;
};
