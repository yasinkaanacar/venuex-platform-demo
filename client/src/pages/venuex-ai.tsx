import { useState } from 'react';
import { Bot, Lightbulb, Send, MessageSquare } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const exampleQuestions = [
  "Which locations had the sharpest rating drop last month?",
  "What are the top recurring complaints in negative reviews?",
  "How has the sentiment for 'staff service' changed recently?"
];

export default function VenueXAI() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { role: 'user', content: inputValue }]);
      setInputValue('');
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'This is a demo response. Real AI integration will be added soon.' 
        }]);
      }, 1000);
    }
  };

  const handleExampleClick = (question: string) => {
    setMessages([...messages, { role: 'user', content: question }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a demo response. Real AI integration will be added soon.' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-white border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
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
  );
}
