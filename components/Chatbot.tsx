import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleIcon, XIcon, PaperAirplaneIcon } from './Icons';
import { createChatbotSession } from '../services/geminiService';
import { generateMusicFromConversation, ConversationalMusicParams } from '../services/musicGenerationService';
import { Chat } from '@google/genai';

type Message = {
  sender: 'user' | 'ai';
  text: string;
  audioUrl?: string;
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isComposing, setIsComposing] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize chat session
    useEffect(() => {
        const initChat = () => {
            setIsLoading(true);
            const chat = createChatbotSession();
            if (chat) {
                setChatSession(chat);
                setMessages([{ sender: 'ai', text: "Bonjour ! Je suis Nanhé, ton prof de musique. Je t'écoute ?" }]);
            } else {
                setMessages([{ sender: 'ai', text: "Bonjour, Nanhé est indisponible pour le moment." }]);
            }
            setIsLoading(false);
        };
        initChat();
    }, []);

    // Scroll to bottom on new message
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isComposing, isOpen]);

    const handleToggle = () => setIsOpen(prev => !prev);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatSession) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatSession.sendMessage({ message: currentInput });
            
            const functionCalls = response.functionCalls;
            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                if (call.name === 'composeMusic') {
                    setIsLoading(false);
                    setIsComposing(true);
                    
                    try {
                        const musicParams = call.args as ConversationalMusicParams;
                        const audioUrl = await generateMusicFromConversation(musicParams);
                        const aiMessage: Message = { sender: 'ai', text: "Voici le morceau que j'ai composé pour vous !", audioUrl };
                        setMessages(prev => [...prev, aiMessage]);
                    } catch (musicError) {
                        console.error("Error during music generation:", musicError);
                        const errorMessage: Message = { sender: 'ai', text: "Désolé, je n'ai pas réussi à composer le morceau. Réessayons." };
                        setMessages(prev => [...prev, errorMessage]);
                    } finally {
                        setIsComposing(false);
                    }
                    return; 
                }
            }
            
            // If no function call, just a regular text response
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { sender: 'ai', text: "Désolé, je rencontre une difficulté. Pourriez-vous reformuler votre question ?" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-28 right-4 md:bottom-[7.5rem] md:right-6 z-[60]">
            <div 
                className={`absolute bottom-0 right-0 flex flex-col w-[calc(100vw-2rem)] h-[70vh] max-w-sm bg-alaiz-gray border border-alaiz-gold/30 rounded-lg shadow-2xl transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                aria-hidden={!isOpen}
            >
                <header className="flex items-center justify-between p-4 border-b border-alaiz-gold/20 flex-shrink-0">
                    <h3 className="font-bold text-lg text-alaiz-gold-light">Nanhé - Gombiste IA</h3>
                    <button onClick={handleToggle} aria-label="Fermer le chatbot" className="text-alaiz-cream/70 hover:text-alaiz-gold">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4" aria-live="polite">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-alaiz-gold/20 flex items-center justify-center font-bold text-alaiz-gold text-sm flex-shrink-0">N</div>}
                            <div className={`max-w-xs p-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-alaiz-gold text-alaiz-black rounded-br-none' : 'bg-alaiz-dark text-alaiz-cream/90 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                {msg.audioUrl && (
                                    <audio controls src={msg.audioUrl} className="mt-2 w-full h-10 rounded-full">
                                        Votre navigateur ne supporte pas l'élément audio.
                                    </audio>
                                )}
                            </div>
                        </div>
                    ))}
                    {(isLoading || isComposing) && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-alaiz-gold/20 flex items-center justify-center font-bold text-alaiz-gold text-sm flex-shrink-0">N</div>
                            <div className="p-3 bg-alaiz-dark rounded-2xl rounded-bl-none">
                                {isComposing ? (
                                    <p className="text-sm italic text-alaiz-cream/80">Nanhé compose votre morceau...</p>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-alaiz-gold rounded-full animate-pulse"></div>
                                      <div className="w-2 h-2 bg-alaiz-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                      <div className="w-2 h-2 bg-alaiz-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                  </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-alaiz-gold/20 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLoading || isComposing ? "Nanhé est occupé..." : "Posez une question..."}
                            disabled={isLoading || isComposing}
                            className="flex-grow bg-alaiz-dark border-alaiz-gold/30 rounded-full py-2 px-4 text-alaiz-white focus:outline-none focus:ring-2 focus:ring-alaiz-gold"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || isComposing || !input.trim()}
                            aria-label="Envoyer"
                            className="bg-alaiz-gold text-alaiz-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-alaiz-gold-light transition-colors disabled:bg-alaiz-gray disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <button 
                onClick={handleToggle} 
                aria-label="Ouvrir le chatbot de Nanhé"
                title="Discuter avec Nanhé"
                className={`bg-alaiz-gold text-alaiz-black rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:shadow-alaiz-gold/20 animate-subtle-glow ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <ChatBubbleIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

export default Chatbot;