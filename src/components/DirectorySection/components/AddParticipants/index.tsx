import { useContext } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AuthContext } from "../../../../stores/AuthContext";
import { ConversationsContext } from "../../../../stores/ConversationsContext";
import { addParticipantRequest } from "../../../../utils/back/conversutils";
import { CreateDummyUserConversation, userConversation } from "../../../../utils/interfaces";
import { backdropProps } from "../../../BackDrop/Backdrop";
import { searchcontactContext } from "../../../common/searchContact/contactsContext";
import { SearchContactGroup } from "../../../common/searchContact/searchContact";

import "./style.scss";

const AddParticipantCard = ({select}:{select:() => void}) =>{
    return (
      <div className="MemberCard" onClick={select}>
        <IoIosAddCircleOutline size={48}/>
        <div className="MemberCard__InfoFlex">
          <h5>Add Participant</h5>
        </div>
      </div>
    );
  };

const NewParticipantsSearchContacts = ({turnbackdropoff}:backdropProps) =>{
  const SelectedCtx = useContext(searchcontactContext)
  const ConvoCtx = useContext(ConversationsContext)
  const AuthCtx = useContext(AuthContext)
  let exclude_strings = (()=> {
    let uuids: string[] = []
    ConvoCtx.selected?.participants.forEach((userconvo)=>{
      uuids.push(userconvo.user_uuid.uuid)
    }
    )
    return uuids
  })()
    return (
        <div className="addParticipantContacts">
            <SearchContactGroup excluding={exclude_strings} clearOnUnmount={true}/>
            <div className="addParticipantContacts__button" onClick={()=>{
              const create_users_list = ():userConversation[] =>{
                let userconvos: userConversation[] = []
                Object.entries(SelectedCtx.select).forEach((user)=>{
                  const userconvo = CreateDummyUserConversation({user_uuid: user[0]})
                  userconvos.push(userconvo)
                })
                return userconvos
              }
              AuthCtx.requestsManager<undefined>(addParticipantRequest, {conversation_uuid: ConvoCtx.selected?.conversation.uuid!, user_conversations: create_users_list()})
              turnbackdropoff()
            }}></div>
        </div>
    )
}

export {AddParticipantCard, NewParticipantsSearchContacts}