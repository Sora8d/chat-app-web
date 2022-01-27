import { ReactNode, useContext } from "react";
import { IoIosClose, IoMdReturnLeft } from "react-icons/io";
import { ConversationsContext } from "../../../../stores/ConversationsContext";
import {AuthContext} from "../../../../stores/AuthContext"
import { userConversation, userProfile } from "../../../../utils/interfaces"
import Avatar from "../../../common/Avatar/Avatar";

import "./ProfileCard.scss"
import { apiResponseFix, KickParticipantResponse } from "../../../../utils/back/request_interfaces";
import { kickParticipantRequest } from "../../../../utils/back/conversutils";

type ProfProp = {
    user: userConversation
    deselect: () => void
}

const ProfileSection = ({user, deselect}:ProfProp) => {
    const AuthCtx = useContext(AuthContext);
    const ConvoCtx = useContext(ConversationsContext);
    const selected = ConvoCtx.selected
    const user_profile = ConvoCtx.users[user.user_uuid.uuid];
    return (
        <div className="ProfileCard">
            <div onClick={deselect}><IoMdReturnLeft size={20}/></div>
            <div>
            <div className="ProfileCard__avatar">
            <Avatar profileImg={user_profile.avatar_url} size={124}/>
            </div>
            <div>
            <p className="ProfileCard__title">{user_profile.first_name + " " + user_profile.last_name}</p>
            <p className="ProfileCard__description">{user_profile.description}</p>
            </div>
            </div>
            <div>
                {!(selected?.private) && (<div className="ProfileCard__kick" onClick={() => {
                    AuthCtx.requestsManager<undefined>(kickParticipantRequest, {user_conversation: user.uuid, conversation: selected?.conversation.uuid})
                    deselect()
                    }}>
                    <IoIosClose size={30} color="rgb(206, 84, 84)"/>
                    <p>Kick User</p>
                </div>)}
            </div>
        </div>
    )
}

export {ProfileSection};