import api from './API';
import { SERVER_URL, ServerRoutes } from '@/constants';
import { GroupChat, PrivateChat, Message } from '@/types/chat.types';

interface UserChatsResponse {
  groupChats: GroupChat[];
  privateChats: PrivateChat[];
}

export const GetUserChats = async () => {
  return (await api.get<UserChatsResponse>(`${SERVER_URL}/${ServerRoutes.GET_USER_CHATS}`)).data;
};

export const GetChatMessages = async (chatId: number) => {
  return (
    await api.get<Message[]>(`${SERVER_URL}/${ServerRoutes.GET_CHAT_MESSAGES}`, {
      params: {
        chatId,
      },
    })
  ).data;
};
export const SendMessage = async (chatId: number, message: string) => {
  return (
    await api.post<boolean>(`${SERVER_URL}/${ServerRoutes.SEND_MESSAGE}`, {
      chatId,
      message,
    })
  ).data;
};
