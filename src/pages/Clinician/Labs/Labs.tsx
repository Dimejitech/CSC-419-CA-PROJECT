import { useNavigate } from "react-router-dom";
import "./Labs.css";

type LabRow = {
  labId: string;
  testName: string;
  patient: string;
  status: "Stable" | "Urgent" | "Pending";
  lastVisit: string;
};

const pendingLabs: LabRow[] = [
  {
    labId: "LP-1021",
    testName: "Anna Lee",
    patient: "Anna Lee",
    status: "Stable",
    lastVisit: "Jan 12, 2024",
  },
  {
    labId: "CL-1033",
    testName: "Complete Blood Count",
    patient: "Anna Lee",
    status: "Stable",
    lastVisit: "Jan 12, 2024",
  },
];

const finishedLabs: LabRow[] = [
  {
    labId: "LP-1021",
    testName: "Anna Lee",
    patient: "Anna Lee",
    status: "Stable",
    lastVisit: "Jan 12, 2024",
  },
  {
    labId: "CL-1033",
    testName: "Complete Blood Count",
    patient: "Anna Lee",
    status: "Stable",
    lastVisit: "Jan 12, 2024",
  },
];

function StatusPill({ status }: { status: LabRow["status"] }) {
  return (
    <span className={`labs-pill labs-pill--${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function LabsTable({ title, rows }: { title: string; rows: LabRow[] }) {
  return (
    <div className="labs-tableCard">
      <div className="labs-tableCardHeader">
        <h3>{title}</h3>
      </div>

      <div className="labs-tableWrap">
        <table className="labs-table">
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Test Name</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th className="labs-thRight">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={`${title}-${r.labId}-${r.testName}`}>
                <td className="labs-tdMuted">{r.labId}</td>

                <td className="labs-tdMuted">
                  {r.testName === "Complete Blood Count" ? (
                    <span className="labs-wrap2">
                      Complete Blood <br />
                      Count
                    </span>
                  ) : (
                    r.testName
                  )}
                </td>

                <td className="labs-tdMuted">{r.patient}</td>

                <td>
                  <StatusPill status={r.status} />
                </td>

                <td className="labs-tdMuted">{r.lastVisit}</td>

                <td className="labs-tdRight">
                  <button className="labs-linkBtn" type="button">
                    Review Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="labs-viewAllRow">
        <button className="labs-viewAll" type="button">
          View All
        </button>
      </div>
    </div>
  );
}




function StatCard({
  variant,
  title,
  value,
}: {
  variant: "orange" | "red" | "green";
  title: string;
  value: number;
}) {
  return (
    <div className={`labs-stat labs-stat--${variant}`}>
      <div className="labs-statIcon" aria-hidden="true">
        {variant === "orange" && (
          <img
            src="/images/timer.png"
            alt=""
            className="labs-statImage"
          />
        )}

        {variant === "red" && (
          <img
            src="/images/alarm.png"
            alt=""
            className="labs-statImage"
          />
        )}

        {variant === "green" && (
          <img
            src="/images/check-circle.png"
            alt=""
            className="labs-statImage"
          />
        )}
      </div>

      <div className="labs-statText">
        <div className="labs-statTitle">{title}</div>
        <div className="labs-statValue">{value}</div>
      </div>
    </div>
  );
}


export default function Labs() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="labs-page">
      {/* Top bar */}
      <header className="labs-topbar">
      <div className="labs-brand">
        <img
          src="/images/citycare-logo-icon.png"
          alt="CityCare logo"
          className="labs-logoImage"
        />
        <span className="labs-brandName">CityCare</span>
      </div>


        <div className="labs-search">
          <span className="labs-searchIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.2-1.1 4.3 4.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input className="labs-searchInput" placeholder="Search..." />
        </div>

        <div className="labs-topRight">
          {/* UPDATED: notification bell image (no import) */}
          <button
            className="labs-iconBtn"
            type="button"
            aria-label="Notifications"
          >
            <img
              className="labs-bellImg"
              src="/images/notification-bell.png"
              alt="Notifications"
            />
            <span className="labs-dot" aria-hidden="true" />
          </button>

          <div className="labs-user">
            {/* UPDATED: Peter Parker avatar image (no import) */}
            <div className="labs-avatar">
              <img
                className="labs-avatarImg"
                src="/images/justin.jpg"
                alt="Peter Parker"
              />
            </div>

            <div className="labs-userMeta">
              <div className="labs-userName">Peter Parker</div>
              <div className="labs-userRole">Clinician</div>
            </div>
          </div>
        </div>
      </header>

      <div className="labs-body">

       {/* Sidebar */}
<aside className="labs-sidebar">
  <div className="labs-sidebarBox">
    <div className="labs-navHeader">
      <div className="labs-navHeaderPanel">
        <img
          className="labs-navHeaderCollapse"
          src="/images/sidebar-collapse.png"
          alt="Collapse sidebar"
        />
        <span className="labs-navHeaderTitle">Navigation</span>
      </div>
    </div>

    <div className="labs-sectionTitle">Main</div>

    <nav className="labs-nav">
      <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/dashboard')}>
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/home.png" alt="" />
        </span>
        Home
      </button>

      <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/appointments')}>
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/appointments.png" alt="" />
        </span>
        Appointments
      </button>

      <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/patients')}>
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/patients.png" alt="" />
        </span>
        Patients
      </button>

      <button className="labs-navItem labs-navItem--active" type="button">
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/labicon.svg" alt="" />
        </span>
        Labs
      </button>
    </nav>

    <div className="labs-sectionTitle labs-mt24">Secondary</div>

    <nav className="labs-nav">
      <button className="labs-navItem" type="button" onClick={() => handleNavigation('/clinician/profile')}>
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/profile.png" alt="" />
        </span>
        Profile
      </button>

      <button className="labs-navItem" type="button">
        <span className="labs-navItemIcon">
          <img className="labs-navImg" src="/images/help-circle.png" alt="" />
        </span>
        Help / Support
      </button>
    </nav>

    <button className="labs-logout" type="button" onClick={() => handleNavigation('/clinician/signin')}>
      <span className="labs-logoutIcon">
        <img className="labs-logoutImg" src="/images/log-out.png" alt="" />
      </span>
      Logout
    </button>
  </div>
</aside>


        

        {/* Content */}
        <main className="labs-content">
          <div className="labs-contentTop">
            <h1 className="labs-title">Labs</h1>

            <button className="labs-primaryBtn" type="button">
              Request New Lab
            </button>
          </div>

          <div className="labs-statsRow">
            <StatCard variant="orange" title="Pending Results" value={12} />
            <StatCard variant="red" title="Urgent / STAT" value={5} />
            <StatCard variant="green" title="Completed Today" value={23} />
          </div>

          <div className="labs-tables">
            <LabsTable title="Pending Labs" rows={pendingLabs} />
            <LabsTable title="Finished Labs" rows={finishedLabs} />
          </div>
        </main>
      </div>
    </div>
  );
}
