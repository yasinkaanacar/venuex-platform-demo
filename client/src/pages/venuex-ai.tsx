import { useState, useRef, useEffect } from 'react';
import { Bot, Lightbulb, Send, MessageSquare, Plus, Clock, Trash2, Pencil, Check, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const exampleQuestions = [
  "Which locations had the sharpest rating drop last month?",
  "What are the top recurring complaints in negative reviews?",
  "How has the sentiment for 'staff service' changed recently?"
];

interface ChatSession {
  id: string;
  title: string;
  messages: {role: 'user' | 'assistant', content: string}[];
  createdAt: Date;
}

const initialChatHistory: ChatSession[] = [
  {
    id: '1',
    title: 'Rating drop analysis',
    messages: [
      { role: 'user', content: 'Which locations had the sharpest rating drop last month?' },
      { role: 'assistant', content: 'Based on the data, the Kadıköy location showed the most significant rating drop of 0.8 points, followed by Beşiktaş with a 0.5 point decrease. The main factors appear to be wait times and staff availability issues.' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '2',
    title: 'Negative review patterns',
    messages: [
      { role: 'user', content: 'What are the top recurring complaints in negative reviews?' },
      { role: 'assistant', content: 'The top 3 recurring complaints are: 1) Long wait times (mentioned in 45% of negative reviews), 2) Product availability issues (32%), and 3) Staff responsiveness (28%). I recommend focusing on queue management during peak hours.' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: '3',
    title: 'Staff service sentiment',
    messages: [
      { role: 'user', content: 'How has the sentiment for staff service changed recently?' },
      { role: 'assistant', content: 'Staff service sentiment has improved by 12% over the last quarter. Positive mentions of "helpful staff" increased from 156 to 203 reviews. The training program implemented in September appears to be having a positive impact.' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  }
];

export default function VenueXAI() {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(initialChatHistory);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chatHistory.find(chat => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      if (activeChatId) {
        setChatHistory(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, { role: 'user' as const, content: inputValue }] }
            : chat
        ));
        setInputValue('');
        setTimeout(() => {
          setChatHistory(prev => prev.map(chat => 
            chat.id === activeChatId 
              ? { ...chat, messages: [...chat.messages, { role: 'assistant' as const, content: 'This is a demo response. Real AI integration will be added soon.' }] }
              : chat
          ));
        }, 1000);
      } else {
        const newChat: ChatSession = {
          id: Date.now().toString(),
          title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
          messages: [{ role: 'user', content: inputValue }],
          createdAt: new Date()
        };
        setChatHistory(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setInputValue('');
        setTimeout(() => {
          setChatHistory(prev => prev.map(chat => 
            chat.id === newChat.id 
              ? { ...chat, messages: [...chat.messages, { role: 'assistant' as const, content: 'This is a demo response. Real AI integration will be added soon.' }] }
              : chat
          ));
        }, 1000);
      }
    }
  };

  const handleExampleClick = (question: string) => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: question.slice(0, 30) + (question.length > 30 ? '...' : ''),
      messages: [{ role: 'user', content: question }],
      createdAt: new Date()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setTimeout(() => {
      setChatHistory(prev => prev.map(chat => 
        chat.id === newChat.id 
          ? { ...chat, messages: [...chat.messages, { role: 'assistant' as const, content: 'This is a demo response. Real AI integration will be added soon.' }] }
          : chat
      ));
    }, 1000);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const handleStartRename = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: editingTitle.trim() } : chat
      ));
    }
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Chat History Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chat History</span>
          </div>
          
          <Button 
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
            data-testid="button-new-chat"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => editingChatId !== chat.id && setActiveChatId(chat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-center justify-between cursor-pointer ${
                  activeChatId === chat.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-100 border border-transparent'
                }`}
                data-testid={`chat-history-${chat.id}`}
              >
                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(chat.id);
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded px-2 py-0.5 w-full focus:outline-none focus:border-blue-400"
                        data-testid={`rename-input-${chat.id}`}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveRename(chat.id); }}
                        className="p-1 hover:bg-green-100 rounded transition-all"
                        data-testid={`save-rename-${chat.id}`}
                      >
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancelRename(); }}
                        className="p-1 hover:bg-gray-200 rounded transition-all"
                        data-testid={`cancel-rename-${chat.id}`}
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`text-sm font-medium truncate ${
                        activeChatId === chat.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {formatTimeAgo(chat.createdAt)}
                      </div>
                    </>
                  )}
                </div>
                {editingChatId !== chat.id && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => handleStartRename(chat.id, chat.title, e)}
                      className="p-1 hover:bg-blue-100 rounded transition-all"
                      data-testid={`rename-chat-${chat.id}`}
                    >
                      <Pencil className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="p-1 hover:bg-red-100 rounded transition-all"
                      data-testid={`delete-chat-${chat.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {chatHistory.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No chat history yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">VenueX AI Chat</h1>
              <p className="text-xs text-gray-500">Ask questions about your locations and reviews</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <Card className="bg-white border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to VenueX AI Assistant!
                  </h2>
                  <p className="text-gray-500 text-center mb-8">
                    Ask questions about your locations and reviews.
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Example Questions:</span>
                  </div>

                  <div className="w-full max-w-lg space-y-3">
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(question)}
                        className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-700 bg-white"
                        data-testid={`example-question-${index}`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.role === 'assistant' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type your question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                  data-testid="chat-input"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-600"
                  data-testid="button-attach"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
