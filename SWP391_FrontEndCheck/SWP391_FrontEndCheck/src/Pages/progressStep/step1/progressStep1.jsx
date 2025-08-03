// src/Pages/progressStep/step1/progressStep1.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

function computeQuitDate(opt, picked) {
  const today = new Date();
  if (opt === "today") return today.toISOString().slice(0, 10);
  if (opt === "tomorrow") {
    let t = new Date(today);
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }
  if (opt === "notReady") {
    let w = new Date(today);
    w.setDate(w.getDate() + 7);
    return w.toISOString().slice(0, 10);
  }
  return picked; // pickDate
}

export default function ProgressComponent1() {
  const { userId, setQuitDate, setFinishTimeline } =
    useContext(ProgressContext);
  const [quitOption, setQuitOption] = useState("today");
  const [pickedDate, setPickedDate] = useState("");
  const [finishDays, setFinishDays] = useState(30);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleNext = async () => {
    if (quitOption === "pickDate" && !pickedDate) return;
    setSaving(true);
    const isoDate = computeQuitDate(quitOption, pickedDate);
    try {
      await api.post("/user-plan/general", {
        userId,
        quitDate: isoDate,
        finishTimeline: finishDays,
      });
      setQuitDate(isoDate);
      setFinishTimeline(finishDays);
      navigate(ROUTES.PROGRESS_STEP2);
    } catch {
      alert("Không lưu được, thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const options = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "pickDate", label: "Pick my date" },
    { value: "notReady", label: "Next week" },
  ];
  console.log("📦 Provider render, userId =", userId);
  return (
    <FullPageLayout>
      <div className={styles.card}>
        {/* MAIN */}
        <main className={styles.main}>
          <br />
          <h1 className={styles.title}>Create quit plan</h1>
          <p className={styles.subtitle}>
            <br />
            <br />
            Creating a personalized quit plan makes it easier to stay on track,
            get through hard times, and quit for good.
          </p>
          <br />
          <br />
          <div className={styles.progressBar}>
            <div className={styles.stepActive}>1</div>
            <div className={styles.barActive} />
            <div className={styles.step}>2</div>
            <div className={styles.bar} />
            <div className={styles.step}>3</div>
            <div className={styles.bar} />
            <div className={styles.step}>4</div>
            <div className={styles.bar} />
            <div className={styles.step}>5</div>
          </div>
          <br />
          <br />

          {/* QUESTION 1 */}
          <br />
          <br />
          <section className={styles.questionSection}>
            <h2 className={styles.questionTitle}>When is your quit date</h2>
            <br />
            <br />
            <p className={styles.questionDesc}>
              Pick a day in the next two weeks. This will give you enough time
              to prepare. Pick a date that isn’t already likely to be a
              stressful one.
            </p>
            <br />
            <br />
          </section>

          {/* OPTIONS */}
          <div className={styles.options}>
            {options.map((o) => (
              <label
                key={o.value}
                className={`${styles.option} ${quitOption === o.value ? styles.selected : ""}`}
              >
                <input
                  type="radio"
                  name="quitDateOption"
                  value={o.value}
                  checked={quitOption === o.value}
                  onChange={() => {
                    setQuitOption(o.value);
                    setDateError(false);
                  }}
                  className={styles.radioInput}
                />
                <span className={styles.customRadio} />
                {o.label}
              </label>
            ))}
          </div>

          {/* PICK DATE */}
          {quitOption === "pickDate" && (
            <div className={styles.dateCard}>
              <h4 className={styles.dateTitle}>Select your date</h4>
              <input
                type="date"
                value={pickedDate}
                onChange={(e) => setPickedDate(e.target.value)}
                className={styles.datePicker}
              />
            </div>
          )}

          {/* FOOTER */}
          <br />
          <br />
          <div className={styles.footer}>
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? "Saving…" : "Next step"}
            </button>
          </div>
        </main>
      </div>
    </FullPageLayout>
  );
}
