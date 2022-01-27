import React from "react";
import "./MembersCards.scss";
import Avatar from "../../../common/Avatar/Avatar";
import { userProfile } from "../../../../utils/interfaces";
import { IoIosAddCircleOutline } from "react-icons/io";

interface MemberCardProps {
  user: userProfile
  select: () =>void
}

const MembersCards= ({user, select}:MemberCardProps) => {
  return (
    <div className="MemberCard" onClick={select}>
      <Avatar
        profileImg={user.avatar_url}
        size={48}
      />
      <div className="MemberCard__InfoFlex">
        <h5>{user.first_name + " " + user.last_name}</h5>
        <p>{user.description}</p>
      </div>
    </div>
  );
};

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

export { MembersCards , AddParticipantCard};
