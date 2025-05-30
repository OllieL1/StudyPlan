"use client";

export default function SubjectTemplate() {
    return (
        <section className="subject">
            <details>
                <summary className="subject-title">
                    <span className="toggle-icon">▸</span>
                    <div className="subject-heading">
                    <span className="subject-name">Maths</span>
                    </div>
                    <div className="subject-inline-progress">
                    <span className="subject-inline-percentage">0%</span>
                    <progress value="0" max="100" className="progress-bar"></progress>
                    </div>
                </summary>
                        
                <div className="task-list"></div>
                <button className="add-task">Add Task</button>
            </details>
        </section>

    );
}