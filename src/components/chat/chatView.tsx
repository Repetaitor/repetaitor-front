import * as React from 'react';
import { MessageCircle, X, ChevronLeft } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useAuthContext } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { GetUserChats, GetChatMessages } from '@/lib/serverCalls/chatCalls';
import { PrivateChat, Message, GroupChat } from '@/types/chat.types';

const ChatBaseView = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [animate, setAnimate] = React.useState('');
  const { activeUser } = useAuthContext();
  const [selectedChatId, setSelectedChat] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
  const fetchChats = useCallback(async () => {
    const chats = await GetUserChats();
    setGroupChats(chats.groupChats);
    setPrivateChats(chats.privateChats);
  }, []);
  const fetchChatMessages = useCallback(async () => {
    console.log('fetching chat messages');
    const messages = await GetChatMessages(selectedChatId);
    console.log(messages);
    setMessages(messages);
  }, [selectedChatId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats, activeUser]);

  useEffect(() => {
    if (selectedChatId !== 0) {
      fetchChatMessages();
    }
  }, [fetchChatMessages, selectedChatId]);

  useEffect(() => {
    if (isOpen) {
      setShowChat(true);
      setAnimate('enter');
      setTimeout(() => setAnimate('enter-active'), 10);
    } else if (showChat) {
      setAnimate('exit');
      setTimeout(() => setAnimate('exit-active'), 10);
      setTimeout(() => setShowChat(false), 310);
    }
  }, [isOpen, showChat]);

  useEffect(() => {
    if (!showChat) setAnimate('');
  }, [showChat]);

  return activeUser ? (
    <div className="flex flex-col items-center justify-center" style={{ position: 'fixed', bottom: 50, right: 50 }}>
      {showChat && (
        <div
          className={
            animate === 'enter'
              ? 'chat-animate-enter'
              : animate === 'enter-active'
                ? 'chat-animate-enter chat-animate-enter-active'
                : animate === 'exit'
                  ? 'chat-animate-exit'
                  : animate === 'exit-active'
                    ? 'chat-animate-exit chat-animate-exit-active'
                    : ''
          }
          style={{ width: 300, height: 500, backgroundColor: '#18181b', borderRadius: '5%' }}
        >
          <div
            style={{
              backgroundColor: 'transparent',
              padding: 10,
              width: '100%',
              alignContent: 'center',
              borderBottomStyle: 'solid',
              borderBottomWidth: 0.5,
              borderBottomColor: 'black',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {selectedChatId !== 0 ? (
                <button className="IconButton" onClick={() => setSelectedChat(0)}>
                  <ChevronLeft />
                </button>
              ) : (
                <div></div>
              )}
              <div style={{ alignSelf: 'center' }}>ჩატი</div>
              <div>
                <button className="IconButton" onClick={() => setIsOpen(!isOpen)}>
                  <X />
                </button>
              </div>
            </div>
          </div>
          <ScrollArea style={{ padding: 10 }}>
            {selectedChatId === 0 ? (
              <>
                {groupChats.map((chat) => (
                  <div
                    onClick={() => setSelectedChat(chat.chatId)}
                    style={{
                      backgroundColor: '#23272f',
                      padding: 10,
                      borderRadius: 20,
                      marginBottom: 10,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ marginLeft: 10 }}>{chat.chatName}</div>
                    <div style={{ marginRight: 10, color: 'lightblue', fontSize: 12 }}>Group Chat</div>
                  </div>
                ))}
                {privateChats.map((chat) => (
                  <div
                    onClick={() => setSelectedChat(chat.chatId)}
                    style={{
                      backgroundColor: '#23272f',
                      padding: 10,
                      borderRadius: 20,
                      marginBottom: 10,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ marginLeft: 10 }}>{chat.chatName}</div>
                    <div style={{ marginRight: 10, color: 'lightblue', fontSize: 12 }}>Private Chat</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    style={{
                      backgroundColor: '#23272f',
                      padding: 10,
                      borderRadius: 20,
                      marginBottom: 10,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    {message.message}
                  </div>
                ))}
              </>
            )}
          </ScrollArea>
        </div>
      )}
      {!showChat && (
        <button
          className="IconButton"
          style={{ backgroundColor: 'green', borderRadius: '50%', padding: 10 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle />
        </button>
      )}
    </div>
  ) : (
    <div></div>
  );
};

export default ChatBaseView;
