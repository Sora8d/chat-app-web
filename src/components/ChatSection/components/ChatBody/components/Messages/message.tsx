import { json } from "stream/consumers";
import { message, userProfile } from "../../../../../../utils/interfaces";
import Avatar from '../../../../../common/Avatar/Avatar';
import "./message.scss";

type MessageProps = {
    message: message,
    first: boolean,
    group: boolean
}

const Message = ({message, first, group}:MessageProps) => {
    const authorUuid: string= "6d49d38f-1dfc-4f3b-9d5c-4a8d590fa9a2"
    const placeholderSentMessage:string = `https://image.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg`
    const placeholderReceivedMessage:string = `'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'`

    let author_string = localStorage.getItem(message.author_uuid.uuid)
    if (author_string == null){
        return(
            <div>Error</div>
        )
    }
    let author_parsed: userProfile =  JSON.parse(author_string) 
    let mock_profile_pick: void = (() => {
        author_parsed.uuid.uuid == authorUuid ? author_parsed.avatar_url=placeholderSentMessage : author_parsed.avatar_url=placeholderReceivedMessage
    })()

    let sentOrReceived: string = (():string=>{
        let result = ""
        author_parsed.uuid.uuid == authorUuid ? result="__sent" : result="__received"
        return result;
    })()

    if (first) {
        return (
            <div className="chatTextColumn">
                <div className={"chatTextColumn__messageDiv chatTextColumn__messageDiv"+sentOrReceived}>
                    <p className={"chatTextColumn__text chatTextColumn__text"+sentOrReceived}>{message.text}</p>
                    <Avatar size={40} profileImg={author_parsed.avatar_url} />
                </div>

            </div>
        )
    }
    else {
        return (
            <div className="chatTextColumn">
                <div className={"chatTextColumn__messageDiv chatTextColumn__messageDiv__withoutAvatar" + sentOrReceived + " chatTextColumn__messageDiv"+sentOrReceived}>
                    <p className={"chatTextColumn__text"+sentOrReceived}>{message.text}</p>
                </div>
            </div>
        )
    }
}

export {Message}