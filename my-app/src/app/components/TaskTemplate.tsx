"use client";

export default function SubjectTemplate() {
    return (
        <div className="task">
        <input type="checkbox" className="task-complete" />
        <input type="text" className="task-note" placeholder="Task..." />
        <input type="date" className="task-date" />
        </div>
    );
}