export const SERVER_URL = 'https://repetaitor.bsite.net/api';

export enum ServerRoutes {
  SIGN_IN = 'User/SignIn',
  SIGN_UP = 'User/SignUp',
  ME = 'User/Me',
  SIGN_OUT = 'User/SignOut',
  VERIFY_AUTH_CODE = 'User/VerifyAuthCode',
  GET_TEACHER_GROUPS = 'Group/GetTeacherGroups',
  CREATE_GROUP = 'Group/CreateGroup',
}
