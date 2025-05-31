'use client';

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faHome, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './progress.css';

interface Task {
  complete: boolean;
}

interface Subject {
  name: string;
  time: number;
}

interface StudySession {
  subjects?: Subject[];
}

interface SubjectStats {
  total: number;
  completed: number;
  percent: number;
  totalTime: number;
  totalSessions: number;
}

const subjects = [
  "PSD",
  "Data Fundamentals", 
  "Systems Programming",
  "Operating Systems",
  "Programming Languages",
  "Networked Systems",
  "Cyber Fundamentals"
];

export default function Progress(): JSX.Element {
  const [revisionData, setRevisionData] = useState<Record<string, Task[]>>({});
  const [examDates, setExamDates] = useState<Record<string, string>>({});
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showSetupWizard, setShowSetupWizard] = useState<boolean>(false);
  const [setupData, setSetupData] = useState<Record<string, string | null>>({});
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);

  // Initialize data from localStorage and sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRevisionData = JSON.parse(localStorage.getItem("revisionData") || "{}");
      const storedExamDates = JSON.parse(sessionStorage.getItem("examDates") || "{}");
      const storedStudySessions = JSON.parse(sessionStorage.getItem("studySessions") || "[]");
      
      setRevisionData(storedRevisionData);
      setExamDates(storedExamDates);
      setStudySessions(storedStudySessions);

      // Check if setup is needed
      const hasAllDates = subjects.every(subject => 
        storedExamDates[subject] !== undefined
      );
      
      if (!hasAllDates) {
        setShowSetupWizard(true);
        // Initialize setup data with existing dates
        const initialSetupData = {};
        subjects.forEach(subject => {
          initialSetupData[subject] = storedExamDates[subject] || null;
        });
        setSetupData(initialSetupData);
      } else {
        setIsSetupComplete(true);
      }
    }
  }, []);

  // Helper: format date difference
  const getDaysUntil = (dateStr) => {
    const today = new Date();
    const exam = new Date(dateStr);
    const diffTime = exam - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get subject statistics
  const getSubjectStats = (subject: string): SubjectStats => {
    const tasks = revisionData[subject] || [];
    const total = tasks.length;
    const completed = tasks.filter((t: Task) => t.complete).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    // Compute total time studied for this subject
    const totalTime = studySessions
      .flatMap((s: StudySession) => s.subjects || [])
      .filter((s: Subject) => s.name === subject)
      .reduce((sum: number, s: Subject) => sum + s.time, 0);

    // Count total sessions for this subject
    const totalSessions = studySessions
      .filter((session: StudySession) => 
        session.subjects && session.subjects.some((s: Subject) => s.name === subject)
      ).length;

    return { total, completed, percent, totalTime, totalSessions };
  };

  // Format time in hours and minutes
  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // Handle exam date save
  const handleSaveExamDate = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const updatedExamDates = { ...examDates, [selectedSubject]: selectedDate };
    setExamDates(updatedExamDates);
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("examDates", JSON.stringify(updatedExamDates));
    }
    
    setShowExamModal(false);
    setSelectedDate("");
  };

  // Handle setup wizard date change
  const handleSetupDateChange = (subject: string, value: string | null): void => {
    setSetupData({...setupData, [subject]: value});
  };

  // Complete setup wizard
  const handleCompleteSetup = (): void => {
    const finalExamDates = {...examDates, ...setupData};
    setExamDates(finalExamDates);
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("examDates", JSON.stringify(finalExamDates));
    }
    
    setShowSetupWizard(false);
    setIsSetupComplete(true);
  };

  // Check if setup is complete
  const isSetupFormComplete: boolean = subjects.every((subject: string) => 
    setupData[subject] !== undefined && setupData[subject] !== null
  );

  // Sort subjects by exam date
  const sortedSubjects = [...subjects].sort((a, b) => {
    const dateA = new Date(examDates[a] || "2100-01-01");
    const dateB = new Date(examDates[b] || "2100-01-01");
    return dateA - dateB;
  });

  return (
    <>
      <Head>
        <title>Progress Overview</title>
        <link rel="stylesheet" href="styles.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        <link rel="icon" href="icon.png" type="image/png"/>
      </Head>

      <Sidebar />

      <main>
        <header>
          <h1>Progress Overview</h1>
          <button 
            id="set-exam-dates"
            onClick={() => setShowExamModal(true)}
          >
            Set Exam Date
          </button>
        </header>

        {isSetupComplete && (
          <div id="progress-container">
            {sortedSubjects.map((subject: string) => {
              const { total, completed, percent, totalTime, totalSessions } = getSubjectStats(subject);
              const examDate = examDates[subject];
              const daysUntil = examDate ? getDaysUntil(examDate) : null;

              const isComplete = percent === 100 && daysUntil !== null && daysUntil < 0;

              return (
                <div 
                  key={subject}
                  className={`subject-progress-card ${isComplete ? 'complete' : ''}`}
                >
                  <h3>{subject}</h3>
                  <p><strong>Sessions:</strong> {totalSessions}</p>
                  <p><strong>Tasks:</strong> {completed} / {total} ({percent}%)</p>
                  <p><strong>Total Time Studied:</strong> {formatTime(totalTime)}</p>
                  <p><strong>Exam Date:</strong> {examDate ? new Date(examDate).toLocaleDateString("en-UK") : "No deadline"}</p>
                  <p><strong>Days Until Exam:</strong> {
                    examDate ? (
                      daysUntil! > 0 ? `${daysUntil} days` : 
                      daysUntil === 0 ? "Today!" : 
                      `${Math.abs(daysUntil!)} days ago`
                    ) : "—"
                  }</p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <div className="setup-wizard-overlay">
          <div className="setup-wizard-modal">
            <div className="setup-wizard-header">
              <h2>Set Your Study Schedule</h2>
              <p>Let's set up your exam dates and deadlines to track your progress effectively.</p>
            </div>
            
            <div className="setup-wizard-content">
              {subjects.map((subject, index) => (
                <div key={subject} className="setup-subject-row">
                  <div className="subject-info">
                    <h4>{subject}</h4>
                    <span className="subject-number">Subject {index + 1} of {subjects.length}</span>
                  </div>
                  
                  <div className="date-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`${subject}-option`}
                        checked={setupData[subject] === ""}
                        onChange={() => handleSetupDateChange(subject, "")}
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-label">No deadline</span>
                    </label>
                    
                    <label className="radio-option">
                      <input
                        type="radio"
                        name={`${subject}-option`}
                        checked={setupData[subject] !== "" && setupData[subject] !== null && setupData[subject] !== undefined}
                        onChange={() => {
                          if (setupData[subject] === "" || !setupData[subject]) {
                            handleSetupDateChange(subject, new Date().toISOString().split('T')[0]);
                          }
                        }}
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-label">Set exam date</span>
                    </label>
                    
                    {setupData[subject] !== "" && setupData[subject] !== null && setupData[subject] !== undefined && (
                      <input
                        type="date"
                        className="date-input"
                        value={setupData[subject] || ""}
                        onChange={(e) => handleSetupDateChange(subject, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="setup-wizard-footer">
              <div className="progress-indicator">
                <span>
                  {Object.values(setupData).filter(val => val !== null && val !== undefined).length} of {subjects.length} subjects configured
                </span>
              </div>
              <button 
                className={`complete-setup-btn ${isSetupFormComplete ? 'enabled' : 'disabled'}`}
                onClick={handleCompleteSetup}
                disabled={!isSetupFormComplete}
              >
                Complete Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Date Modal */}
      {showExamModal && (
        <div id="exam-modal" className="modal">
          <div className="modal-content">
            <h2>Set Exam Date</h2>
            <label>
              Subject
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label>
              Exam Date
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button onClick={() => {
                setShowExamModal(false);
                setSelectedDate("");
              }}>
                Cancel
              </button>
              <button onClick={handleSaveExamDate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}