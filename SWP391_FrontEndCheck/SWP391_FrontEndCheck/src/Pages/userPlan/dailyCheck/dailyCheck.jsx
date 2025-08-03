import React, { useEffect, useState, useContext } from "react";
import { Button, Input, Checkbox, message } from "antd";
import axios from "axios";
import styles from "../../userPlan/styleAfterProgress.module.css";
import iconCigarette from "../../../../assets/icon-cigarette.png";
import iconSaving from "../../../../assets/icon-saving.png";
import iconCalendar from "../../../../assets/icon-calendar.png";
import iconCelebration from "../../../../assets/icon-celebration.png";
import FullPageLayout from "../../../components/layout/UserLayOut";
import { ProgressContext } from "../../../configs/ProgressContext";
import { ROUTES } from "../../../configs/routes";

export default function DailyProgressPage() {
  const { userId } = useContext(ProgressContext);
  const today = new Date().toLocaleDateString("en-CA");

  const checklistItems = [
    "Drinking a glass of water.",
    "3 km run or walk.",
    "Taking 10 deep breaths.",
    "Share my plans progress to people important to me.",
    "Playing a game on my phone or listening to a podcast or audiobook.",
    "Changed habits that often lead to smoking (e.g. coffee breaks).",
    "Learned more about nicotine and asked a doctor about medications.",
    "View a blog in community",
  ];

  const [checklist, setChecklist] = useState(
    checklistItems.map((item) => ({ text: item, checked: false }))
  );
  const [smokedCigars, setSmokedCigars] = useState("");
  const [reason, setReason] = useState("");
  const [feeling, setFeeling] = useState("");
  const [summary, setSummary] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:8080/api/progress/summary?userId=${userId}`)
      .then((res) => {
        const data = res.data;
        const summaryData = [
          {
            icon: iconCigarette,
            value: `${data.cigarsAvoided} cigars`,
            label: "Total cigarettes avoid",
          },
          { icon: iconSaving, value: `$${data.saving}`, label: "Total saving" },
          {
            icon: iconCalendar,
            value: `${30 - data.totalDays} days`,
            label: "Total day left",
          },
          {
            icon: iconCelebration,
            value: `${data.totalDays} days`,
            label: "Total quitting day",
          },
        ];
        setSummary(summaryData);
      })
      .catch(() => {
        message.error("Failed to load summary");
      });
    const token = localStorage.getItem("token");

    // 2. Lấy lại report hôm nay
    axios
      .get(
        `http://localhost:8080/api/progress/daily-report?userId=${userId}&date=${today}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const data = res.data;
        if (data) {
          setSmokedCigars(data.smokedCigars.toString());
          setReason(data.reason);
          setFeeling(data.feeling);
        }
      })
      .catch(() => {});
    // 3. Lấy lại checklist hôm nay
    axios
      .get(
        `http://localhost:8080/api/progress/daily-checklist?userId=${userId}&date=${today}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const uniqueChecklist = Array.from(
            new Map(res.data.map((item) => [item.text, item])).values()
          );
          setChecklist(uniqueChecklist);
        } else {
          // fallback nếu không có dữ liệu (để user tick lại từ đầu)
          setChecklist(
            checklistItems.map((item) => ({ text: item, checked: false }))
          );
        }
      })
      .catch(() => {});
  }, [userId, refreshKey]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("You are not logged in. Please sign in again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/progress/daily-report",
        {
          userId,
          date: today,
          smokedCigars: parseInt(smokedCigars || 0),
          reason,
          feeling,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        "http://localhost:8080/api/progress/daily-checklist",
        {
          userId,
          date: today,
          checklist: checklist.map((item) => ({
            text: item.text,
            checked: item.checked ?? false, // đảm bảo có giá trị boolean
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Report submitted successfully!");
      setRefreshKey((prev) => prev + 1); // Triggers re-fetch
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response?.status === 401) {
        message.error("Unauthorized: Please login again.");
      } else {
        message.error("Failed to submit report.");
      }
    }
  };

  const toggleChecklist = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };

  return (
    <FullPageLayout>
      <div className={styles.card}>
        {/* Summary Row */}
        <div className={styles.summaryGrid}>
          {summary.map((s, i) => (
            <div key={i} className={styles.summaryCard}>
              <img src={s.icon} className={styles.summaryIcon} alt="" />
              <div className={styles.summaryValue}>{s.value}</div>
              <div className={styles.summaryLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            marginTop: 32,
          }}
        >
          {/* Checklist Section */}
          <div className={styles.reportPanel}>
            <div className={styles.panelTitle}>Daily action checklist</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {days.map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "6px 16px",
                    background:
                      idx === new Date().getDay() - 1 ? "#16a34a" : "#f3f4f6",
                    color: idx === new Date().getDay() - 1 ? "#fff" : "#374151",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            {checklist.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Checkbox
                  style={{ marginRight: 12 }}
                  checked={item.checked}
                  onChange={() => toggleChecklist(idx)}
                />
                <span>{item.text}</span>
              </div>
            ))}
            <Button
              type="primary"
              style={{
                marginTop: 24,
                backgroundColor: "#16a34a",
                borderRadius: 24,
              }}
              onClick={() => {
                window.location.href = ROUTES.REPORT_HISTORY; // tuỳ bạn định nghĩa
              }}
            >
              View plan report history
            </Button>
          </div>

          {/* Report Form */}
          <div className={styles.reportColumn}>
            <div className={styles.reportPanel}>
              <div className={styles.panelTitle}>Daily report</div>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>
                  How many cigars you smoke today?
                </span>
                <Input
                  placeholder="10"
                  className={styles.inputField}
                  value={smokedCigars}
                  onChange={(e) => setSmokedCigars(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>Why did you smoke?</span>
                <Input
                  placeholder="I feel so stress"
                  className={styles.inputField}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>
                  How do you feel about today checklist?
                </span>
                <Input
                  placeholder="hard"
                  className={styles.inputField}
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                />
              </div>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#16a34a",
                  borderRadius: 24,
                  marginTop: 16,
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>

            <div className={styles.reportPanel} style={{ marginTop: 24 }}>
              <h4>Keep in mind</h4>
              <p className={styles.remindText}>
                Today, you made an important decision: to start your quit
                smoking journey! Stay committed, patient, and disciplined every
                day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FullPageLayout>
  );
}
