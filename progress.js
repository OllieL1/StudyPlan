const subjects = [
    "PSD",
    "Data Fundamentals",
    "Systems Programming",
    "Operating Systems",
    "Programming Languages",
    "Networked Systems",
    "Cyber Fundamentals"
  ];
  
  const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};
  const examDates = JSON.parse(localStorage.getItem("examDates")) || {};
  const container = document.getElementById("progress-container");
  
  // Helper: format date difference
  function getDaysUntil(dateStr) {
    const today = new Date();
    const exam = new Date(dateStr);
    const diffTime = exam - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  function getSubjectStats(subject) {
    const tasks = revisionData[subject] || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.complete).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
  
    // Compute total time studied for this subject
    const sessions = JSON.parse(localStorage.getItem("studySessions")) || [];
    const totalTime = sessions
      .flatMap(s => s.subjects || [])
      .filter(s => s.name === subject)
      .reduce((sum, s) => sum + s.time, 0);
  
    return { total, completed, percent, totalTime };
  }

  function formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
  
  
  
  // Sort subjects by exam date
  const sortedSubjects = [...subjects].sort((a, b) => {
    const dateA = new Date(examDates[a] || "2100-01-01");
    const dateB = new Date(examDates[b] || "2100-01-01");
    return dateA - dateB;
  });
  
  sortedSubjects.forEach(subject => {
    const { total, completed, percent, totalTime } = getSubjectStats(subject);
    const examDate = examDates[subject];
    const daysUntil = examDate ? getDaysUntil(examDate) : null;
  
    const card = document.createElement("div");
    card.className = "subject-progress-card";
  
    if (percent === 100 && daysUntil !== null && daysUntil < 0) {
      card.classList.add("complete");
    }
  
    card.innerHTML = `
        <h3>${subject}</h3>
        <p><strong>Tasks:</strong> ${completed} / ${total}</p>
        <p><strong>Completed:</strong> ${percent}%</p>
        <p><strong>Total Time Studied:</strong> ${formatTime(totalTime)}</p>
        <p><strong>Exam Date:</strong> ${examDate ? new Date(examDate).toLocaleDateString("en-UK") : "—"}</p>
        <p><strong>Days Until Exam:</strong> ${examDate ? getDaysUntil(examDate) : "—"}</p>
    `;
  
  
    container.appendChild(card);
  });
  
  // mdl Logic
//   const mdl = document.getElementById("exam-mdl");
//   const openBtn = document.getElementById("set-exam-dates");
//   const cancelBtn = document.getElementById("cancel-exam");
//   const saveBtn = document.getElementById("save-exam");
  
//   openBtn.addEventListener("click", () => mdl.classList.remove("hidden"));
//   cancelBtn.addEventListener("click", () => mdl.classList.add("hidden"));
  
//   saveBtn.addEventListener("click", () => {
//     const subject = document.getElementById("exam-subject").value;
//     const date = document.getElementById("exam-date").value;
  
//     if (!date) return alert("Please select a date.");
  
//     examDates[subject] = date;
//     localStorage.setItem("examDates", JSON.stringify(examDates));
//     mdl.classList.add("hidden");
//     location.reload();
//   });
  