import React from "react";
import { newError, storageUsers } from "../../../../../utils/interfaces";

const CreateConversationContext = React.createContext<{
    step: number,
    setStep: (arg0: number) =>void,
    error: newError | null,
    setError: (arg0: newError | null) => void
}>({
    step:0,
    setStep: (arg0:number)=>{},
    error: null,
    setError: (arg0: newError | null) => {}
});

export {CreateConversationContext}