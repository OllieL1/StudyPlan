import Head from "next/head";
import Script from "next/script";

import Sidebar from "../components/Sidebar"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faHome, faPowerOff } from '@fortawesome/free-solid-svg-icons';
// import Image from "next/image";

export default function Home() {
    return (
        <>

        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Schedule</title>
            <link rel="stylesheet" href="styles.css" />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
            <link rel="icon" href="icon.png" type="image/png"/>
        </head>

        <Sidebar />

        <main>
            <header>
                <h1>Schedule</h1>
            </header>
            <div id="schedule-container"></div>
        </main>

        <div id="study-modal" className="modal hidden">
            <div className="modal-content">
            <h2>Log Study Session</h2>
        
            {/* <!-- Where was the session? --> */}
            <label>
                Where did you study?
                <select id="study-location">
                <option>Library</option>
                <option>Home</option>
                <option>Coffee Shop</option>
                <option>Lab</option>
                </select>
            </label>
        
            {/* <!-- What was studied --> */}
            <label>
                What did you study?
                <input type="text" id="study-topic" placeholder="e.g. Algorithms, Notes Review" />
            </label>
        
            {/* <!-- Subject selection --> */}
            <div className="subject-select">
                <p><strong>Which subject(s)?</strong></p>
                <div id="subject-options" className="subject-options"></div>
            </div>
        
            {/* <!-- Optional per-subject time --> */}
            <div id="multi-time-inputs" className="hidden">
                <p><strong>Enter time for each selected subject:</strong></p>
            </div>
        
            {/* <!-- Total duration display --> */}
            <p id="session-duration" className="session-length-display"></p>
        
            {/* <!-- Actions --> */}
            <div className="modal-actions">
                <button id="cancel-session">Cancel</button>
                <button id="confirm-session">Log Session</button>
            </div>
            </div>
        </div>

        <Script src="tracker-toggle.js" strategy="afterInteractive"/>
        <Script src="schedule.js" strategy="afterInteractive"/>
        <Script src="main.js" strategy="afterInteractive"/>

        </>

    );
}