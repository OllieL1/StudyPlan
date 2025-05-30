"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TrackerModal, { StudySession } from '../components/TrackerModal';
import CommonHead from '../components/CommonHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faHome, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import Sidebar from "../components/sidebar"


const TimeTracker: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isDailyViewVisible, setIsDailyViewVisible] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Available subjects (you can modify this list)
  const subjects = [
    'Mathematics',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History'
  ];

  // Dark mode effect based on time
  useEffect(() => {
    const hr = new Date().getHours();
    const isEvening = hr >= 16 || hr < 6; // evening = 6pm to 6am
    setIsDarkMode(isEvening);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleStudyToggle = () => {
    setIsStudyModalOpen(true);
  };

  const handleModalClose = () => {
    setIsStudyModalOpen(false);
  };

  const handleSessionSubmit = (sessionData: Omit<StudySession, 'id' | 'timestamp'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setTotalTime(prev => prev + sessionData.duration);
  };

  const toggleDailyView = () => {
    setIsDailyViewVisible(!isDailyViewVisible);
  };

  return (
    <>
      <CommonHead title="Time Tracker" />

      <Sidebar />

      <main>
        <header>
          <h1>Time Tracker</h1>
          <p id="total-time">Total Time Studied: {totalTime} mins</p>
        </header>
        
        <div id="daily-toggle-container">
          <button onClick={toggleDailyView}>Toggle Daily View</button>
        </div>
        
        <div id="daily-view" className={isDailyViewVisible ? '' : 'hidden'}>
          {/* Daily view content would go here */}
        </div>
        
        <div id="session-list">
          {sessions.map(session => (
            <div key={session.id} className="session-item">
              <h3>{session.topic}</h3>
              <p>Duration: {session.duration} mins</p>
              <p>Location: {session.location}</p>
              <p>Subjects: {session.subjects.join(', ')}</p>
              <p>Time: {session.timestamp.toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        <div id="pagination" className="pagination">
          {/* Pagination controls would go here */}
        </div>
      </main>

      {/* Study Modal */}
      <TrackerModal
        isOpen={isStudyModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSessionSubmit}
        subjects={subjects}
      />
    </>
  );
};

export default TimeTracker;