import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Send,
  MessageSquare,
  Loader2,
  ShieldCheck,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ContextualChatDrawer({ isOpen, onClose, entityType, entityId, title, user, participantUserId, mitraUserId }) {
  const { lang } = useLanguage();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && entityType && entityId) {
      loadConversation();
    }
  }, [isOpen, entityType, entityId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async () => {
    setLoading(true);
    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');

    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (participantUserId) params.append('participantUserId', participantUserId);
      if (mitraUserId) params.append('mitraUserId', mitraUserId);

      const convRes = await fetch(`/api/conversations/entity/${entityType}/${entityId}?${params.toString()}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (convRes.ok) {
        const convData = await convRes.json();
        const conv = convData.data || convData;
        setConversation(conv);

        // Load messages
        const msgRes = await fetch(`/api/conversations/${conv.id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.data || []);
        }
      }
    } catch (err) {
      console.warn('Chat load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation) return;

    setSending(true);
    const token = localStorage.getItem('mandi_user_token') || localStorage.getItem('token') || localStorage.getItem('mandi_token');

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messageText: inputText.trim(),
          messageType: 'TEXT'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.data || data]);
        setInputText('');
      }
    } catch (err) {
      console.warn('Send message failed:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-slideLeft">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-pine-950 to-stone-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-black text-sm text-emerald-100 truncate max-w-[240px]">
                {title || `${entityType} #${entityId}`}
              </h3>
              <p className="text-[10px] text-stone-300">Contextual Case Communication</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 text-xs">
          {loading ? (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-[11px]">Connecting to task conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-bold text-stone-700">No messages yet</p>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                Send a message to coordinate with the requester, provider, or Village Mitra.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-400 px-1 mb-0.5">
                    {isMe ? 'You' : m.senderName}
                  </span>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.messageText}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center space-x-2">
          <input
            type="text"
            id="chat-message-input"
            name="chatMessage"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={lang === 'hi' ? 'संदेश लिखें (Type a message)...' : 'Type a message...'}
            className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
