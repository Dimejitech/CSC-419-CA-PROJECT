import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { Logo } from '../Logo/Logo';
import { SearchIcon, BellIcon, CalendarIcon, ArchiveIcon, LabIcon, CreditCardIcon } from '../Icons';
import avatar from '../../assets/avatar.png';

// Hamburger menu icon
const MenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H21" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Search result type
interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  icon: 'appointment' | 'medical' | 'lab' | 'billing' | 'notification';
}

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
  searchData?: {
    appointments?: any[];
    labResults?: any[];
    invoices?: any[];
    notifications?: any[];
  };
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'John Doe',
  userRole = 'Patient',
  onMenuClick,
  searchData = {},
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search appointments
    (searchData.appointments || []).forEach((appt: any) => {
      const clinicianName = appt.clinician ? `${appt.clinician.first_name || ''} ${appt.clinician.last_name || ''}`.toLowerCase() : '';
      const reason = (appt.reasonForVisit || appt.reason_for_visit || '').toLowerCase();
      if (clinicianName.includes(lowerQuery) || reason.includes(lowerQuery)) {
        // Format doctor name - avoid Dr.Dr
        let doctorTitle = 'Appointment';
        if (appt.clinician) {
          const firstName = appt.clinician.first_name || '';
          const lastName = appt.clinician.last_name || '';
          doctorTitle = firstName.startsWith('Dr.') ? `${firstName} ${lastName}` : `Dr. ${firstName} ${lastName}`;
        }
        // Format date safely
        const dateStr = appt.startTime || appt.start_time;
        let formattedDate = 'Scheduled';
        if (dateStr) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          }
        }
        results.push({
          id: appt.id,
          title: doctorTitle,
          subtitle: formattedDate,
          category: 'Appointments',
          path: '/appointments',
          icon: 'appointment',
        });
      }
    });

    // Search lab results
    (searchData.labResults || []).forEach((lab: any) => {
      const testName = (lab.testItem?.testName || lab.test_name || '').toLowerCase();
      if (testName.includes(lowerQuery)) {
        results.push({
          id: lab.id,
          title: lab.testItem?.testName || lab.test_name || 'Lab Test',
          subtitle: lab.status || 'Completed',
          category: 'Lab Results',
          path: '/lab-results',
          icon: 'lab',
        });
      }
    });

    // Search invoices
    (searchData.invoices || []).forEach((invoice: any) => {
      const description = (invoice.description || '').toLowerCase();
      const amount = invoice.amount ?? invoice.total_amount ?? 0;
      const status = invoice.status || 'Pending';
      if (description.includes(lowerQuery) || `$${amount}`.includes(lowerQuery)) {
        results.push({
          id: invoice.id,
          title: invoice.description || 'Medical Service',
          subtitle: `$${amount} - ${status}`,
          category: 'Billing',
          path: '/billing',
          icon: 'billing',
        });
      }
    });

    // Search notifications
    (searchData.notifications || []).forEach((notif: any) => {
      if (notif.title?.toLowerCase().includes(lowerQuery) || notif.message?.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: notif.id,
          title: notif.title,
          subtitle: notif.message?.slice(0, 40) + (notif.message?.length > 40 ? '...' : ''),
          category: 'Notifications',
          path: '#',
          icon: 'notification',
        });
      }
    });

    // Add static menu items that match
    const menuItems = [
      { title: 'Appointments', path: '/appointments', category: 'Menu', icon: 'appointment' as const },
      { title: 'Medical Records', path: '/medical-records', category: 'Menu', icon: 'medical' as const },
      { title: 'Lab Results', path: '/lab-results', category: 'Menu', icon: 'lab' as const },
      { title: 'Billing', path: '/billing', category: 'Menu', icon: 'billing' as const },
      { title: 'Prescriptions', path: '/prescriptions', category: 'Menu', icon: 'medical' as const },
      { title: 'Profile', path: '/profile', category: 'Menu', icon: 'medical' as const },
    ];

    menuItems.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: `menu-${item.path}`,
          title: item.title,
          subtitle: 'Go to page',
          category: item.category,
          path: item.path,
          icon: item.icon,
        });
      }
    });

    setSearchResults(results.slice(0, 8));
    setShowSearchResults(true);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (result.path !== '#') {
      navigate(result.path);
    }
  };

  const getResultIcon = (icon: string) => {
    switch (icon) {
      case 'appointment':
        return <CalendarIcon size={16} color="#fff" />;
      case 'medical':
        return <ArchiveIcon size={16} color="#fff" />;
      case 'lab':
        return <LabIcon size={16} color="#fff" />;
      case 'billing':
        return <CreditCardIcon size={16} color="#fff" />;
      default:
        return <BellIcon size={16} color="#fff" />;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn} onClick={onMenuClick}>
            <MenuIcon />
          </button>
          <Logo size="medium" />
        </div>

        <div className={styles.searchBar}>
          <SearchIcon color="#9EA2AD" />
          <input
            type="text"
            placeholder="Search appointments, records, labs..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
          {showSearchResults && (
            <div className={styles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={`${styles.searchResultIcon} ${styles[`searchResultIcon${result.icon.charAt(0).toUpperCase() + result.icon.slice(1)}`]}`}>
                      {getResultIcon(result.icon)}
                    </div>
                    <div className={styles.searchResultContent}>
                      <div className={styles.searchResultTitle}>{result.title}</div>
                      <div className={styles.searchResultSubtitle}>{result.subtitle}</div>
                      <div className={styles.searchResultCategory}>{result.category}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.searchNoResults}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <button className={styles.notificationBtn}>
            <BellIcon color="#4A4A4A" />
          </button>

          <div className={styles.userInfo}>
            <img src={avatar} alt={userName} className={styles.avatar} />
            <div className={styles.userDetails}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
