import { SERVER_URL, ServerRoutes } from '@/constants';
import { Group, User } from '@/types';
import api from '@/lib/serverCalls/API.ts';

export const getTeacherGroups = async () => {
  return (await api.get<Group[]>(`${SERVER_URL}/${ServerRoutes.GET_TEACHER_GROUPS}`)).data;
};

export const createGroup = async (groupName: string) => {
  return (
    await api.post<Group>(`${SERVER_URL}/${ServerRoutes.CREATE_GROUP}`, {
      groupName,
    })
  ).data;
};

export const getGroupStudents = async (groupId: number) => {
  return (
    await api.get<User[]>(`${SERVER_URL}/${ServerRoutes.GET_GROUP_USERS}`, {
      params: {
        groupId,
      },
    })
  ).data;
};

export const deleteGroup = async (groupId: number) => {
  return (
    await api.delete(`${SERVER_URL}/${ServerRoutes.DELETE_GROUP}`, {
      params: {
        groupId,
      },
    })
  ).data;
};

export const removeStudentFromGroup = async (groupId: number, studentId: number) => {
  return (
    await api.delete(`${SERVER_URL}/${ServerRoutes.REMOVE_STUDENT_FROM_GROUP}`, {
      params: {
        groupId,
        userId: studentId,
      },
    })
  ).data;
};

export const getStudentGroup = async () => {
  return (await api.get<Group>(`${SERVER_URL}/${ServerRoutes.GET_STUDENT_GROUPS}`)).data;
};

export const addStudentToGroup = async (groupCode: string) => {
  return (
    await api.post(`${SERVER_URL}/${ServerRoutes.ADD_STUDENT_TO_GROUP}`, {
      groupCode,
    })
  ).data;
};
