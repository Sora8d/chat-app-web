import React from "react";
import { contactsCardProps} from "../../../utils/interfaces";
import { TimeAgo } from "../../../utils/timeAgoCalculator";
import Avatar from "../../common/Avatar/Avatar";
import "./contactsCard.scss";

const ContactsCard: React.FC<contactsCardProps> = ({
  profileImg,
  name,
  lastMessage,
  badges,
  selected,
  timeAgo,
  toggleSelected,
  unread
}) => {
  return (
    <div
      className={"contactCard " + selected + " "}
      onClick={toggleSelected}
      data-testid="card"
    >
      <Avatar size={48} profileImg={profileImg} />
      <div className="contactCard__info">
        <h2>{`${name}`}</h2>
        <h3>{lastMessage}</h3>
        <div className="contactCard__info__badges">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="contactCard__info__badges__badge"
              style={{
                backgroundColor: badge.backgroundColor,
                color: badge.color
              }}
            >
              {badge.text}
            </div>
          ))}
        </div>
      </div>
      <div className="contactCard__timeAgo">{TimeAgo(timeAgo)}</div>
      {unread > 0 ? <div className="contactCard__unread">{unread}</div> : null}
    </div>
  );
};

export default ContactsCard;
