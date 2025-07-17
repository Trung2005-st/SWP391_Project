import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  LogoutOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import avt1 from "../../../../image/avt.png";
import avt2 from "../../../../image/avt2.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";

const AVATAR_MOCKS = [avt1, avt2];

function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
function formatTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AppointmentList() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);

  // *** Chỉ lấy user từ API (không từ localStorage!) ***
  useEffect(() => {
    async function fetchUserAndAppointments() {
      try {
        // Lấy user thực từ BE
        const resUser = await api.get("/users/me", {
          headers: { Authorization: "Bearer " + token },
        });
        setUser(resUser.data);

        // Lấy danh sách appointment đúng role
        if (resUser.data.role === "COACH") {
          const resApp = await api.get("/appointments/for-coach", {
            headers: { Authorization: "Bearer " + token },
          });
          setAppointments(resApp.data || []);
        } else {
          const resApp = await api.get("/appointments/my", {
            headers: { Authorization: "Bearer " + token },
          });
          setAppointments(resApp.data || []);
        }
      } catch (e) {
        setUser(null);
        setAppointments([]);
      }
    }
    if (token) fetchUserAndAppointments();
  }, [token]);

  const isCoach = user?.role === "COACH";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };

  const handleMeet = (item) => {
    if (item.meetUrl) {
      window.open(item.meetUrl, "_blank");
    } else {
      alert("Google Meet chưa sẵn sàng cho lịch hẹn này!");
    }
  };

  const handleEdit = (item) => {
    alert(`Edit: ${item.id}`);
  };

  const handleCancel = (item) => {
    if (window.confirm("Cancel this appointment?")) {
      setAppointments((prev) => prev.filter((a) => a.id !== item.id));
    }
  };

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  function isMeetAvailable(appointmentDate) {
    if (!appointmentDate) return false;
    const now = new Date();
    const appt = new Date(appointmentDate);
    return now < new Date(appt.getTime() + 30 * 60000);
  }

  return (
    <div className={styles.fullPage}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logoImg} alt="QuitHub" className={styles.logoImg} />
          <span className={styles.logoText}>QuitHub</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to={ROUTES.HOME} className={styles.navItem}>
            Home
          </NavLink>
          <NavLink to={ROUTES.LEADERBOARD} className={styles.navItem}>
            Leaderboard
          </NavLink>
          <NavLink to={ROUTES.PROGRESS_STEP1} className={styles.navItem}>
            Progress
          </NavLink>
          <div className={styles.communityWrapper}>
            <a
              href="/community"
              className={styles.navItem}
              onClick={toggleCommunityMenu}
            >
              Community
            </a>
            {showCommunityMenu && (
              <div className={styles.dropdownMenu}>
                <NavLink
                  to={ROUTES.COACH_LIST}
                  className={styles.dropdownItem}
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Doctor Service
                </NavLink>
                <NavLink
                  to={ROUTES.BLOG_SERVICE}
                  className={styles.dropdownItem}
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Blog Service
                </NavLink>
                <NavLink
                  to={ROUTES.SEND_ENCOURAGEMENT}
                  className={styles.dropdownItem}
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Send Encouragement
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        {token ? (
          <div className={styles.groupBtn}>
            <NavLink to={ROUTES.PROFILE_PAGE}>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#52c41a",
                  color: "#fff",
                  marginRight: 16,
                }}
              />
            </NavLink>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      {/* CONTENT */}
      <div className={styles.pageWrapper}>
        <div className={styles.twoColumn}>
          {/* SIDEBAR */}
          <div className={styles.card}>
            <nav className={styles.sidebar}>
              <ul>
                <NavLink to={ROUTES.PROFILE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <UserOutlined className={styles.icon} />
                    <span>Profile</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.BLOG_MANAGER}>
                  <li className={styles.sidebarItem}>
                    <EditOutlined className={styles.icon} />
                    <span>Blog manager</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.NOTIFICATION}>
                  <li className={styles.sidebarItem}>
                    <BellOutlined className={styles.icon} />
                    <span>Notification</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.ARCHIVE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <InboxOutlined className={styles.icon} />
                    <span>Archive</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.APPOINTMENT_LIST}>
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
                    <CalendarOutlined className={styles.icon} />
                    <span>Appointment</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.FEEDBACK}>
                  <li className={styles.sidebarItem}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* MAIN CONTENT */}
          <div className={styles.card2} style={{ maxWidth: 1200 }}>
            <h2 className={styles.pageTitle} style={{ marginBottom: 24 }}>
              Appointment
            </h2>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 5px 16px rgba(8,15,52,0.08)",
                padding: "32px 0",
                maxWidth: 800,
                margin: "10 auto",
              }}
            >
              {appointments.length === 0 && (
                <div style={{ textAlign: "center", padding: 40 }}>
                  No appointments found.
                </div>
              )}
              {appointments.map((item, idx) => {
                const avatar =
                  AVATAR_MOCKS[
                    ((isCoach ? item.userName : item.doctorName)?.length || 0) %
                      AVATAR_MOCKS.length
                  ];
                const displayName = isCoach
                  ? item.userName || "Unknown"
                  : item.doctorName || "Unknown";
                const isAvailable = isMeetAvailable(item.appointmentDate);

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 20,
                      borderRadius: 16,
                      padding: "16px 24px",
                      background: isAvailable
                        ? "linear-gradient(90deg, #e7fbee, #e6fef1)"
                        : "linear-gradient(90deg, #e0edfa, #e8f1fa)",
                      boxShadow: "0 2px 12px 0 rgba(20, 61, 50, 0.04)",
                    }}
                  >
                    <Avatar src={avatar} size={44} />
                    <div style={{ marginLeft: 20, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          marginBottom: 2,
                          color: "#1f2041",
                        }}
                      >
                        {displayName}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#63667c",
                          marginBottom: 2,
                        }}
                      >
                        {formatTime(item.appointmentDate)}{" "}
                        <span style={{ color: "#aaa" }}>
                          {formatDate(item.appointmentDate)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="large"
                      style={{
                        background: isAvailable ? "#16a34a" : "#e5e7eb",
                        color: isAvailable ? "#fff" : "#737373",
                        fontWeight: 600,
                        borderRadius: 16,
                        width: 110,
                        marginLeft: 20,
                        fontSize: 16,
                        boxShadow: isAvailable
                          ? "0 2px 8px #b8efc2"
                          : undefined,
                      }}
                      disabled={!isAvailable}
                      onClick={() => handleMeet(item)}
                    >
                      Meet
                    </Button>
                    {!isCoach && (
                      <div style={{ display: "flex", gap: 10, marginLeft: 8 }}>
                        <Button
                          size="large"
                          style={{
                            background: isAvailable ? "#2563eb" : "#e5e7eb",
                            color: isAvailable ? "#fff" : "#737373",
                            fontWeight: 600,
                            borderRadius: 16,
                            minWidth: 75,
                            fontSize: 16,
                          }}
                          disabled={!isAvailable}
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="large"
                          style={{
                            background: isAvailable ? "#dc2626" : "#e5e7eb",
                            color: isAvailable ? "#fff" : "#737373",
                            fontWeight: 600,
                            borderRadius: 16,
                            minWidth: 75,
                            fontSize: 16,
                          }}
                          disabled={!isAvailable}
                          icon={<DeleteOutlined />}
                          onClick={() => handleCancel(item)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
