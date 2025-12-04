import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Zap, TestTube, Sparkles, Trash2 } from 'lucide-react';
import { aiService } from '../services/aiService.js';

export default function TecIA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! 😊 Soy TecIA, tu asistente virtual. Puedo ayudarte con información sobre TecUnify o simplemente podemos conversar sobre lo que quieras. ¿Qué te gustaría saber o de qué te gustaría hablar?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const info = aiService.getCurrentModelInfo();
    setModelInfo(info);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await aiService.sendMessage(currentInput);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en TecIA:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `❌ ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(content);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '¡Hola! 😊 Soy TecIA, tu asistente virtual. Puedo ayudarte con información sobre TecUnify o simplemente podemos conversar sobre lo que quieras. ¿Qué te gustaría saber o de qué te gustaría hablar?',
        timestamp: new Date()
      }
    ]);
  };

  const testToken = async () => {
    setIsLoading(true);
    
    try {
      const result = await aiService.sendMessage('Hola, ¿cómo estás?');
      
      const testMessage = {
        id: Date.now(),
        type: 'bot',
        content: `✅ ¡Token verificado! Respuesta: ${result}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, testMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--bg-main)", color: "var(--text-color)" }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header con gradiente y animación */}
      <div 
        className="mb-6"
        style={{ animation: "slideIn 0.5s ease-out" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl bg-gradient-to-br text-white shadow-lg"
              style={{ 
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                animation: "float 3s ease-in-out infinite"
              }}
            >
              <Bot className="w-8 h-8" />
            </div>
            
            <div>
              <h1 
                className="text-4xl font-bold bg-gradient-to-r 
                           from-blue-500 to-indigo-500 bg-clip-text text-transparent"
              >
                TecIA Chat
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm opacity-70 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Asistente Virtual de TecUnify
                </p>
                {modelInfo && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Zap className="w-3 h-3" />
                    <span>{modelInfo.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="rounded-2xl border transition-all duration-300"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow)",
          animation: "slideIn 0.6s ease-out 0.1s both"
        }}
      >
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: "slideIn 0.3s ease-out" }}
            >
              {message.type === 'bot' && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  message.type === 'user'
                    ? 'text-white'
                    : 'border'
                }`}
                style={message.type === 'user' 
                  ? { background: "linear-gradient(135deg, #3b82f6, #2563eb)" }
                  : { 
                      background: "var(--card-bg)", 
                      borderColor: "var(--border-color)",
                      color: "var(--text-color)"
                    }
                }
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2 gap-3">
                  <span 
                    className="text-xs"
                    style={{ 
                      opacity: message.type === 'user' ? 0.8 : 0.6 
                    }}
                  >
                    {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.type === 'bot' && (
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="opacity-50 hover:opacity-100 transition"
                      title="Copiar mensaje"
                    >
                      {copiedMessageId === message.content ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start" style={{ animation: "slideIn 0.3s ease-out" }}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div 
                className="px-5 py-3 rounded-2xl border shadow-sm"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--border-color)"
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div 
          className="border-t p-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       transition-all"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-color)"
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 text-white rounded-xl disabled:opacity-50 
                       disabled:cursor-not-allowed transition-all duration-300 
                       hover:-translate-y-0.5 flex items-center gap-2 shadow-lg 
                       hover:shadow-xl font-medium"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}