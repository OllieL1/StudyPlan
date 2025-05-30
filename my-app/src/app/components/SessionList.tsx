import React, { useState } from 'react';
import { useTracker } from './TrackerContext';
import { StudySession } from './TrackerModal';

const ITEMS_PER_PAGE = 10;

interface SessionListProps {
  className?: string;
}

const SessionList: React.FC<SessionListProps> = ({ className = '' }) => {
  const { sessions, deleteSession } = useTracker();
  const [currentPage, setCurrentPage] = useState(1);

  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      
      // Adjust current page if we deleted the last item on the page
      const totalPages = Math.ceil((sessions.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    }
  };

  // Pagination logic
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(start, end);
  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={page === currentPage ? 'active-page' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  if (sessions.length === 0) {
    return (
      <div className={`session-list-container ${className}`}>
        <div className="no-sessions">
          <p>No study sessions recorded yet. Start tracking to see your sessions here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`session-list-container ${className}`}>
      <div className="session-list">
        {paginatedSessions.map((session) => {
          const date = new Date(session.timestamp);
          const dateStr = date.toLocaleDateString('en-UK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          const timeStr = date.toLocaleTimeString('en-UK', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={session.id} className="session-entry">
              <div className="session-header">
                <h3>{session.topic}</h3>
                <button
                  className="delete-session"
                  title="Delete Session"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  ×
                </button>
              </div>
              <p><strong>Location:</strong> {session.location}</p>
              <p><strong>Duration:</strong> {formatTime(session.duration)}</p>
              <p><strong>Subjects:</strong> {session.subjects.join(', ')}</p>
              <p><strong>Date:</strong> {dateStr} at {timeStr}</p>
            </div>
          );
        })}
      </div>
      {renderPagination()}
    </div>
  );
};

export default SessionList;