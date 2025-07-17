import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "../../coachFunction/styleAfterProgress.module.css";
import logoImg from "../../../../image/quit.png";
import doctorIcon from "../../../../image/maleDoctor.png";
import { ROUTES } from "../../../configs/routes";
import { Avatar, Button, notification } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";

export default function AppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Lấy doctor từ state và đảm bảo có đúng trường userID
  const doctor = location.state?.doctor;
  if (!doctor || !doctor.userID) {
    navigate(ROUTES.COACH_LIST);
    return null;
  }

  // Dropdown community
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((v) => !v);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  // Form state
  const [symptoms, setSymptoms] = useState([
    { label: "Persistent cough", checked: true },
    { label: "Shortness of breath", checked: false },
    { label: "Fatigue during light activity", checked: false },
    { label: "Chest tightness or pain", checked: true },
    { label: "No noticeable symptoms", checked: false },
  ]);
  const [goals, setGoals] = useState([
    { label: "Reduce coughing", checked: false },
    { label: "Improve breathing", checked: false },
    { label: "Increase physical stamina", checked: false },
    { label: "Lower cancer risk", checked: true },
    { label: "Live a longer, healthier life", checked: false },
  ]);
  const historyOptions = [
    "Asthma",
    "Pneumonia",
    "COPD",
    "Heart disease",
    "Never been diagnosed",
  ];
  const [history, setHistory] = useState("Asthma");
  const frequencyOptions = ["Hourly", "Daily", "Weekly"];
  const [frequency, setFrequency] = useState("Hourly");

  // Slot hour option (bổ sung mốc cụ thể)
  const slotOptions = [
    { label: "06:00-07:00", startHour: 6 },
    { label: "08:00-09:00", startHour: 8 },
    { label: "10:00-11:00", startHour: 10 },
    { label: "14:00-15:00", startHour: 14 },
    { label: "16:00-17:00", startHour: 16 },
    { label: "19:00-20:00", startHour: 19 },
    { label: "21:00-22:00", startHour: 21 },
  ];
  const [slot, setSlot] = useState(slotOptions[0].label);

  // Logic: Chỉ allow chọn slot cho ngày mai. Nếu muốn chặn slot đã trễ thì chỉnh thêm!
  const now = new Date();
  const currentHour = now.getHours();

  // Với logic này, tất cả slot đều allow (ngày mai)
  // Nếu muốn, bạn có thể kiểm tra nếu currentHour > endHour thì disable (nếu muốn block các slot quá trễ)
  const getSlotDisabled = (slotStartHour) => {
    // Luôn return false (tức luôn enable slot cho ngày mai)
    return false;
    // Nếu chỉ muốn enable slot sau giờ hiện tại (cho ngày hôm nay, thường không cần):
    // return slotStartHour <= currentHour;
  };

  const toggleCheckbox = (list, setList, idx) => {
    const arr = [...list];
    arr[idx].checked = !arr[idx].checked;
    setList(arr);
  };

  // Submit API
  const onSubmit = async () => {
    try {
      const payload = {
        doctorId: doctor.userID,
        symptoms: symptoms.filter((s) => s.checked).map((s) => s.label),
        goals: goals.filter((g) => g.checked).map((g) => g.label),
        history,
        frequency,
        shift: slot, // chỉ cần gửi slot/khung giờ!
      };
      await api.post("/appointments", payload);
      notification.success({
        message: "Appointment booked!",
        description: "Your appointment has been saved successfully.",
        duration: 3,
      });
      navigate(ROUTES.APPOINTMENT_LIST);
    } catch (error) {
      notification.error({
        message: "Booking failed!",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
        duration: 4,
      });
    }
  };

  return (
    <div>
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
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                marginRight: 16,
              }}
            />
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

      {/* PAGE WRAPPER */}
      <div className={styles.pageWrapper}>
        <div className={styles.appointmentCard}>
          <h2 className={styles.appointmentTitle}>Book Appointment</h2>
          <div className={styles.appointmentGrid}>
            {/* COL 1 */}
            <div className={styles.col}>
              <div className={styles.appointmentBox}>
                <h4>My health symptoms</h4>
                {symptoms.map((s, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={s.checked}
                      onChange={() => toggleCheckbox(symptoms, setSymptoms, i)}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
              <div className={styles.appointmentBox}>
                <h4>My health goals</h4>
                {goals.map((g, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={g.checked}
                      onChange={() => toggleCheckbox(goals, setGoals, i)}
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* COL 2 */}
            <div className={styles.col}>
              <div className={styles.appointmentBox}>
                <h4>Diagnosed history</h4>
                {historyOptions.map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="history"
                      checked={history === opt}
                      onChange={() => setHistory(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <div className={styles.selectGroup}>
                <label>How often do I feel craving</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {frequencyOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className={styles.selectGroup}>
                <label>
                  Time Slot{" "}
                  <span style={{ color: "#999" }}>(next day only)</span>
                </label>
                <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                  {slotOptions.map((o) => (
                    <option
                      key={o.label}
                      value={o.label}
                      disabled={getSlotDisabled(o.startHour)}
                      style={
                        getSlotDisabled(o.startHour) ? { color: "#ccc" } : {}
                      }
                    >
                      {o.label}
                      {getSlotDisabled(o.startHour) ? " - not available" : ""}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  * Only slots for tomorrow are available for booking.
                </div>
              </div>
            </div>
            {/* COL 3 */}
            <div className={styles.appointmentProfile}>
              <img src={doctor.avatar || doctorIcon} alt={doctor.name} />
              <h3>{doctor.name}</h3>
              <p className={styles.profileSpec}>{doctor.specialty}</p>
              <div className={styles.profileRating}>
                <span>★</span>
                <strong>{doctor.rating}</strong>
                <span>({doctor.reviews})</span>
              </div>
              <p className={styles.profileDetails}>
                {doctor.experience} years of experience
                <br />
                {doctor.institution}
              </p>
            </div>
          </div>
          {/* BUTTON ROW */}
          <div className={styles.buttonRow}>
            <button className={styles.appointmentButton} onClick={onSubmit}>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
