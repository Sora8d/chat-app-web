import { SearchBar } from "../../../utils/searchbar/searchbar";
import React, { useContext, useEffect, useState } from "react";

import "./style.scss";
import { AuthContext } from "../../../stores/AuthContext";
import { searchContact } from "../../../utils/back/usersutils";
import { NewConvo, storageUsers, userProfile } from "../../../utils/interfaces";
import { ConversationsContext } from "../../../stores/ConversationsContext";
import ContactsCard from "../contactsCard/ContactsCard";

import { backdropProps } from "../../BackDrop/Backdrop";

import { searchcontactContext } from "./contactsContext";


const poblateSelectedContactsCard= (key:number, user:userProfile, selectFunc: (arg0:userProfile)=>void, context: {select: storageUsers; setSelect: (arg0: storageUsers) => void;
}):JSX.Element =>{
    return (
        <div className="GroupContactSelected">
                {poblateContactsCard(key, user, selectFunc, undefined)}
                <div className="GroupContactSelected__button" onClick={
                    ()=>{
                        let list_selected = context.select
                        delete list_selected[user.uuid.uuid]
                        context.setSelect(list_selected)
                    }
                }>X</div>
        </div>
    )
}

const poblateContactsCard = (key:number, user:userProfile, selectFunc: (arg0:userProfile)=>void, ignore:string[] | undefined):JSX.Element | null => {
    if (ignore != undefined && ignore.length > 0){
        if (ignore.includes(user.uuid.uuid)){
            return null
        }
    }
    return(<ContactsCard
        key={key}
        timeAgo={0}
        name={user.first_name! + " " + user.last_name!}
        lastMessage={user.phone}
        profileImg={user.avatar_url!}
        unread={0}
        badges={[]}
        selected=""
        toggleSelected={()=>{
            selectFunc(user)
        }}
        />)
}

const SearchContactPrivate = ({turnbackdropoff}:backdropProps) => {
    const AuthCtx = useContext(AuthContext)
    const ConvoCtx = useContext(ConversationsContext)
    const [search,setSearch] = useState<string>("");
    const [contacts, setContacts] = useState<userProfile[]>([])


    let known_users: storageUsers = {}
    const users_string = localStorage.getItem("users") 
    if (users_string != null){
        known_users = JSON.parse(users_string)
        delete known_users[AuthCtx.userInfo.uuid?.uuid!]
    }

    const select=(user:userProfile) => {
        const user_convo = {uuid: {uuid: "000000"}, user_uuid: AuthCtx.userInfo.uuid!, last_access_uuid: {uuid: "000000"}, created_at: 0}
        let conversation: NewConvo = {
            private: true,
            new: true,
            conversation: {uuid: {uuid: "000000"}, type: 1, created_at: 0},
            user_conversation: user_convo,
            participants:  [{uuid: {uuid: "000000"}, user_uuid: user.uuid, last_access_uuid: {uuid: "000000"}, created_at: 0},user_convo],
            unread_messages: 0
        }
        ConvoCtx.setSelected(conversation)
        turnbackdropoff()
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(()=>{
        const func = async () => {
            setContacts(await AuthCtx.requestsManager<userProfile[]>(searchContact, search))
        }
        func()
    }, [search])
    return (
        <div className="SearchContact" >
            <SearchBar message="Search contact" handleSearchChange={handleSearchChange} />    
            {contacts.length > 0 ? contacts.map((contact, i) => {
                return poblateContactsCard(i, contact, select, undefined)
            }) : <div className="SearchContact__NoUsers"><p>No users.</p></div>}
            <div className="SearchContact__KnownUsers"/>
            {Object.entries(known_users).map((contact, i) =>{
                  return poblateContactsCard(i, contact[1], select, undefined)
            })}
        </div>
    )
};

const SearchContactGroup = () => {
    const AuthCtx = useContext(AuthContext)
    const SelectedCtx= useContext(searchcontactContext)
    const [search,setSearch] = useState<string>("");
    const [contacts, setContacts] = useState<userProfile[]>([])

    let known_users: storageUsers = {}
    const users_string = localStorage.getItem("users") 
    if (users_string != null){
        known_users = JSON.parse(users_string)
        delete known_users[AuthCtx.userInfo.uuid?.uuid!]
    }

    const select=(user:userProfile) => {
       let list_selected = SelectedCtx.select
       list_selected[user.uuid.uuid] = user
       SelectedCtx.setSelect(list_selected)
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(()=>{
        const func = async () => {
            setContacts(await AuthCtx.requestsManager<userProfile[]>(searchContact, search))
        }
        func()
    }, [search])
    return (
        <div className="SearchContact" >
            <SearchBar message="Search contact" handleSearchChange={handleSearchChange} />    
            {Object.entries(SelectedCtx.select).map((contact, i) => {
                return poblateSelectedContactsCard(i, contact[1], ()=>{}, SelectedCtx)
            })}
            {contacts.length > 0 ? contacts.map((contact, i) => {
                return poblateContactsCard(i, contact, select, Object.keys(SelectedCtx.select))
            }) : <div className="SearchContact__NoUsers"><p>No users.</p></div>}
            <div className="SearchContact__KnownUsers"/>
            {Object.entries(known_users).map((contact, i) =>{
                  return poblateContactsCard(i, contact[1], select, Object.keys(SelectedCtx.select))
            })}
        </div>
    )
};

export {SearchContactPrivate, SearchContactGroup, poblateSelectedContactsCard,
    poblateContactsCard};