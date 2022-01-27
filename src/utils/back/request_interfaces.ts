import internal from "stream";
import { message, conversationWParticipants, userProfile, storageUsers, userConversation, conversation } from "../interfaces";

interface uuid{
    uuid: string
  }

interface apiResponse{
  response: {
    status: number;
    message: string;
  }
}
interface apiResponseFix{
  status: number;
  message: string;
}


interface SendMessageInterface{
    message: {
        author_uuid: uuid,
        text: string,
        conversation_uuid?: uuid,
    },
    create_conversation?: boolean
    new_convo?: NewConversationInterface
}

interface NewConversationInterface{
  conversation: {
  name?: string,
  avatar_url?:string,
  type:number
  },
  participants: {user_uuid: uuid}[]

}

interface AuthInfo{
    uuid: uuid | undefined,
    access_token: string | undefined,
    refresh_token: string | undefined,
}

interface AuthLoginResponse {
    status: number
    data?: AuthInfo
}

interface AuthRegisterResponse {
  response: apiResponseFix
}

interface LoginProp {
    username:string,
    password:string
}

interface RegisterProp {
  login_info: {
    login_user:string,
    login_password:string
  },
  profile_info: {
    phone:string,
    first_name:string,
    last_name: string,
    avatar_url:string
  }
}

interface KickParticipantRequest{
  user_conversation: uuid,
  conversation: uuid
}

interface getConversationsUndefinedAllowed{
  conversation: conversation, user_conversation: userConversation, participants: userConversation[] | undefined, unread_messages: number
}

interface requestManagerProp<T> {
  data: T,
  response: apiResponseFix
}

type getMessagesResponse = requestManagerProp<message[]>

type getConversationResponseAllowUndefined = requestManagerProp<getConversationsUndefinedAllowed[]>

type getConversationsResponse = requestManagerProp<conversationWParticipants[]>

type UuidResponse = requestManagerProp<uuid | undefined>

type getUserProfilesResponse = requestManagerProp<userProfile[]>

type getStorageUsersResponse = requestManagerProp<storageUsers>

type KickParticipantResponse = requestManagerProp<undefined>

export type {UuidResponse, SendMessageInterface, AuthLoginResponse as AuthInfoInterface, AuthInfo, uuid, apiResponse, apiResponseFix, AuthRegisterResponse,LoginProp, RegisterProp, NewConversationInterface, requestManagerProp, getMessagesResponse, getConversationsResponse, getConversationResponseAllowUndefined, getUserProfilesResponse, getStorageUsersResponse, KickParticipantRequest, KickParticipantResponse}