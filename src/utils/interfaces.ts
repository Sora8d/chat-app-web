import { JsxElement } from "typescript";
import { apiResponseFix } from "./back/request_interfaces";

const null_uuid_string = "0000000-00000000-00000"
const null_uuid:uuid = {uuid: null_uuid_string}

interface uuid{
  uuid: string
}

interface apiResponse{
  response: {
    status: number;
    message: string;
  }
}

const CreateDummyUserProfile = (par0: {
  uuid?: string,
  phone?: string,
  first_name?: string,
  last_name?: string,
  user_name?: string,
  description?: string,
  avatar_url?: string,
  created_at?: number}):userProfile => {
    return {
      uuid: {uuid: (par0.uuid != undefined) ? par0.uuid : "00000000-0000-0000-0000-000000000000"},
      phone: (par0.phone != undefined) ? par0.phone : "00000000",
      first_name: par0.first_name,
      last_name: par0.last_name,
      user_name: (par0.user_name) ? par0.user_name : "",
      description: (par0.description) ? par0.description : "",
      avatar_url: par0.avatar_url,
      created_at: (par0.created_at) ? par0.created_at : 0,
    }
}

interface userProfile{
  uuid: uuid,
  phone: string,
  first_name?: string,
  last_name?: string,
  user_name: string,
  description?: string,
  avatar_url?: string,
  created_at: number
}

interface conversation{
    name?: string,
    uuid: uuid,
    avatar_url?:string,
    type: number,
    created_at: number,
    last_msg?: message
  
}

interface userConversation{
  uuid: uuid,
  user_uuid: uuid,
  last_access_uuid: uuid,
  created_at: number
}

interface conversationWParticipants{
  conversation: conversation, user_conversation: userConversation, participants: userConversation[], unread_messages: number
}

interface PrivateConvo extends conversationWParticipants{
  private: true
}

interface GroupConvo extends conversationWParticipants{
  private: false
}

interface NewConvo extends conversationWParticipants{
  private: boolean,
  new: true,
}

interface message{
  uuid: uuid,
  conversation_uuid: uuid,
  author_uuid: uuid,
  text: string,
  created_at: number,
  updated_at: number
}

interface objectInterface {
  firstName: string;
  lastName: string;
  createdAt: number;
  profileImg: string;
  message: string;
  unread: number;
  badges: {
    backgroundColor: string;
    color: string;
    text: string;
  };
  id: number;
}

interface contactsCardProps {
  profileImg: string;
  name: string;
  lastMessage: string;
  badges: {
    text: string;
    color: string;
    backgroundColor: string;
  }[];
  selected: string;
  timeAgo: number;
  toggleSelected: () => void;
  unread: number;
}

interface storageUsers {
 [uuid:string]: userProfile; 
}

interface newError {
  danger: number
  message: string
}

export {null_uuid_string,null_uuid,CreateDummyUserProfile}
export type {  NewConvo,storageUsers,PrivateConvo, conversation, userConversation, GroupConvo, objectInterface, contactsCardProps, conversationWParticipants, uuid, message, userProfile, newError };
