'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CommonHead from '../components/CommonHead';
import SessionList from '../components/SessionList';
import DailyView from '../components/DailyView';
import { useTracker } from '../components/TrackerContext';
import './tracker.css';

const formatTime = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

export default function TrackerPage() {
  const { totalTime } = useTracker();
  const [isDailyView, setIsDailyView] = useState(false);

  const toggleView = () => {
    setIsDailyView(!isDailyView);
  };

  return (
    <>
      <CommonHead title="Tracker" />
      <Sidebar />
      
      <main>
        <header>
          <h1>Time Tracker</h1>
          <p id="total-time">Total Time Studied: {formatTime(totalTime)}</p>
        </header>
        
        <div id="daily-toggle-container">
          <button id="toggle-daily-view" onClick={toggleView}>
            {isDailyView ? 'Toggle Tracker View' : 'Toggle Daily View'}
          </button>
        </div>
        
        <SessionList className={isDailyView ? 'hidden' : ''} />
        <DailyView className={isDailyView ? '' : 'hidden'} />
      </main>
    </>
  );
}