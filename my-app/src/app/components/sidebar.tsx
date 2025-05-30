'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faHome,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <Link href="/" className="nav-item active" title="Home">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link href="/schedule" className="nav-item" title="Schedule">
        <FontAwesomeIcon icon={faCalendarAlt} />
      </Link>
      <Link href="/tracker" className="nav-item" title="Time Tracker">
        <FontAwesomeIcon icon={faClock} />
      </Link>
      <div className="study-toggle" id="study-toggle">
        <FontAwesomeIcon icon={faPowerOff} />
      </div>
    </nav>
  );
}