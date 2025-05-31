import React from 'react';
import { useTracker } from './TrackerContext';

interface DailyViewProps {
  className?: string;
}

const DailyView: React.FC<DailyViewProps> = ({ className = '' }) => {
  const { sessions } = useTracker();

  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const formatTimeRange = (startTimestamp: Date, duration: number): string => {
    const startTime = new Date(startTimestamp);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    const startStr = startTime.toLocaleTimeString('en-UK', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endStr = endTime.toLocaleTimeString('en-UK', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${startStr} - ${endStr}`;
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((grouped, session) => {
    const dateKey = new Date(session.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD format
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(session);
    return grouped;
  }, {} as Record<string, typeof sessions>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedSessions).sort().reverse();

  if (sessions.length === 0) {
    return (
      <div className={`daily-view-container ${className}`}>
        <div className="no-sessions">
          <p>No study sessions recorded yet. Start tracking to see your daily progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`daily-view-container ${className}`}>
      <div className="daily-view">
        {sortedDates.map(date => {
          const sessionsOnDate = groupedSessions[date];
          
          // Calculate totals for the day
          let totalMinutes = 0;
          const subjectMap: Record<string, number> = {};

          sessionsOnDate.forEach(session => {
            totalMinutes += session.duration;
            session.subjects.forEach(subject => {
              subjectMap[subject] = (subjectMap[subject] || 0) + session.duration;
            });
          });

          // Format the date for display
          const displayDate = new Date(date).toLocaleDateString('en-UK', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <div key={date} className="daily-entry">
              <h3>{displayDate}</h3>
              <p><strong>Total:</strong> {formatTime(totalMinutes)}</p>
              <p><strong>Sessions:</strong> {sessionsOnDate.length}</p>
              
              {Object.keys(subjectMap).length > 0 && (
                <div className="subject-breakdown">
                  <p><strong>Subjects studied:</strong></p>
                  <ul>
                    {Object.entries(subjectMap)
                      .filter(([_, time]) => time > 0)
                      .sort(([_, a], [__, b]) => b - a) // Sort by time spent (descending)
                      .map(([subject, time]) => (
                        <li key={subject}>
                          {subject}: {formatTime(time)}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              
              <div className="session-details">
                <details>
                  <summary>View sessions ({sessionsOnDate.length})</summary>
                  <div className="session-list-mini">
                    {sessionsOnDate.map(session => (
                      <div key={session.id} className="mini-session">
                        <span className="session-topic">{session.topic}</span>
                        <span className="session-duration">{formatTime(session.duration)}</span>
                        <span className="session-time">
                          {formatTimeRange(session.timestamp, session.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyView;