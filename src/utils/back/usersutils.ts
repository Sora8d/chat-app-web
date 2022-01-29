import { uuid, userProfile, storageUsers } from '../interfaces'
import { access_token } from '../mock_auth';
import { AuthInfo, getStorageUsersResponse, getUserProfilesResponse } from './request_interfaces';
import { standardRequest, basic401Message } from "./common"
import { useContext } from 'react';
import { AuthContext } from '../../stores/AuthContext';

const getUsers= async (userinfo:AuthInfo,users:uuid[]):Promise<getStorageUsersResponse> => {
    if (userinfo.access_token == undefined){
        return basic401Message<storageUsers>({})
    }
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("access-token", userinfo.access_token)
    let url = `http://localhost:7999/user?`
    users.forEach((uuid:uuid) => {
        url += '&uuid='+uuid.uuid
    })
    const data = await fetch(
        url,
      { method: "GET",
      headers: requestHeaders}
    );
    const jn: getUserProfilesResponse= await data.json();
    let users_storage_string = localStorage.getItem("users")
    let users_storage:storageUsers = (users_storage_string != null) ? JSON.parse(users_storage_string) : {}
    let new_users_storage:storageUsers = {}
    if (jn.data == null) {
        jn.data = [];
    }
    jn.data.forEach((user) => {
        new_users_storage[user.uuid.uuid] = user
    });
    localStorage.setItem("users", JSON.stringify({...users_storage, ...new_users_storage}))
    return { data: new_users_storage, response: jn.response }
};

const searchContact = async (userinfo:AuthInfo, query:string, exclude:string[]):Promise<getUserProfilesResponse>=>{

    if (userinfo.access_token == undefined || userinfo.uuid == undefined || query.trim() == ""){
        return basic401Message<never[]>([])
    }
    let url = 'http://localhost:7999/search?query='+query
    if (exclude.length > 0) {
        exclude.forEach((uuid)=>{
            url += "&ex_uuid="+uuid
        })
    }
    const data = await fetch(
        url,
        {
            method: "GET",
            headers: standardRequest(userinfo.access_token),
        }
    )

    const jn: getUserProfilesResponse=await data.json();
    if (jn.data == null) {
        jn.data = [];
    }
    return jn
};


export {getUsers, searchContact}