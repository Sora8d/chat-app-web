import { SearchBar } from "../../../../utils/searchbar/searchbar";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import "./createconversation.scss";
import { NewConvo, newError, storageUsers, userProfile, uuid } from "../../../../utils/interfaces";
import { IoIosPeople, IoIosPerson } from "react-icons/io";

import { CreateConversationContext } from "./components/CreateConversationContext";
import { leaveBackdropProp } from "./components/common";
import { SearchContactGroup, SearchContactPrivate } from "../../../common/searchContact/searchContact";
import { GroupConversationForm } from "./components/GroupConversationForm";
import { createConversRequest } from "../../../../utils/back/conversutils";
import { AuthContext } from "../../../../stores/AuthContext";
import { ConversationsContext } from "../../../../stores/ConversationsContext";
import {searchcontactContext}  from "../../../common/searchContact/contactsContext";


const CreateConversationWrapper = ({turnbackdropoff}:leaveBackdropProp) =>{
    const [step, setStep] = useState<number>(0)
    const [error, setError] = useState<newError | null>(null)
    return (
    <CreateConversationContext.Provider value={{step, setStep, error, setError}}>
    <CreateConversation turnbackdropoff={turnbackdropoff}/>
    </CreateConversationContext.Provider>
    )
}


const CreateConversation = ({turnbackdropoff}:leaveBackdropProp) =>{
    const [isPrivate, setIsPrivate] = useState<boolean>(true)
    const selectedContactsCtx = useContext(searchcontactContext)
    const CreateConvoCtx = useContext(CreateConversationContext)
    const ConvoCtx= useContext(ConversationsContext)
    const AuthCtx = useContext(AuthContext)

    const GroupFormHandle = ()=>{
        let name= (document.getElementById("groupName") as HTMLInputElement).value;
        let image = (document.getElementById("groupImage")as HTMLInputElement).value;
        if (name.trim() == "") {
            CreateConvoCtx.setError({danger:1, message:"Name of the group cant be empty."})
            return
        }
        let participants: uuid[] = []
        participants.push(AuthCtx.userInfo.uuid!)
        Object.entries(selectedContactsCtx.select).forEach((participant) => {participants.push(participant[1].uuid)})
        const promise_uuid = AuthCtx.requestsManager<any>(createConversRequest,"Welcome to "+name, 0, participants, name, image)
        const asyncSetAwaitUuid = async () => {
            const uuid = await promise_uuid
            if (uuid === undefined){
                CreateConvoCtx.setError({danger:2, message:"Error ocurred"})
                return
            }
            ConvoCtx.setAwaitForConvo(uuid.uuid)
        }
        asyncSetAwaitUuid()
        turnbackdropoff()
    }

    return (
        <div className="CreateConvo">
        {renderSwitch(CreateConvoCtx.step, isPrivate, turnbackdropoff)}
        <div className="CreateConvo__ButtonsContainer">
            {CreateConvoCtx.step == 0 && [<div className={"CreateConvo__PrivateGroupButtons" + (isPrivate ? " CreateConvo__PrivateGroupButtons__Selected" : "") } onClick={()=>{
                setIsPrivate(true)
            }}>
                <IoIosPerson size={50}/>
            </div>,
            <div className={"CreateConvo__PrivateGroupButtons" + (isPrivate ? "" : " CreateConvo__PrivateGroupButtons__Selected") } onClick={()=>{
                setIsPrivate(false)
            }}>
                <IoIosPeople size={50}/>
            </div>]}
            {!(isPrivate) && <div className={"CreateConvo__PrivateGroupButtons CreateConvo__PrivateGroupButtons__Continue"} onClick={()=>{
                if (CreateConvoCtx.step == 0) {CreateConvoCtx.setStep(1)} else {
                    GroupFormHandle()
                }
            }}>
            </div>}
        </div>
        </div>
    )
}

const renderSwitch = (step:number,isPrivate: boolean, turnbackdropoff: ()=>void) =>{
    switch(step) {
        case 0:
            return isPrivate ? <SearchContactPrivate turnbackdropoff={turnbackdropoff}/> : <SearchContactGroup excluding={[]}/>
        case 1:
            return <GroupConversationForm/>            
    }
}

export {CreateConversationWrapper as CreateConversation};