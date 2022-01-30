import { useContext, useEffect, useState } from "react";
import { userConversation } from "../../../../utils/interfaces";
import { NewParticipantsSearchContacts, AddParticipantCard } from "../AddParticipants";
import BackDrop from "../../../BackDrop/Backdrop";
import { MembersCards } from "../MembersCards";
import { ConversationsContext } from "../../../../stores/ConversationsContext";


const TeamMembers = ({userSelect}:{userSelect:(arg0: userConversation|null)=>void}) => {
    const ConvoCtx = useContext(ConversationsContext);
    useEffect(()=>{
      if (ConvoCtx.selected?.participants != undefined) {
        setParticipants(ConvoCtx.selected?.participants)
      }
    }, [ConvoCtx.selected, ConvoCtx.selected?.participants]);
    
    const [participants, setParticipants] = useState<userConversation[]>([])

    const [isAddParticipant, setIsAddParticipant] = useState<boolean>(false)

    const turnbackdropoff = () => {
      setIsAddParticipant(false)
    }
    return (
    <div className="DirectoryCont__main">
    {isAddParticipant && <NewParticipantsSearchContacts turnbackdropoff={turnbackdropoff}/>}
    {isAddParticipant && <BackDrop turnbackdropoff={turnbackdropoff}/>}
    <div className="DirectoryCont__main__flex">
    <h4>Team Members</h4>
    <div>{participants.length}</div>
    </div>
    <div className="DirectoryCont__main__cards">
      {participants.map((participant) => {
        let user=ConvoCtx.users[participant.user_uuid.uuid];
        const SelectMember = () => {
          userSelect(participant)
        };
        return <MembersCards user={user} select={SelectMember}/>
      })}
      {!(ConvoCtx.selected?.private) && <AddParticipantCard select={()=>{setIsAddParticipant(true)}}/>}
    </div>
  </div>)
  };

export default TeamMembers;