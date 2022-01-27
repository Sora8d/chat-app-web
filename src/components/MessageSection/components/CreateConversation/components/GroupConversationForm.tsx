import React, { useContext } from "react";
import {searchcontactContext} from "../../../../common/searchContact/contactsContext";
import { poblateSelectedContactsCard } from "./common";
import { CreateConversationContext } from "./CreateConversationContext";

import "./style.scss";

const GroupConversationForm = () =>{
    const CreateConvoCtx = useContext(CreateConversationContext)
    const SelectedCtx = useContext(searchcontactContext)

    return (
        <div className="SearchContact">
            <div>
                <p><label>Name</label></p>
                <p><input type="text" placeholder="title" id="groupName" required/></p>
                {CreateConvoCtx.error != null && <p>{CreateConvoCtx.error.message}</p>}
               
                <p><label>Group Image</label></p>
                <p><input type="text" placeholder="imagesite.site/image.img" id="groupImage"/></p>
            <div>
                <p><label>Participants</label></p>
                <p/>
                {Object.entries(SelectedCtx.select).map((contact, i) => {
                   return poblateSelectedContactsCard(i, contact[1], ()=>{}, SelectedCtx)
                })}
            </div>
            </div>
        </div>
    )
}

export {GroupConversationForm}