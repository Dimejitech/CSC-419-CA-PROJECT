import React, { useState } from 'react';
import styles from './Appointments.module.css';
import { Button } from '../../components';
import { AppointmentCalendarModal } from '../../components/Modals';
import avatar from '../../assets/avatar.png';

interface UpcomingAppointment {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed';
}

interface PastAppointment {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Completed';
}

const upcomingAppointment: UpcomingAppointment = {
  id: '1',
  doctorName: 'Dr Sarah Lee',
  department: 'Cardiology Department',
  date: 'Thursday, January 15, 2026',
  time: '10:00 A.M.',
  status: 'Completed',
};

const pastAppointments: PastAppointment[] = [
  {
    id: '1',
    doctorName: 'Dr James Blake',
    department: 'General Medicine',
    date: 'Monday, April 15, 2025',
    time: '1:00 P.M.',
    status: 'Completed',
  },
  {
    id: '2',
    doctorName: 'Dr James Blake',
    department: 'General Medicine',
    date: 'Monday, April 15, 2025',
    time: '1:00 P.M.',
    status: 'Completed',
  },
  {
    id: '3',
    doctorName: 'Dr James Blake',
    department: 'General Medicine',
    date: 'Monday, April 15, 2025',
    time: '1:00 P.M.',
    status: 'Completed',
  },
  {
    id: '4',
    doctorName: 'Dr James Blake',
    department: 'General Medicine',
    date: 'Monday, April 15, 2025',
    time: '1:00 P.M.',
    status: 'Completed',
  },
];

// Calendar Plus Icon with gradient
const CalendarPlusIcon: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.67 2.67V6.67" stroke="url(#calendar_grad_appt)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M21.33 2.67V6.67" stroke="url(#calendar_grad_appt)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="5.33" width="24" height="24" rx="3" stroke="url(#calendar_grad_appt)" strokeWidth="2"/>
    <path d="M4 12H28" stroke="url(#calendar_grad_appt)" strokeWidth="2"/>
    <path d="M16 17.33V25.33" stroke="url(#calendar_grad_appt)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 21.33H20" stroke="url(#calendar_grad_appt)" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="calendar_grad_appt" x1="4" y1="2.67" x2="28" y2="29.33" gradientUnits="userSpaceOnUse">
        <stop stopColor="#03A5FF"/>
        <stop offset="1" stopColor="#1FC16B"/>
      </linearGradient>
    </defs>
  </svg>
);

export const Appointments: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    // Handle the selected date (e.g., show confirmation, make API call)
    console.log('Selected date:', date);
    // You could add further logic here to book the appointment
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Appointments</h1>
      </div>

      {/* Upcoming Appointments Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
          <Button size="small" onClick={() => setIsCalendarOpen(true)}>Book Appointment</Button>
        </div>

        <div className={styles.upcomingCard}>
          <div className={styles.upcomingHeader}>
            <CalendarPlusIcon size={32} />
            <span className={styles.upcomingDateTime}>
              {upcomingAppointment.date} | {upcomingAppointment.time}
            </span>
          </div>

          <div className={styles.doctorCard}>
            <div className={styles.doctorInfo}>
              <img src={avatar} alt={upcomingAppointment.doctorName} className={styles.doctorAvatar} />
              <div className={styles.doctorDetails}>
                <span className={styles.doctorName}>{upcomingAppointment.doctorName}</span>
                <div className={styles.departmentRow}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.department}>{upcomingAppointment.department}</span>
                </div>
              </div>
            </div>
            <span className={styles.statusBadge}>{upcomingAppointment.status}</span>
          </div>

          <div className={styles.appointmentActions}>
            <Button size="small">View Details</Button>
            <Button variant="outline" size="small">Reschedule</Button>
            <button className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Past Appointments Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Past Appointments</h2>
          <button className={styles.viewMoreBtn}>View More</button>
        </div>

        <div className={styles.pastAppointmentsGrid}>
          {pastAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.pastCard}>
              <div className={styles.pastCardHeader}>
                <img src={avatar} alt={appointment.doctorName} className={styles.pastAvatar} />
                <div className={styles.pastInfo}>
                  <span className={styles.pastDate}>{appointment.date}</span>
                  <span className={styles.pastTime}>{appointment.time}</span>
                  <span className={styles.pastDoctor}>{appointment.doctorName}</span>
                  <span className={styles.pastDepartment}>{appointment.department}</span>
                </div>
                <span className={styles.statusBadge}>{appointment.status}</span>
              </div>
              <button className={styles.viewSummaryBtn}>View Summary</button>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Calendar Modal */}
      <AppointmentCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={handleDateSelect}
      />
    </div>
  );
};

export default Appointments;
