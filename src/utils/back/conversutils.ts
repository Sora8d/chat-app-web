import { objectInterface } from "../interfaces";
import { UuidResponse, AuthInfo, SendMessageInterface, NewConversationInterface, uuid, getConversationsResponse, KickParticipantRequest, KickParticipantResponse, apiResponseFix, getConversationResponseAllowUndefined } from "./request_interfaces";
import { standardRequest, basic401Message } from "./common";
import { CreateMessage } from "./chatutils";
import { useContext } from "react";
import { AuthContext } from "../../stores/AuthContext";
import { conversationWParticipants } from "../interfaces";

const getConvers = async (userinfo:AuthInfo): Promise<getConversationsResponse> => {
  if (userinfo.access_token == undefined || userinfo.uuid == undefined){
    return basic401Message<never[]>([])
}

  const data = await fetch(
    `http://localhost:7999/conversation/`+userinfo.uuid.uuid,
    { method: "GET",
    headers: standardRequest(userinfo.access_token)}
  );
  const jn: getConversationResponseAllowUndefined= await data.json();
//This is just for testing
  if (jn.data == null) {
    jn.data = []
  } 
  jn.data.forEach(element => {
    if (element.conversation.name === undefined){
      element.conversation.name = "TEST";
    };
    if (element.participants === undefined) {
      element.participants = []
    }
  });
  return jn as getConversationsResponse;
};

const createConversRequest = async (userinfo:AuthInfo, text: string, type: number, participants: uuid[], name?:string, avatar_url?:string) => {
  if (userinfo.access_token == undefined || userinfo.uuid == undefined){
    return basic401Message<undefined>(undefined)
}
  let message = CreateMessage(userinfo.uuid, text)
  let body = createConversationMessage(message, createConversation(type, participants, name, avatar_url)) 
  const data = await fetch(
    `http://localhost:7999/message`,
    { method: "POST",
    headers: standardRequest(userinfo.access_token),
    body: JSON.stringify(body)
  }
    );
  const jn: UuidResponse = await data.json()
  console.log(jn.response)
  return jn
  };

const kickParticipantRequest = async(userinfo: AuthInfo, body:KickParticipantRequest):Promise<KickParticipantResponse> => {
  const data = await fetch("http://localhost:7999/conversation/kick_user", {
    method: "POST",
    headers: standardRequest(userinfo.access_token),
    body: JSON.stringify(body)
  })
  const jn: apiResponseFix = await data.json()
  return {data: undefined, response: jn}
}

const createConversationMessage = (message:SendMessageInterface, conversation_and_participants:NewConversationInterface):SendMessageInterface => {
  message.create_conversation = true
  message.new_convo= conversation_and_participants
  return message
}

const createConversation = (type:number, participants: uuid[], name?: string, avatar_url?: string):NewConversationInterface => {
  let participant_list: {user_uuid: uuid}[] = []
  participants.forEach((participant)=>{
    participant_list.push({user_uuid: participant})
  });
  return {
  conversation:  {
  name: name,
  type: type,
  avatar_url: avatar_url},
  participants: participant_list
};
};

const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export { getConvers, createConversRequest, kickParticipantRequest,randomNum };
