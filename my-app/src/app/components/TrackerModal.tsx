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
  onSubmit: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  subjects?: string[];
}

const TrackerModal: React.FC<StudySessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
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
  const [sessionDuration, setSessionDuration] = useState(0);

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
    setSessionDuration(0);
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
        duration: sessionDuration,
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

        <label>
          Session Duration (minutes):
          <input
            type="number"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Number(e.target.value))}
            min="1"
            max="720" // 12 hours max
            required
          />
        </label>

        <p className="session-length-display">
          Duration: {sessionDuration} minutes
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