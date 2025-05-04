import api from './API';
import { SERVER_URL, ServerRoutes } from '@/constants';
import { Assignment } from '@/types';

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

export const getGroupAssignments = async (groupId: number) => {
  return (
    await api.get<Assignment[]>(`${SERVER_URL}/${ServerRoutes.GET_GROUP_ASSIGNMENTS}`, {
      params: {
        groupId,
        offset: 0,
        limit: 100,
      },
    })
  ).data;
};
