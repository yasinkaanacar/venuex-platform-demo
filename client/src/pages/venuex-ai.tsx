import { useState } from 'react';
import { Bot, Lightbulb, Send, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

const exampleQuestions = [
  "En Düşük Yorumlu 10 Lokasyon Hangileri?",
  "Bu Ay Kaç Yorum Aldık?",
  "En Yüksek Puanlı Mağazalarımız Hangileri?"
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
          content: 'Bu bir demo yanıttır. Gerçek AI entegrasyonu yakında eklenecektir.' 
        }]);
      }, 1000);
    }
  };

  const handleExampleClick = (question: string) => {
    setMessages([...messages, { role: 'user', content: question }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Bu bir demo yanıttır. Gerçek AI entegrasyonu yakında eklenecektir.' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">VenueX AI Chat</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/">
                <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
              </Link>
              <ChevronRight size={14} />
              <span className="text-blue-600">AI Chat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl border border-gray-200 min-h-[500px] flex flex-col">
            <div className="flex-1 p-8 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    VenueX AI Assistant'a Hoş Geldiniz!
                  </h2>
                  <p className="text-gray-500 text-center mb-8">
                    Lokasyonlarınız ve yorumlarınız hakkında soru sorabilirsiniz.
                  </p>

                  <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <Lightbulb className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">Örnek Sorular:</span>
                  </div>

                  <div className="w-full max-w-lg space-y-3">
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(question)}
                        className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-gray-700"
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
                          <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
          </div>
        </div>

        <div className="p-6 pt-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Sorunuzu yazın..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
              data-testid="chat-input"
            />
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-attach"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                inputValue.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
