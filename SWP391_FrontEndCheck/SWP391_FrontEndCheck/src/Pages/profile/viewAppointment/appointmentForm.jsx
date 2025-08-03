import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../profile/updateAppointment/styleAfterProgress.module.css";
import doctorIcon from "../../../../image/maleDoctor.png";
import userIcon from "../../../../image/avt2.png";
import { ROUTES } from "../../../configs/routes";
import { notification } from "antd";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

export default function AppointmentView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token] = useState(localStorage.getItem("token"));

  const appointment = location.state?.appointment;
  if (!appointment || !appointment.id) {
    navigate(ROUTES.APPOINTMENT_LIST);
    return null;
  }

  const userInfo = {
    name: appointment.userName,
    avatar: userIcon,
    email: appointment.userEmail || "Not provided",
  };

  const doctor = {
    name: appointment.doctorName,
    avatar: appointment.avatar,
    rating: appointment.rating || 4.8,
    reviews: appointment.reviews || 100,
    specialty: appointment.specialty || "Quit Coach",
    experience: appointment.experience || 5,
    institution: appointment.institution || "Health Org",
    userID: appointment.doctorId,
  };

  const [symptoms, setSymptoms] = useState([
    {
      label: "Persistent cough",
      checked: appointment.symptoms?.includes("Persistent cough"),
    },
    {
      label: "Shortness of breath",
      checked: appointment.symptoms?.includes("Shortness of breath"),
    },
    {
      label: "Fatigue during light activity",
      checked: appointment.symptoms?.includes("Fatigue during light activity"),
    },
    {
      label: "Chest tightness or pain",
      checked: appointment.symptoms?.includes("Chest tightness or pain"),
    },
    {
      label: "No noticeable symptoms",
      checked: appointment.symptoms?.includes("No noticeable symptoms"),
    },
  ]);

  const [goals, setGoals] = useState([
    {
      label: "Reduce coughing",
      checked: appointment.goals?.includes("Reduce coughing"),
    },
    {
      label: "Improve breathing",
      checked: appointment.goals?.includes("Improve breathing"),
    },
    {
      label: "Increase physical stamina",
      checked: appointment.goals?.includes("Increase physical stamina"),
    },
    {
      label: "Lower cancer risk",
      checked: appointment.goals?.includes("Lower cancer risk"),
    },
    {
      label: "Live a longer, healthier life",
      checked: appointment.goals?.includes("Live a longer, healthier life"),
    },
  ]);

  const historyOptions = [
    "Asthma",
    "Pneumonia",
    "COPD",
    "Heart disease",
    "Never been diagnosed",
  ];
  const [history, setHistory] = useState(appointment.history || "Asthma");

  const frequencyOptions = ["Hourly", "Daily", "Weekly"];
  const [frequency, setFrequency] = useState(appointment.frequency || "Hourly");

  const slotOptions = [
    { label: "08:00-09:00", startHour: 8 },
    { label: "10:00-11:00", startHour: 10 },
    { label: "14:00-15:00", startHour: 14 },
    { label: "16:00-17:00", startHour: 16 },
    { label: "19:00-20:00", startHour: 19 },
  ];
  const [slot, setSlot] = useState(appointment.shift || slotOptions[0].label);

  const [allAppointments, setAllAppointments] = useState([]);

  return (
    <FullPageLayout>
      <div className={styles.appointmentCard}>
        <h2 className={styles.appointmentTitle}>Appointment Info</h2>

        <div className={styles.appointmentGrid}>
          <div className={styles.col}>
            <div className={styles.appointmentBox}>
              <h4>My health symptoms</h4>
              <ul>
                {symptoms
                  .filter((s) => s.checked)
                  .map((s, i) => (
                    <li key={i}>{s.label}</li>
                  ))}
              </ul>
            </div>

            <div className={styles.appointmentBox}>
              <h4>My health goals</h4>
              <ul>
                {goals
                  .filter((g) => g.checked)
                  .map((g, i) => (
                    <li key={i}>{g.label}</li>
                  ))}
              </ul>
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.appointmentBox}>
              <h4>Diagnosed history</h4>
              <p>{history}</p>
            </div>

            <div className={styles.selectGroup}>
              <label>How often do I feel craving</label>
              <p>{frequency}</p>
            </div>

            <div className={styles.selectGroup}>
              <label>Time Slot</label>
              <p>{slot}</p>
            </div>
          </div>
          <div className={styles.appointmentProfile}>
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userIcon; // fallback ảnh mặc định
              }}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "3px solid #16a34a",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "20px", fontWeight: "600" }}>
              {userInfo.name}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {userInfo.email || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </FullPageLayout>
  );
}
