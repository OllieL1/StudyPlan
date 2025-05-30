import React, { useState, useEffect } from 'react';

export interface StudySession {
  id: string;
  duration: number;
  location: string;
  topic: string;
  subjects: string[];
  timestamp: Date;
}

interface StudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (session: Omit<StudySession, 'id' | 'timestamp' | 'duration'>) => void;
  subjects?: string[];
  sessionDuration?: number; // Pre-calculated duration from timer
}

const TrackerModal: React.FC<StudySessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sessionDuration = 0,
  subjects = [
    'Mathematics',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History'
  ]
}) => {
  const [studyLocation, setStudyLocation] = useState('Library');
  const [studyTopic, setStudyTopic] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStudyLocation('Library');
    setStudyTopic('');
    setSelectedSubjects([]);
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = () => {
    if (studyTopic.trim() && selectedSubjects.length > 0 && sessionDuration > 0) {
      onSubmit({
        location: studyLocation,
        topic: studyTopic.trim(),
        subjects: selectedSubjects
      });
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = studyTopic.trim() && selectedSubjects.length > 0 && sessionDuration > 0;

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Log Study Session</h2>

        <label>
          Where did you study?
          <select 
            value={studyLocation} 
            onChange={(e) => setStudyLocation(e.target.value)}
          >
            <option value="Library">Library</option>
            <option value="Home">Home</option>
            <option value="Coffee Shop">Coffee Shop</option>
            <option value="Lab">Lab</option>
          </select>
        </label>

        <label>
          What did you study?
          <input 
            type="text" 
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            placeholder="e.g. Algorithms, Notes Review"
            required
          />
        </label>

        <div className="subject-select">
          <p><strong>Which subject(s)?</strong></p>
          <div className="subject-options">
            {subjects.map(subject => (
              <label key={subject} className="subject-option">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleSubjectToggle(subject)}
                />
                {subject}
              </label>
            ))}
          </div>
        </div>

        <p className="session-length-display">
          <strong>Session Duration: {sessionDuration} minutes</strong>
        </p>

        <div className="modal-actions">
          <button 
            type="button" 
            onClick={handleCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="confirm-btn"
          >
            Log Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackerModal;