import { SERVER_URL, ServerRoutes } from '@/constants';
import { TeacherDashboardInfo, User, UserRole } from '@/types';
import api from './API';

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
  return (await api.post<RegisterUserResponse>(`${SERVER_URL}/${ServerRoutes.SIGN_UP}`, userData)).data;
};

interface VerifyAuthCodeResponse {
  verified: boolean;
}

export const verifyAuthCode = async (guid: string, email: string, code: string) => {
  return (
    await api.post<VerifyAuthCodeResponse>(`${SERVER_URL}/${ServerRoutes.VERIFY_AUTH_CODE}`, {
      guid,
      email,
      code,
    })
  ).data;
};

export const signIn = async (email: string, password: string) => {
  return (await api.post<User>(`${SERVER_URL}/${ServerRoutes.SIGN_IN}`, { email, password })).data;
};

export const meAuth = async () => {
  return (await api.get<User>(`${SERVER_URL}/${ServerRoutes.ME}`)).data;
};

export const signOut = async () => {
  return (await api.post(`${SERVER_URL}/${ServerRoutes.SIGN_OUT}`)).data;
};

export const groupAveragePoints = async () => {
  return (await api.get<TeacherDashboardInfo>(`${SERVER_URL}/${ServerRoutes.GET_TEACHER_DASHBOARD_INFO}`)).data;
};
