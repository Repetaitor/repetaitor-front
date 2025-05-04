import api from './API';
import { SERVER_URL, ServerRoutes } from '@/constants';
import { Essay } from '@/types';

export const addNewEssay = async (essayTitle: string, essayDescription: string, expectedWordCount: number) => {
  return (
    await api.post<Essay>(`${SERVER_URL}/${ServerRoutes.ADD_NEW_ESSAY}`, {
      essayTitle,
      essayDescription,
      expectedWordCount,
    })
  ).data;
};

export const getEssays = async () => {
  return (await api.get<Essay[]>(`${SERVER_URL}/${ServerRoutes.GET_USER_ESSAY}`)).data;
};

export const updateEssay = async (
  essayId: number,
  essayTitle: string,
  essayDescription: string,
  expectedWordCount: number,
) => {
  return (
    await api.put<Essay>(`${SERVER_URL}/${ServerRoutes.UPDATE_ESSAY}`, {
      essayId,
      essayTitle,
      essayDescription,
      expectedWordCount,
    })
  ).data;
};

export const deleteEssay = async (essayId: number) => {
  await api.delete(`${SERVER_URL}/${ServerRoutes.DELETE_ESSAY}`, { params: { essayId } });
};
