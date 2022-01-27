import React, { useContext, useEffect, useState } from "react";
import { MembersCards } from "./components/MembersCards";
import "./directorySection.scss";
import "./components/ProfileCard/ProfileCard.scss"
import { HiDotsVertical } from "react-icons/hi";
import FilesCard from "./components/FilesCard";
import { ConversationsContext } from "../../stores/ConversationsContext";
import { userConversation, userProfile } from "../../utils/interfaces";
import { ProfileSection } from "./components/ProfileCard";
import BackDrop from "../BackDrop/Backdrop";
import { IoIosArrowBack } from "react-icons/io";

type DirectoryProps = {
  isDirectoryButton: boolean
}

function DirectorySection({isDirectoryButton}:DirectoryProps) {
  const ConvoCtx = useContext(ConversationsContext)
  const [participants, setParticipants] = useState<userConversation[]>([])
  useEffect(()=>{
    if (ConvoCtx.selected?.participants != undefined) {
      setParticipants(ConvoCtx.selected?.participants)
    }
  }, [ConvoCtx.selected])
  const [userSelect, setUserSelect] = useState<userConversation | null>(null)

  const [displayDirectory, setDisplayDirectory] = useState<boolean>(false)
  

  const TeamMembers = () => {
    const [IsAddParticipant, setIsAddParticipant] =useState<boolean>(false)
    return (
    <div className="DirectoryCont__main">
    <div className="DirectoryCont__main__flex">
    <h4>Team Members</h4>
    <div>{participants.length}</div>
    </div>
    <div className="DirectoryCont__main__cards">
      {participants.map((participant) => {
        let user=ConvoCtx.users[participant.user_uuid.uuid];
        const SelectMember = () => {
          setUserSelect(participant)
        };
        return <MembersCards user={user} select={SelectMember}/>
      })}
    </div>
  </div>)
  };
  const profileCard = (selectedProfile: userConversation) => {
    const DeselectMember = () => {
      setUserSelect(null)
    }
    return (<div className="DirectoryCont__main">
    <div className="ProfileCard">
      <ProfileSection user={selectedProfile!} deselect={DeselectMember}/>
      </div>
      </div>)
  };

  const directoryContent = (class_string:string) => {
    return (<div className={class_string}>
    <div className="DirectoryCont__head">
      <h2>Directory</h2>
      <button data-testid="MoreButton" className="DirectoryCont__head__more">
        <HiDotsVertical className="DirectoryCont__head__more__icon" />
      </button>
    </div>
    {userSelect == null ? <TeamMembers/> : profileCard(userSelect) }

    <div className="DirectoryCont__main">
      <div className="DirectoryCont__main__flex">
        <h4>Media</h4>
        <div>0</div>
      </div>
      <div className="DirectoryCont__main__cards">
      </div>
    </div>
    <div className="DirectoryCont__main">
      <div className="DirectoryCont__main__flex">
        <h4>Files</h4>
        <div>0</div>
      </div>
      <div className="DirectoryCont__main__cards">
      </div>
</div>
</div>)
  };

  return (
    <div>
      { isDirectoryButton ?
      (displayDirectory ? <div>
        {directoryContent("DirectoryContFloating")}
        <BackDrop turnbackdropoff={()=>{setDisplayDirectory(false)}}/>
      </div> : <div className="DirectoryButton" onClick={()=>{setDisplayDirectory(true)}}>
        <div>
          <IoIosArrowBack size={40}/>
        </div>
      </div>)
     :  directoryContent("DirectoryCont") 
  }
  </div>
  );
}

export default DirectorySection;
{
}
