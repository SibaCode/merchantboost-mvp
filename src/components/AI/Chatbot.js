import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../services/translation';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Chatbot = () => {
  const { userProfile, updateProfile, currentUser } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);
  const messagesEndRef = useRef(null);

  const questions = [
    "What type of business do you run? (e.g., retail, services, manufacturing)",
    "What are your main sources of revenue?",
    "What are your major expense categories?",
    "How many employees do you have?",
    "What are your typical operational hours?",
    "What's your average monthly revenue?",
    "Do you have any existing loans or financing?"
  ];

  useEffect(() => {
    // Start conversation
    if (messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: "Hello! I'm your MerchantBoost AI assistant. Let me learn about your business to provide better insights and recommendations."
      }, {
        type: 'bot',
        text: questions[0]
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user', text: userInput }
    ];

    setMessages(newMessages);
    setUserInput('');

    // Simulate AI processing
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setMessages([
          ...newMessages,
          { type: 'bot', text: questions[nextQuestion] }
        ]);

        // Update tier based on progress
        if (nextQuestion >= 3) {
          updateProfile({ tier: 'intermediate' });
        }
      } else {
        // Profile complete
        setMessages([
          ...newMessages,
          { 
            type: 'bot', 
            text: "Thank you! I now have a good understanding of your business. I'm analyzing your information to provide personalized recommendations..." 
          },
          { 
            type: 'bot', 
            text: "Based on your responses, I've set your tier to INTERMEDIATE. You now have access to better loan rates and insurance options!" 
          }
        ]);
        setProfileComplete(true);
        updateProfile({ 
          tier: 'intermediate',
          businessProfile: 'complete',
          profileCompletedAt: new Date()
        });
      }
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>AI Business Profiling</h2>
        <div style={styles.progress}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...styles[message.type]
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!profileComplete && (
          <form onSubmit={handleSubmit} style={styles.inputForm}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here..."
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.sendButton}>
              Send
            </button>
          </form>
        )}

        {profileComplete && (
          <div style={styles.completionCard}>
            <h3>🎉 Profile Complete!</h3>
            <p>Your business profile has been successfully analyzed.</p>
            <div style={styles.recommendations}>
              <h4>Recommended Next Steps:</h4>
              <ul>
                <li>📊 View your business insights</li>
                <li>💰 Explore loan options</li>
                <li>🛡️ Review insurance packages</li>
                <li>🎓 Access financial literacy content</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  progress: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--white)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden'
  },
  messages: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  message: {
    padding: '16px 20px',
    borderRadius: '12px',
    maxWidth: '80%',
    lineHeight: '1.5'
  },
  bot: {
    background: '#f1f5f9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px'
  },
  user: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px'
  },
  inputForm: {
    display: 'flex',
    padding: '20px',
    borderTop: '1px solid var(--border)',
    gap: '12px'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '16px'
  },
  sendButton: {
    background: 'var(--gradient-primary)',
    color: 'var(--white)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  completionCard: {
    padding: '24px',
    textAlign: 'center',
    background: '#f0fdf4',
    margin: '20px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0'
  },
  recommendations: {
    marginTop: '16px',
    textAlign: 'left'
  }
};

export default Chatbot;