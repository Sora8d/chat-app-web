import { storageUsers, userProfile } from "../../../../../utils/interfaces";
import ContactsCard from "../../../../common/contactsCard/ContactsCard";

interface leaveBackdropProp {
    turnbackdropoff: () => void
}

const poblateSelectedContactsCard= (key:number, user:userProfile, selectFunc: (arg0:userProfile)=>void, context: {select: storageUsers; setSelect: (arg0: storageUsers) => void;
}):JSX.Element =>{
    return (
        <div className="GroupContactSelected">
                {poblateContactsCard(key, user, selectFunc, undefined)}
                <div className="GroupContactSelected__button" onClick={
                    ()=>{
                        let list_selected = context.select
                        delete list_selected[user.uuid.uuid]
                        context.setSelect(list_selected)
                    }
                }>X</div>
        </div>
    )
}

const poblateContactsCard = (key:number, user:userProfile, selectFunc: (arg0:userProfile)=>void, ignore:string[] | undefined):JSX.Element | null => {
    if (ignore != undefined && ignore.length > 0){
        if (ignore.includes(user.uuid.uuid)){
            return null
        }
    }
    return(<ContactsCard
        key={key}
        timeAgo={0}
        name={user.first_name! + " " + user.last_name!}
        lastMessage={user.phone}
        profileImg={user.avatar_url!}
        unread={0}
        badges={[]}
        selected=""
        toggleSelected={()=>{
            selectFunc(user)
        }}
        />)
}


export type {leaveBackdropProp}
export {poblateSelectedContactsCard
    ,poblateContactsCard};