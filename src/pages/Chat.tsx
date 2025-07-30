import { useAuthContext } from '@/store';
import { useCallback, useEffect, useState, useRef } from 'react';
import { GetUserChats, GetChatMessages } from '@/lib/serverCalls/chatCalls';
import { PrivateChat, Message, GroupChat } from '@/types/chat.types';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { Card, CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as signalR from '@microsoft/signalr';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Loader2 } from 'lucide-react';
const Chat = () => {
  const { activeUser } = useAuthContext();
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedChatId, setSelectedChat] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);
  const [message, setMessage] = useState<string>('');
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44317/chatHub')
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveMessage', (chatId: string, message: Message) => {
      if (chatId === selectedChatId.toString()) {
        setMessages((prev) => [...prev, message]);
      }
    });

    connection
      .start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch((err) => console.error('Connection failed: ', err));

    return () => {
      connection.stop();
    };
  }, [selectedChatId]);

  const fetchChats = useCallback(async () => {
    const chats = await GetUserChats();
    setGroupChats(chats.groupChats);
    setPrivateChats(chats.privateChats);
    setChatsLoading(false);
  }, [setChatsLoading]);
  const fetchChatMessages = useCallback(async () => {
    setMessagesLoading(true);
    console.log('fetching chat messages');
    const messages = await GetChatMessages(selectedChatId);
    console.log(messages);
    setMessages(messages);
    setMessagesLoading(false);
  }, [selectedChatId]);
  const sendMessage = useCallback(
    async (message: string) => {
      if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
        try {
          await connectionRef.current.invoke('SendMessage', message, selectedChatId.toString());
          setMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    },
    [selectedChatId],
  );
  useEffect(() => {
    fetchChats();
  }, [fetchChats, activeUser]);

  useEffect(() => {
    if (selectedChatId !== 0) {
      fetchChatMessages();
    }
  }, [fetchChatMessages, selectedChatId]);

  return (
    <div>
      <DashboardLayout isPageLoading={chatsLoading}>
        <div className="flex gap-4">
          <Card className="glass border-muted/30" style={{ width: '30%' }}>
            <CardHeader>
              <CardTitle>ჩატები</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {privateChats.map((chat) => (
                <div
                  onClick={() => setSelectedChat(chat.chatId)}
                  style={{
                    backgroundColor: '#23272f',
                    padding: 10,
                    borderRadius: 10,
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
              {groupChats.map((chat) => (
                <div
                  onClick={() => setSelectedChat(chat.chatId)}
                  style={{
                    backgroundColor: '#23272f',
                    padding: 10,
                    borderRadius: 10,
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
            </CardContent>
          </Card>
          {selectedChatId !== 0 ? (
            <Card className="glass border-muted/30" style={{ width: '70%' }}>
              <CardHeader>
                <CardTitle>ჩატი</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea.Root className="ScrollAreaRoot" style={{ backgroundColor: '#23272f' }}>
                  <ScrollArea.Viewport
                    ref={viewportRef}
                    className="ScrollAreaViewport"
                    style={{ backgroundColor: '#23272f', padding: 10, borderRadius: 5, height: '500px' }}
                  >
                    {messagesLoading ? (
                      <div className="flex h-full items-center justify-center" style={{ height: '500px' }}>
                        <Loader2 className="h-5 w-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {messages.length === 0 ? (
                          <div className="flex h-full items-center justify-center" style={{ height: '500px' }}>
                            <p className="text-gray-400">ჩატი ცარიელია</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div className="flex flex-col" style={{ marginBottom: 10 }}>
                              {message.byUser.id !== activeUser?.id ? (
                                <div style={{ fontSize: 12, padding: 5, wordBreak: 'break-word', textAlign: 'left' }}>
                                  {message.byUser.firstName} {message.byUser.lastName}
                                </div>
                              ) : (
                                <></>
                              )}
                              <div
                                style={{
                                  maxWidth: '50%',
                                  right: 0,
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  borderBottomLeftRadius: message.byUser.id === activeUser?.id ? 10 : 0,
                                  borderBottomRightRadius: message.byUser.id === activeUser?.id ? 0 : 10,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  width: 'fit-content',
                                  alignSelf: message.byUser.id === activeUser?.id ? 'flex-end' : 'flex-start',
                                  backgroundColor: message.byUser.id === activeUser?.id ? '#4f8cff' : 'black',
                                  color: message.byUser.id === activeUser?.id ? 'white' : 'lightgray',
                                  textAlign: message.byUser.id === activeUser?.id ? 'right' : 'left',
                                }}
                              >
                                <div style={{ fontSize: 14, padding: 15, wordBreak: 'break-word', textAlign: 'left' }}>
                                  {message.message}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Corner className="ScrollAreaCorner" />
                </ScrollArea.Root>
                <div className="flex gap-2">
                  <Input
                    placeholder="შეიყვანეთ შეტყობინება"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button onClick={() => sendMessage(message)}>გაგზავნა</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <></>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Chat;
