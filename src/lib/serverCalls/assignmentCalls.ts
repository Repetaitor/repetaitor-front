import api from './API';
import { SERVER_URL, ServerRoutes } from '@/constants';
import { Assignment, StudentAssignment } from '@/types';

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
  result: Assignment[];
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

export const getStudentAssignments = async (studentId: number) => {
  return (
    await api.get<StudentAssignmentsResponse>(`${SERVER_URL}/${ServerRoutes.GET_USER_ASSIGNMENTS}`, {
      params: {
        userId: studentId,
        offset: 0,
        limit: 100,
      },
    })
  ).data.result;
};
