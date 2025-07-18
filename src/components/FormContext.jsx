import { createContext, useContext, useState } from "react";

const FormContext = createContext();

// eslint-disable-next-line react/prop-types
export const FormProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openForm = () => setIsOpen(true);
    const closeForm = () => setIsOpen(false);

    return (
        <FormContext.Provider value={{ isOpen, openForm, closeForm }}>
            {children}
        </FormContext.Provider>
    );
};

export const useForm = () => useContext(FormContext);
