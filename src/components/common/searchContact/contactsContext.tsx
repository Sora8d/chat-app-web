import React, { ReactNode, useState } from "react";
import { storageUsers } from "../../../utils/interfaces";

type childrenProp = {
    children: ReactNode
}

const searchcontactContext = React.createContext<{
    select: storageUsers,
    setSelect: (arg0:storageUsers)=>void,
}>({
    select:{},
    setSelect: ({})=>{},
});

const SearchContactProvider = ({children}:childrenProp) => {
    const [select, setSelect] = useState<storageUsers>({})
    return (
        <searchcontactContext.Provider value={{select, setSelect}}>
            {children}
        </searchcontactContext.Provider>
    )
}

export { searchcontactContext, SearchContactProvider};