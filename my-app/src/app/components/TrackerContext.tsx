'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import TrackerModal, { StudySession } from './TrackerModal';

interface TrackerContextType {
  isModalOpen: boolean;
  isTracking: boolean;
  startTime: Date | null;
  currentDuration: number;
  openModal: () => void;
  closeModal: () => void;
  startTracking: () => void;
  stopTracking: () => void;
  sessions: StudySession[];
  totalTime: number;
  addSession: (session: Omit<StudySession, 'id' | 'timestamp' | 'duration'>) => void;
  deleteSession: (sessionId: string) => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

interface TrackerProviderProps {
  children: ReactNode;
}

export const TrackerProvider: React.FC<TrackerProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  // Load sessions from session storage on mount
  useEffect(() => {
    const savedSessions = sessionStorage.getItem('studySessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      }));
      setSessions(parsedSessions);
      
      // Calculate total time
      const total = parsedSessions.reduce((sum: number, session: StudySession) => 
        sum + session.duration, 0
      );
      setTotalTime(total);
    }
  }, []);

  // Save sessions to session storage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      sessionStorage.setItem('studySessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const startTracking = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    setCurrentDuration(0);
  };

  const stopTracking = () => {
    if (startTime) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // duration in minutes
      setCurrentDuration(duration);
      setIsModalOpen(true); // Open modal to fill in details
    }
  };

  const addSession = (sessionData: Omit<StudySession, 'id' | 'timestamp' | 'duration'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
      timestamp: startTime || new Date(),
      duration: currentDuration
    };
    
    setSessions(prev => [newSession, ...prev]);
    setTotalTime(prev => prev + currentDuration);
    
    // Completely reset tracking state after successful session save
    setStartTime(null);
    setCurrentDuration(0);
    setIsTracking(false); // This was missing!
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const sessionToDelete = prev.find(session => session.id === sessionId);
      if (sessionToDelete) {
        setTotalTime(prevTotal => prevTotal - sessionToDelete.duration);
      }
      const updatedSessions = prev.filter(session => session.id !== sessionId);
      
      // Update session storage
      if (updatedSessions.length === 0) {
        sessionStorage.removeItem('studySessions');
      } else {
        sessionStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      }
      
      return updatedSessions;
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    // If user cancels, resume tracking with the original start time
    // isTracking should remain true since we never changed it in stopTracking
    setCurrentDuration(0); // Reset the calculated duration
  };

  const value: TrackerContextType = {
    isModalOpen,
    isTracking,
    startTime,
    currentDuration,
    openModal,
    closeModal,
    startTracking,
    stopTracking,
    sessions,
    totalTime,
    addSession,
    deleteSession
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
      <TrackerModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onSubmit={(sessionData) => {
          addSession(sessionData);
          closeModal();
        }}
        sessionDuration={currentDuration}
      />
    </TrackerContext.Provider>
  );
};

export const useTracker = (): TrackerContextType => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};

export default TrackerProvider;