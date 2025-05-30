'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faHome,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import { useTracker } from './TrackerContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isTracking, startTracking, stopTracking } = useTracker();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleTrackerToggle = () => {
    if (isTracking) {
      stopTracking(); // This will open the modal with the calculated duration
    } else {
      startTracking(); // This will start the timer
    }
  };

  return (
    <nav className="sidebar">
      <Link 
        href="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`} 
        title="Home"
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link 
        href="/schedule" 
        className={`nav-item ${isActive('/schedule') ? 'active' : ''}`} 
        title="Schedule"
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
      </Link>
      <Link 
        href="/tracker" 
        className={`nav-item ${isActive('/tracker') ? 'active' : ''}`} 
        title="Time Tracker"
      >
        <FontAwesomeIcon icon={faClock} />
      </Link>
      <div 
        className={`study-toggle ${isTracking ? 'tracking' : ''}`} 
        onClick={handleTrackerToggle}
        title={isTracking ? 'Stop studying' : 'Start studying'}
      >
        <FontAwesomeIcon icon={faPowerOff} />
      </div>
    </nav>
  );
}