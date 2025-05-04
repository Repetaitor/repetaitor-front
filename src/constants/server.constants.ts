export const SERVER_URL = 'https://repetaitor.bsite.net/api';

export enum ServerRoutes {
  // User
  SIGN_IN = 'User/SignIn',
  SIGN_UP = 'User/SignUp',
  ME = 'User/Me',
  SIGN_OUT = 'User/SignOut',
  VERIFY_AUTH_CODE = 'User/VerifyAuthCode',

  // Group
  GET_TEACHER_GROUPS = 'Group/GetTeacherGroups',
  CREATE_GROUP = 'Group/CreateGroup',
  GET_GROUP_USERS = 'Group/GetGroupUsers',
  DELETE_GROUP = 'Group/DeleteGroup',
  REMOVE_STUDENT_FROM_GROUP = 'Group/RemoveStudentFromGroup',

  // Assignment
  CREATE_NEW_ASSIGNMENT = 'Assignment/CreateNewAssignment',
  GET_GROUP_ASSIGNMENTS = 'Assignment/GetGroupAssignments',
}
