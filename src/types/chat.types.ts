import { User } from './user.types';

export type PrivateChat = {
  chatId: number;
  withUser: User;
  chatName: string;
};

export type GroupChat = {
  chatId: number;
  groupId: number;
  chatName: string;
};

export type Message = {
  ByUser: User;
  Message: string;
  SendAt: Date;
};
