import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import io from 'socket.io-client';
import { Send, ArrowLeft, Image as ImageIcon, Search, Phone, Video, MoreVertical, MessageCircle, ArrowRightLeft, Star, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Chat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const messagesEndRef = useRef(null);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mb-6">
          <MessageCircle className="w-10 h-10 text-danger-tag" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign in to view messages</h2>
        <p className="text-text-muted mb-6">You need an account to chat with other swappers.</p>
        <button onClick={() => navigate('/auth')} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-primary transition shadow-md">Sign In</button>
      </div>
    );
  }

  // Initialize socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch conversations list
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  // Setup active conversation
  useEffect(() => {
    if (activeConversation && socket) {
      // Fetch messages for active conversation
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/chat/${activeConversation._id}`);
          setMessages(data);
          scrollToBottom();
        } catch (err) {
          console.error(err);
        }
      };

      fetchMessages();

      // Join socket room
      socket.emit('join_chat', activeConversation._id);

      // Listen for new messages
      socket.on('receive_message', (message) => {
        if (message.conversation === activeConversation._id) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [activeConversation, socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeConversation) return;

    socket.emit('send_message', {
      conversationId: activeConversation._id,
      senderId: user._id,
      text: newMessage
    });

    setNewMessage('');
  };

  const getPartner = (convo) => {
    return convo.participants.find(p => p._id !== user._id) || convo.participants[0];
  };

  const filteredConversations = conversations.filter(convo => {
    const partner = getPartner(convo);
    return partner.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSwapAction = async (actionStatus) => {
    if (!activeConversation || !activeConversation.swapRequest) return;
    setActionLoading(true);
    try {
      const { data } = await api.put(`/swaps/${activeConversation.swapRequest._id}/status`, {
        status: actionStatus
      });
      // Update local state to reflect new status
      const updatedConversations = conversations.map(c => {
        if (c._id === activeConversation._id) {
          return {
            ...c,
            swapRequest: {
              ...c.swapRequest,
              status: data.status,
              requesterConfirmed: data.requesterConfirmed,
              receiverConfirmed: data.receiverConfirmed
            }
          };
        }
        return c;
      });
      setConversations(updatedConversations);
      setActiveConversation(updatedConversations.find(c => c._id === activeConversation._id));
    } catch (err) {
      console.error('Failed to update swap status', err);
      alert(err.response?.data?.message || 'Failed to update swap');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateUser = async () => {
    if (!activeConversation) return;
    const partner = getPartner(activeConversation);
    setActionLoading(true);
    try {
      await api.post(`/users/${partner._id}/rate`, {
        rating: ratingVal,
        comment: ratingComment
      });
      alert('Review submitted successfully!');
      // Update locally to hide rating UI (hack for now: set a flag on convo)
      const updatedConversations = conversations.map(c => {
        if (c._id === activeConversation._id) {
          return { ...c, userRated: true };
        }
        return c;
      });
      setConversations(updatedConversations);
      setActiveConversation(updatedConversations.find(c => c._id === activeConversation._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-border-subtle flex h-[85vh] overflow-hidden">
        
        {/* Conversations List (Sidebar) */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border-subtle flex flex-col bg-gray-50/50 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-border-subtle">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Messages</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-shadow"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {conversations.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-brand-primary opacity-50" />
                </div>
                <p className="text-brand-dark font-bold mb-1">No messages yet</p>
                <p className="text-xs text-text-muted">Propose a swap to start chatting!</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No matches found.
              </div>
            ) : (
              filteredConversations.map(convo => {
                const partner = getPartner(convo);
                const isActive = activeConversation?._id === convo._id;
                
                return (
                  <div 
                    key={convo._id} 
                    onClick={() => setActiveConversation(convo)}
                    className={`p-4 mb-1 rounded-2xl cursor-pointer transition-all duration-200 flex items-start gap-3 ${isActive ? 'bg-brand-primary/10 shadow-sm' : 'hover:bg-white hover:shadow-sm'}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {partner.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className={`font-bold truncate ${isActive ? 'text-brand-primary' : 'text-brand-dark'}`}>{partner.name}</span>
                        <span className="text-[10px] text-text-muted font-medium flex-shrink-0 ml-2">
                          {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                        </span>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-danger-tag mb-1 font-bold truncate">
                        Swap: {convo.swapRequest?.requestedItem?.title || 'Unknown Item'}
                      </div>
                      <div className="text-sm text-text-muted truncate pr-4">
                        {convo.lastMessage ? (
                          <span>{convo.lastMessage.sender === user._id ? 'You: ' : ''}{convo.lastMessage.text}</span>
                        ) : (
                          <span className="italic">No messages yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:flex-1 flex flex-col bg-white ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-brand-light/20 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-border-subtle mb-6">
                <MessageCircle className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Your Messages</h3>
              <p className="text-text-muted max-w-sm">Select a conversation from the sidebar to view details and start chatting with other swappers.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b border-border-subtle bg-white flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                <div className="flex items-center">
                  <button onClick={() => setActiveConversation(null)} className="mr-4 md:hidden p-2 bg-brand-light rounded-full text-brand-dark hover:bg-border-subtle transition">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm">
                    {getPartner(activeConversation).name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-dark leading-tight">{getPartner(activeConversation).name}</h3>
                    <div className="flex items-center text-xs text-success font-medium mt-0.5">
                      <div className="w-1.5 h-1.5 bg-success rounded-full mr-1.5"></div> Online
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to={`/swaps/${activeConversation.swapRequest?._id}`} className="hidden sm:flex px-4 py-2 bg-brand-light text-brand-dark rounded-xl text-sm font-bold hover:bg-brand-light transition">
                    View Swap
                  </Link>
                  <button className="p-2.5 text-text-muted hover:bg-brand-light hover:text-brand-dark rounded-xl transition hidden sm:block">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 text-text-muted hover:bg-brand-light hover:text-brand-dark rounded-xl transition">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Swap Action Banner */}
              {activeConversation.swapRequest && (
                <div className="bg-brand-light/50 border-b border-border-subtle p-3 px-4 sm:px-6 flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center">
                    <ArrowRightLeft className="w-4 h-4 text-brand-primary mr-2" />
                    <span className="text-sm font-medium text-brand-dark">
                      Swap: {activeConversation.swapRequest.offeredItem?.title} ⇄ {activeConversation.swapRequest.requestedItem?.title}
                    </span>
                    <span className="ml-3 text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-border-subtle text-text-muted">
                      {activeConversation.swapRequest.status}
                    </span>
                  </div>
                  
                  {(() => {
                    const sr = activeConversation.swapRequest;
                    const isRequester = typeof sr.requester === 'object' ? sr.requester?._id === user._id : sr.requester === user._id;
                    const hasConfirmed = isRequester ? sr.requesterConfirmed : sr.receiverConfirmed;

                    if (sr.status === 'pending' && sr.requestedItem?.owner === user._id) {
                      return (
                        <button 
                          onClick={() => handleSwapAction('accepted')}
                          disabled={actionLoading}
                          className="text-xs bg-brand-dark text-white font-bold px-4 py-1.5 rounded-lg hover:bg-brand-primary transition"
                        >
                          {actionLoading ? 'Processing...' : 'Accept Swap'}
                        </button>
                      );
                    }

                    if (sr.status === 'accepted') {
                      if (hasConfirmed) {
                        return (
                          <span className="text-xs font-bold text-text-muted px-4 py-1.5 border border-border-subtle rounded-lg bg-white">
                            Waiting for partner...
                          </span>
                        );
                      }
                      return (
                        <button 
                          onClick={() => handleSwapAction('completed')}
                          disabled={actionLoading}
                          className="text-xs bg-success text-white font-bold px-4 py-1.5 rounded-lg hover:bg-green-600 transition"
                        >
                          {actionLoading ? 'Processing...' : 'Mark Completed'}
                        </button>
                      );
                    }

                    if (sr.status === 'completed' && !activeConversation.userRated) {
                      return (
                        <div className="flex items-center gap-2">
                          <select 
                            value={ratingVal} 
                            onChange={(e) => setRatingVal(e.target.value)}
                            className="text-xs p-1 border rounded"
                          >
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                          </select>
                          <button 
                            onClick={handleRateUser}
                            disabled={actionLoading}
                            className="text-xs bg-brand-accent text-brand-dark font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition flex items-center"
                          >
                            <Star className="w-3 h-3 mr-1 fill-brand-dark" /> Rate Partner
                          </button>
                        </div>
                      );
                    }

                    if (sr.status === 'completed' && activeConversation.userRated) {
                      return (
                        <span className="text-xs font-bold text-success flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" /> Rated
                        </span>
                      );
                    }

                    return null;
                  })()}
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#faf9f7] space-y-6 custom-scrollbar relative">
                {/* Date Divider */}
                <div className="flex justify-center mb-6">
                  <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-text-muted shadow-sm border border-border-subtle uppercase tracking-widest">
                    Beginning of conversation
                  </span>
                </div>

                {messages.map((msg, idx) => {
                  const isMe = msg.sender._id === user._id;
                  // Add a small tail to the first message in a group (simplified for this design)
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex max-w-[85%] sm:max-w-[70%] items-end gap-2">
                        {!isMe && (
                           <div className="w-8 h-8 bg-brand-dark rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mb-5 hidden sm:flex">
                             {getPartner(activeConversation).name.charAt(0)}
                           </div>
                        )}
                        <div className={`rounded-2xl p-4 shadow-sm relative ${isMe ? 'bg-brand-primary text-white rounded-br-sm' : 'bg-white border border-border-subtle text-text-main rounded-bl-sm'}`}>
                          <p className="text-[15px] leading-relaxed">{msg.text}</p>
                          <span className={`text-[10px] block mt-2 font-medium ${isMe ? 'text-white/70 text-right' : 'text-text-muted text-left'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-white border-t border-border-subtle">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <button type="button" className="p-3.5 text-text-muted bg-brand-light hover:bg-brand-light hover:text-brand-dark rounded-xl transition flex-shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative bg-brand-light/50 border border-border-subtle rounded-2xl focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent transition-all overflow-hidden">
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type your message here..." 
                      className="w-full px-4 py-3.5 text-sm bg-transparent outline-none resize-none max-h-32 min-h-[52px] custom-scrollbar"
                      rows="1"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="p-3.5 bg-brand-dark text-white rounded-xl hover:bg-brand-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
                <div className="text-center mt-2 hidden sm:block">
                  <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Press Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}