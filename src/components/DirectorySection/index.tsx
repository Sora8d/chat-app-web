import React, { useContext, useEffect, useState } from "react";
import { MembersCards } from "./components/MembersCards";
import { AddParticipantCard, NewParticipantsSearchContacts } from "./components/AddParticipants";
import "./directorySection.scss";
import "./components/ProfileCard/ProfileCard.scss"
import { HiDotsVertical } from "react-icons/hi";
import FilesCard from "./components/FilesCard";
import { ConversationsContext } from "../../stores/ConversationsContext";
import { storageUsers, userConversation, userProfile } from "../../utils/interfaces";
import { ProfileSection } from "./components/ProfileCard";
import BackDrop from "../BackDrop/Backdrop";
import { IoIosArrowBack } from "react-icons/io";
import { SearchContactGroup } from "../common/searchContact/searchContact";
import { searchcontactContext, SearchContactProvider } from "../common/searchContact/contactsContext";
import TeamMembers from "./components/TeamMembers";

type DirectoryProps = {
  isDirectoryButton: boolean
}

function DirectorySection({isDirectoryButton}:DirectoryProps) {
  const ConvoCtx = useContext(ConversationsContext)
  const [userSelect, setUserSelect] = useState<userConversation | null>(null)
  const [displayDirectory, setDisplayDirectory] = useState<boolean>(false)
  


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
    {userSelect == null ? (<SearchContactProvider>
    <TeamMembers userSelect={setUserSelect}/> 
    </SearchContactProvider>)
    : profileCard(userSelect) }
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
