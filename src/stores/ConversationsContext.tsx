import { useEffect, useState, useRef, ReactNode, useContext } from "react";
import React from "react";
import { getConvers } from "../utils/back/conversutils";
import { getUsers } from "../utils/back/usersutils";
import { PrivateConvo, NewConvo,GroupConvo,objectInterface, conversationWParticipants, uuid, userProfile, null_uuid, storageUsers } from "../utils/interfaces";
import { AuthContext } from "./AuthContext";

interface propsInterface {
  children: ReactNode;
}

const ConversationsContext = React.createContext<{
  users: storageUsers,
  conversations: (PrivateConvo | GroupConvo)[],
  selected: PrivateConvo | GroupConvo | NewConvo | undefined,
  setSelected: (arg0: PrivateConvo | GroupConvo) => void
  setAwaitForConvo: (arg0: string | null) => void
}>({
  users: {},
  conversations: [],
  selected: undefined,
  setSelected: (arg0: PrivateConvo | GroupConvo) => {},
  setAwaitForConvo: (arg0: string | null) => {}
});

const ConversationsProvider: React.FC<propsInterface> = ({ children }) => {
  const [users, setUsers] = useState<storageUsers>({});
  const [conversations, setConversations] = useState<(PrivateConvo | GroupConvo)[]>([]);
  const [selected, setSelected] = useState<PrivateConvo | GroupConvo | NewConvo | undefined>();
  const AuthCtx = useContext(AuthContext)
  const authInfo = AuthCtx.userInfo
  let logged = AuthCtx.logged

  const [timeout, setTimeoutVariable] = useState<NodeJS.Timeout | null>(null)

  const [AwaitForConvo, setAwaitForConvo] = useState<string|null>(null)

  let fetch_AuthUser = true;
  const short_poll = async () => {
    const func = async () => {
        const convers = await AuthCtx.requestsManager<conversationWParticipants[]>(getConvers);
        let classified_convos:(PrivateConvo | GroupConvo)[] = []
        let unknown_users: uuid[] = []
        convers.forEach((conver) => {
          conver.participants.forEach((user)=>{
            let user_stored: userProfile | undefined = users[user.user_uuid.uuid]
            if (user_stored == undefined && !(user.user_uuid.uuid in unknown_users)){
              unknown_users.push(user.user_uuid)
            }
          })
          let transform_convo: PrivateConvo | GroupConvo
          if (conver.conversation.type == 1) {
            transform_convo = {...conver, private:true} as PrivateConvo
            classified_convos.push(transform_convo)
          } else {
            transform_convo = {...conver, private:false} as GroupConvo
            classified_convos.push(transform_convo)
          }
          if (selected != undefined && selected?.conversation.uuid.uuid == transform_convo.conversation.uuid.uuid) {
            setSelected(transform_convo)
          }
        })

        if (fetch_AuthUser){
          unknown_users.push(authInfo.uuid!)
          fetch_AuthUser = false
        }
        if (unknown_users.length > 0){
          const new_users = await AuthCtx.requestsManager<storageUsers | undefined>(getUsers,unknown_users);
          setUsers({...users, ...new_users})
        }
        setTimeoutVariable(null);
        setConversations(classified_convos);
    };
    func()
    }

  useEffect(() =>{
    const func = async () =>{
    if (timeout == null) {
      setTimeoutVariable(setTimeout(()=>{short_poll()}, 3000));
    }
  }
    func()
//If AwaitForConvo is not null, then the conversation was a "fake" one and a message/groupchat was sent creating a new conversation.
//This looks for the created conversation.
    if (AwaitForConvo != null){
      conversations.forEach((conversation_object) => {
        if (conversation_object.conversation.uuid.uuid == AwaitForConvo) {
            setSelected(conversation_object)
            setAwaitForConvo(null)
        }
    });
    };
  }, [conversations]);

  return (
    <ConversationsContext.Provider value={{ users, conversations, selected, setSelected, setAwaitForConvo }}>
      {children}
    </ConversationsContext.Provider>
  );
};

export { ConversationsProvider, ConversationsContext };
