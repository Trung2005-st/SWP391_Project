import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../profile/updateAppointment/styleAfterProgress.module.css";
import doctorIcon from "../../../../image/maleDoctor.png";
import { ROUTES } from "../../../configs/routes";
import { notification } from "antd";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

export default function AppointmentUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token] = useState(localStorage.getItem("token"));

  const appointment = location.state?.appointment;
  if (!appointment || !appointment.id) {
    navigate(ROUTES.APPOINTMENT_LIST);
    return null;
  }

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

  const toggleCheckbox = (list, setList, idx) => {
    const updated = [...list];
    updated[idx].checked = !updated[idx].checked;
    setList(updated);
  };

  const onSubmit = async () => {
    if (isSlotConflict) return;
    try {
      const payload = {
        doctorId: doctor.userID,
        symptoms: symptoms.filter((s) => s.checked).map((s) => s.label),
        goals: goals.filter((g) => g.checked).map((g) => g.label),
        history,
        frequency,
        shift: slot,
      };

      await api.put(`/appointments/${appointment.id}`, payload);

      notification.success({
        message: "Appointment updated!",
        description: "Your appointment has been updated successfully.",
        duration: 3,
      });

      navigate(ROUTES.APPOINTMENT_LIST);
    } catch (error) {
      notification.error({
        message: "Update failed!",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
        duration: 4,
      });
    }
  };

  const [allAppointments, setAllAppointments] = useState([]);
  const [conflictMessage, setConflictMessage] = useState("");
  const [isSlotConflict, setIsSlotConflict] = useState(false);

  useEffect(() => {
    api.get("/appointments/all").then((res) => setAllAppointments(res.data));
  }, []);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    let payload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Invalid token");
      return;
    }
    const userName = payload.sub || payload.username;

    const sameSlotAppointments = allAppointments.filter(
      (a) => a.shift === slot && a.appointmentDate?.startsWith(dateStr)
    );

    const hasOtherUserAppointment = sameSlotAppointments.some(
      (a) => a.userName !== userName
    );

    let msg = "";
    if (hasOtherUserAppointment) {
      msg = "Another user has booked this time slot.";
    }

    setConflictMessage(msg);
    setIsSlotConflict(hasOtherUserAppointment);
  }, [slot, allAppointments]);

  return (
    <FullPageLayout>
      <div className={styles.appointmentCard}>
        <h2 className={styles.appointmentTitle}>Edit Appointment</h2>

        <div className={styles.appointmentGrid}>
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
                Time Slot <span style={{ color: "#999" }}>(next day only)</span>
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                style={isSlotConflict ? { borderColor: "red" } : {}}
              >
                {slotOptions.map((o) => (
                  <option key={o.label} value={o.label}>
                    {o.label}
                  </option>
                ))}
              </select>
              {conflictMessage && (
                <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                  {conflictMessage}
                </div>
              )}
            </div>
          </div>
          <div className={styles.appointmentProfile}>
            <img src={doctor.avatar || doctorIcon} alt={doctor.name} />
            <h3>{doctor.name}</h3>
            <p className={styles.profileSpec}>{doctor.specialty}</p>
            <div className={styles.profileRating}>
              <span>★</span>
              <span>
                <strong>{doctor.rating}</strong> ({doctor.reviews})
              </span>
            </div>
            <p className={styles.profileDetails}>
              {doctor.experience} years of experience
              <br />
              {doctor.institution}
            </p>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button
            className={styles.appointmentButton}
            onClick={onSubmit}
            disabled={isSlotConflict}
          >
            Update Appointment
          </button>
        </div>
      </div>
    </FullPageLayout>
  );
}
