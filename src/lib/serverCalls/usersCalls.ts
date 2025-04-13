import axios from 'axios';
import { SERVER_URL, ServerRoutes } from '@/constants';
import { User, UserRole } from '@/types';

interface RegisterUserResponse {
  guid: string;
}

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  return (await axios.post<RegisterUserResponse>(`${SERVER_URL}/${ServerRoutes.SIGN_UP}`, userData)).data;
};

interface VerifyAuthCodeResponse {
  verified: boolean;
}

export const verifyAuthCode = async (guid: string, email: string, code: string) => {
  return (
    await axios.post<VerifyAuthCodeResponse>(`${SERVER_URL}/${ServerRoutes.VERIFY_AUTH_CODE}`, {
      guid,
      email,
      code,
    })
  ).data;
};

interface SignInResponse {
  user: User;
  jwtToken: string;
}

export const signIn = async (email: string, password: string) => {
  return (await axios.post<SignInResponse>(`${SERVER_URL}/${ServerRoutes.SIGN_IN}`, { email, password })).data;
};
