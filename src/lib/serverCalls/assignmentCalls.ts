import api from './API';
import { SERVER_URL, ServerRoutes } from '@/constants';
import {
  Assignment,
  AssignmentEvaluation,
  AssignmentWithCompletion,
  EvaluationComment,
  EvaluationTextComment,
  StudentAssignment,
} from '@/types';

export const createNewAssignment = async (groupId: number, essayId: number, dueDate: Date, instructions?: string) => {
  return (
    await api.post<Assignment>(`${SERVER_URL}/${ServerRoutes.CREATE_NEW_ASSIGNMENT}`, {
      groupId,
      essayId,
      instructions,
      dueDate,
    })
  ).data;
};

interface AssignmentsResponse {
  result: AssignmentWithCompletion[];
  totalCount: number;
}

export const getGroupAssignments = async (groupId: number) => {
  return (
    await api.get<AssignmentsResponse>(`${SERVER_URL}/${ServerRoutes.GET_GROUP_ASSIGNMENTS}`, {
      params: {
        groupId,
        offset: 0,
        limit: 100,
      },
    })
  ).data.result;
};

interface StudentAssignmentsResponse {
  result: StudentAssignment[];
  totalCount: number;
}

export const getStudentAssignments = async (studentId: number, isAIAssignment: boolean) => {
  return (
    await api.get<StudentAssignmentsResponse>(`${SERVER_URL}/${ServerRoutes.GET_USER_ASSIGNMENTS}`, {
      params: {
        userId: studentId,
        isAIAssignment,
        offset: 0,
        limit: 100,
      },
    })
  ).data.result;
};

export const getAssignmentBaseInfoById = async (assignmentId: number) => {
  return (
    await api.get<Assignment>(`${SERVER_URL}/${ServerRoutes.GET_ASSIGNMENT_BASE_INFO_BY_ID}`, {
      params: {
        assignmentId,
      },
    })
  ).data;
};

export const saveOrSubmitAssignment = async (
  assignmentId: number,
  text: string,
  wordCount: number,
  isSubmitted: boolean,
  images: string[],
) => {
  return (
    await api.post<void>(`${SERVER_URL}/${ServerRoutes.SAVE_OR_SUBMIT_ASSIGNMENT}`, {
      assignmentId,
      text,
      wordCount,
      isSubmitted,
      images,
    })
  ).data;
};

export const getUserAssignment = async (userId: number, assignmentId: number) => {
  return (
    await api.get<AssignmentEvaluation>(`${SERVER_URL}/${ServerRoutes.GET_USER_ASSIGNMENT}`, {
      params: {
        userId,
        assignmentId,
      },
    })
  ).data;
};

export const getNeedEvaluationAssignments = async () => {
  return (
    await api.get<StudentAssignmentsResponse>(`${SERVER_URL}/${ServerRoutes.GET_NEED_EVALUATION_ASSIGNMENTS}`, {
      params: {
        offset: 0,
        limit: 100,
      },
    })
  ).data.result;
};

export const evaluateAssignment = async (
  userId: number,
  assignmentId: number,
  fluencyScore: number,
  grammarScore: number,
  evaluationTextComments: EvaluationTextComment[],
  generalComments: EvaluationComment[],
) => {
  return await api.put<void>(`${SERVER_URL}/${ServerRoutes.EVALUATE_ASSIGNMENT}`, {
    userId,
    assignmentId,
    fluencyScore,
    grammarScore,
    evaluationTextComments,
    generalComments,
  });
};

export const getUsersTasksByAssignment = async (assignmentId: number) => {
  return (
    await api.get<StudentAssignmentsResponse>(`${SERVER_URL}/${ServerRoutes.GET_USERS_TASKS_BY_ASSIGNMENT}`, {
      params: {
        assignmentId,
        offset: 0,
        limit: 100,
      },
    })
  ).data.result;
};

export const getTextFromImages = async (base64Array: string[]) => {
  const response = await api.post<string>(`${SERVER_URL}/${ServerRoutes.GET_TEXT_FROM_IMAGES}`, base64Array);
  return response.data;
};

export const getPublicUserAssignments = async (assignmentId: number) => {
  return (
    await api.get<StudentAssignment[]>(`${SERVER_URL}/${ServerRoutes.GET_PUBLIC_USER_ASSIGNMENTS}`, {
      params: {
        assignmentId,
      },
    })
  ).data;
};

export const changeUserAssignmentPublicStatus = async (assignmentId: number) => {
  return (
    await api.put<{ result: boolean }>(`${SERVER_URL}/${ServerRoutes.CHANGE_USER_ASSIGNMENT_PUBLIC_STATUS}`, {
      assignmentId,
    })
  ).data.result;
};

export const deleteAssignment = async (assignmentId: number) => {
  return (
    await api.delete<void>(`${SERVER_URL}/${ServerRoutes.DELETE_ASSIGNMENT}`, {
      params: {
        assignmentId,
      },
    })
  ).data;
};
