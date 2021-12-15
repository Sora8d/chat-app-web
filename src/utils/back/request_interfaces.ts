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
        conversation_uuid: uuid,
    }
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

export type {SendMessageInterface, AuthLoginResponse as AuthInfoInterface, AuthInfo, uuid, apiResponse, apiResponseFix, AuthRegisterResponse,LoginProp, RegisterProp}