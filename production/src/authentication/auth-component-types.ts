export interface AuthenticateComponent{
  session: {
    username: string;
    password: string;
    envUrl: string;
    loginMode: string;
    isRememberMeOn: boolean
  };
  resetState: () => void;
}
