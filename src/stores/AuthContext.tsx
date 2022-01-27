import { useEffect, useState, useRef, ReactNode } from "react";
import React from "react";
import { userProfile, uuid } from "../utils/interfaces";
import { apiResponseFix, AuthInfo } from "../utils/back/request_interfaces";
import { getUsers } from "../utils/back/usersutils";
import { apiResponse, requestManagerProp } from "../utils/back/request_interfaces"
import { RefreshTokenRequest } from "../utils/back/loginutils";
import { constants } from "crypto";
//This whole file is am mess, fix later

interface propsInterface{
    children: ReactNode;
}

type setUserInfo ={
    setUuid: (arg0:uuid | undefined) => void
    setAccessToken: (arg0:string | undefined) => void
    setRefreshToken: (arg0:string | undefined) => void
}

interface AuthProp{
    logged: boolean
    setLogged: (arg0:boolean) => void
    userInfo:AuthInfo
    setAuth:setUserInfo 
    requestsManager<obj>(args0: (subarg0:AuthInfo, ...subargs:any[]) => Promise<requestManagerProp<obj>>, ...args: any[]): Promise<obj>
}

const AuthContext = React.createContext<AuthProp>({
    logged: false,
    setLogged: (arg0:boolean) => {},
    userInfo:{
    uuid: undefined,
    access_token: undefined,
    refresh_token: undefined,
},
    setAuth:{
    setUuid: (arg0:uuid | undefined) => {},
    setAccessToken: (arg0:string | undefined) => {},
    setRefreshToken: (arg0:string | undefined) => {}
    },
    requestsManager<obj, >(args0: (subarg0: AuthInfo, ...subargs:any[])=>Promise<requestManagerProp<obj>>, ...args: any[]): Promise<obj> {
        return args0(this.userInfo).then((thing) => {return thing.data})
    }
})

const AuthProvider = ({children}:propsInterface) => {
    let uuid_string =localStorage.getItem("uuid")
    let current_user_uuid: uuid | undefined
    let storage_access_token = localStorage.getItem("accessToken")
    let storage_refresh_token= localStorage.getItem("refreshToken")

    let current_access_token: string | undefined
    let current_refresh_token: string | undefined
    let auth_exists = false
    if (uuid_string != null){
        current_user_uuid = {uuid: uuid_string}

        current_access_token = storage_access_token!
        current_refresh_token = storage_refresh_token!
        
        auth_exists = true
    }
    
    const [logged, setLogged] = useState<boolean>(auth_exists);
    const [uuid, setUuidState] = useState<uuid | undefined>(current_user_uuid);
    const [access_token, setAccessTokenState] = useState<string | undefined>(current_access_token);
    const [refresh_token, setRefreshTokenState] = useState<string | undefined>(current_refresh_token);
    const setUuid = (arg1: uuid | undefined)=>{
        setUuidState(arg1)
        arg1 != undefined ? localStorage.setItem("uuid", arg1.uuid) : localStorage.removeItem("uuid");
    }
    const setAccessToken= (arg1: string | undefined) =>{
        setAccessTokenState(arg1)
        arg1 != undefined ? localStorage.setItem("accessToken", arg1) : localStorage.removeItem("accessToken");
    }
    const setRefreshToken= (arg1: string | undefined) =>{
        setRefreshTokenState(arg1)
        arg1 != undefined ? localStorage.setItem("refreshToken", arg1) : localStorage.removeItem("refreshToken");
    }

    const [tokenIsRefreshing, setTokenIsRefreshing] = useState<boolean>(false)
    const [currentlyRecoveringToken, setCurrentlyRecoveringToken] = useState<boolean>(false)

    const userInfo={
        uuid, access_token, refresh_token
    }
    const setUserAuth={
      setUuid, setAccessToken, setRefreshToken
    }
    //This is like a decorator for any back-utils that use tokens
    /*
    Since i cant find a way to re-render and stay in the function scope (to be able to return to the corresponding component that called the function), when there is a need to Refresh the Token it wont do anything for the function.
    The problem is that the TokenIsRefreshing state doesnt always reach an instance of requestsManager called after the first one but before de useState, and so it will log the user off.
    const requestsManager= async <obj, >(arg0: (subarg0:AuthInfo, ...subargs:any[]) => Promise<requestManagerProp<obj>>, ...args2:any[]):Promise<obj> => {
        let result = await arg0(userInfo, ...args2);
        let final_data:obj
        switch (true){
            case (result.response.status == 401 && !tokenIsRefreshing):
                setTokenIsRefreshing(true)
                const refresh_token_response = await RefreshTokenRequest(userInfo.refresh_token!)
                if (refresh_token_response.data != undefined) {
                    console.log("this is played")
                    setAccessToken(refresh_token_response.data.access_token)
                    setRefreshToken(refresh_token_response.data.refresh_token)
                    final_data = (await arg0(userInfo, ...args2)).data
                } else {
                    setLogged(false)
                    final_data = result.data
                }
                setTokenIsRefreshing(false)
                return final_data
            default: 
                final_data = result.data
                return final_data
        }
        Best solution would be to find a way to re-render and be able to access where the token has been refreshed and use that.
        */
        const requestsManager= async <obj, >(arg0: (subarg0:AuthInfo, ...subargs:any[]) => Promise<requestManagerProp<obj>>, ...args2:any[]):Promise<obj> => {
            let result = await arg0(userInfo, ...args2);
                if (result.response.status == 401 && !tokenIsRefreshing) {
                    setTokenIsRefreshing(true)
                }
            return result.data
            }

    useEffect(()=>{
        if (!currentlyRecoveringToken){
        setCurrentlyRecoveringToken(true);

        const func = async () =>
        {
        if (tokenIsRefreshing){
        const refresh_token_response = await RefreshTokenRequest(userInfo.refresh_token!)
        if (refresh_token_response.data != undefined) {
            setAccessToken(refresh_token_response.data.access_token)
            setRefreshToken(refresh_token_response.data.refresh_token)
            setTokenIsRefreshing(false)
        } else {
            setTokenIsRefreshing(false)
            setLogged(false)
        }
}
    setCurrentlyRecoveringToken(false);
        }
        func();
        }
    }, [tokenIsRefreshing])
    return (
        <AuthContext.Provider value={{logged, setLogged, userInfo: userInfo, setAuth: setUserAuth, requestsManager}}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthProvider, AuthContext };