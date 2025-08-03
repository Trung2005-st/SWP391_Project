// src/Pages/progressStep/step2/progressStep2.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import logoImg from "../../../../image/quit.png";
import lineImg from "../../../../image/line133.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

export default function ProgressComponent2() {
  const {
    userId,
    cigarettesPerDay,
    setCigarettesPerDay,
    packCost,
    setPackCost,
    cigarettesPerPack,
    setCigarettesPerPack,
  } = useContext(ProgressContext);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleNext = async () => {
    if (!cigarettesPerDay || !packCost || !cigarettesPerPack) {
      alert("Nhập đầy đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      await api.post("/user-plan/stats", {
        userId,
        cigarettesPerDay,
        packCost,
        cigarettesPerPack,
      });
      navigate(ROUTES.PROGRESS_STEP3);
    } catch {
      alert("Lưu lỗi, thử lại");
    } finally {
      setSaving(false);
    }
  };
  return (
    <FullPageLayout>
      <div className={styles.card}>
        <main className={styles.main}>
          <h1 className={styles.title}>Create quit plan</h1>
          <p className={styles.subtitle}>
            <br />
            <br />
            Creating a personalized quit plan makes it easier to stay on track,
            get through hard times, and quit for good.
          </p>

          {/* PROGRESS BAR */}
          <br />
          <br />
          <div className={styles.progressBar}>
            <div className={styles.stepActive}>1</div>
            <div className={styles.barActive} />
            <div className={styles.stepActive}>2</div>
            <div className={styles.barActive} />
            <div className={styles.step}>3</div>
            <div className={styles.bar} />
            <div className={styles.step}>4</div>
            <div className={styles.bar} />
            <div className={styles.step}>5</div>
          </div>
          <br />
          <br />

          {/* QUESTION */}
          <br />
          <br />
          <section className={styles.questionSection}>
            <h2 className={styles.questionTitle}>
              What is smoking costing you?
            </h2>
            <br />
            <br />
            <p className={styles.questionDesc}>
              Enter how many cigarettes you smoke and how much a pack costs.
              You’ll find out how much you can save by quitting.
            </p>
            <br />
            <br />
          </section>

          {/* INPUTS */}
          <div className={styles.inputsRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>I smoke about</label>
              <input
                type="number"
                min="0"
                value={cigarettesPerDay}
                onChange={(e) => setCigarettesPerDay(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. 20"
              />
              <label className={styles.inputLabel}>cigarettes each day.</label>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>I spend about $</label>
              <input
                type="number"
                min="0"
                value={packCost}
                onChange={(e) => setPackCost(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. 5.50"
              />
              <label className={styles.inputLabel}>
                per pack of cigarettes.
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>It contains</label>
              <input
                type="number"
                min="0"
                value={cigarettesPerPack}
                onChange={(e) => setCigarettesPerPack(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. 20"
              />
              <label className={styles.inputLabel}>cigarettes per pack.</label>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <br />
          <br />
          <div className={styles.footerButtons}>
            <NavLink to={ROUTES.PROGRESS_STEP1}>
              <button className={styles.prevBtn} disabled={saving}>
                Previous step
              </button>
            </NavLink>
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
