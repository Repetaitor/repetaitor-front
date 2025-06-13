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
  GET_STUDENT_GROUPS = 'Group/GetStudentGroups',
  ADD_STUDENT_TO_GROUP = 'Group/AddStudentToGroup',

  // Assignment
  CREATE_NEW_ASSIGNMENT = 'Assignment/CreateNewAssignment',
  GET_GROUP_ASSIGNMENTS = 'Assignment/GetGroupAssignments',
  GET_USER_ASSIGNMENTS = 'Assignment/GetUserAssignments',
  GET_USER_ASSIGNMENT = 'Assignment/GetUserAssignment',
  GET_ASSIGNMENT_BASE_INFO_BY_ID = 'Assignment/GetAssignmentBaseInfoById',
  SAVE_OR_SUBMIT_ASSIGNMENT = 'Assignment/SaveOrSubmitAssignment',
  GET_NEED_EVALUATION_ASSIGNMENTS = 'Assignment/GetNeedEvaluationAssignments',
  EVALUATE_ASSIGNMENT = 'Assignment/EvaluateAssignment',
  GET_USERS_TASKS_BY_ASSIGNMENT = 'Assignment/GetUsersTasksByAssignment',

  // Essay
  ADD_NEW_ESSAY = 'Essay/AddNewEssay',
  GET_USER_ESSAY = 'Essay/GetUserEssay',
  UPDATE_ESSAY = 'Essay/UpdateEssay',
  DELETE_ESSAY = 'Essay/DeleteEssay',
  GET_TEXT_FROM_IMAGES = 'Assignment/GetTextFromImage',
}
