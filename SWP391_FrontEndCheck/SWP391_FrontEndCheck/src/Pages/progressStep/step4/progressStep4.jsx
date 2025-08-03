// src/Pages/progressStep/step4/ProgressStep4.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import logoImg from "../../../../image/quit.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

export default function ProgressComponent4() {
  const { selectedTriggers, setSelectedTriggers } = useContext(ProgressContext);
  const navigate = useNavigate();
  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleNext = () => {
    navigate(ROUTES.PROGRESS_STEP5);
  };
  const triggers = [
    {
      group: "Social Situations",
      items: [
        { value: "offered", label: "Being offered a cigarette" },
        { value: "drinking", label: "Drinking alcohol or going to a bar" },
        { value: "party", label: "Going to a party or other social event" },
        {
          value: "aroundSmokers",
          label: "Being around others who smoke or use another tobacco product",
        },
        { value: "seeingSmoke", label: "Seeing someone else smoke" },
        { value: "smellingSmoke", label: "Smelling cigarette smoke" },
      ],
    },
    {
      group: "Routine Situations",
      items: [
        { value: "phone", label: "Being on my phone" },
        { value: "downtime", label: "Down time or in between activities" },
        { value: "coffee", label: "Drinking coffee" },
        { value: "afterMeal", label: "Finishing a meal" },
        { value: "tv", label: "Seeing cigarettes on TV or in movies" },
        { value: "commute", label: "Waiting for the bus or a ride" },
        { value: "drive", label: "Walking or driving" },
        { value: "gaming", label: "Watching TV or playing video games" },
        { value: "study", label: "Working or studying" },
      ],
    },
    {
      group: "My Emotions",
      items: [
        { value: "angry", label: "Angry" },
        { value: "anxious", label: "Anxious, worried, or nervous" },
        { value: "bored", label: "Bored" },
        { value: "frustrated", label: "Frustrated or upset" },
        { value: "happy", label: "Happy or excited" },
        { value: "lonely", label: "Lonely" },
        { value: "sad", label: "Sad, down, or depressed" },
        { value: "stressed", label: "Stressed or overwhelmed" },
      ],
    },
    {
      group: "Nicotine Withdrawal",
      items: [
        {
          value: "irritable",
          label: "Feeling irritable if I haven't smoked in a while",
        },
        { value: "restless", label: "Feeling restless or jumpy" },
        { value: "cravings", label: "Feeling strong cravings to smoke" },
        { value: "concentrate", label: "Having a hard time concentrating" },
      ],
    },
  ];

  const toggle = (val) => {
    setSelectedTriggers((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  return (
    <FullPageLayout>
      <div className={styles.page}>
        <div className={styles.card}>
          {/* MAIN CONTENT */}
          <main className={styles.main}>
            <h1 className={styles.title}>Create quit plan</h1>
            <br />
            <br />
            <p className={styles.subtitle}>
              Creating a personalized quit plan makes it easier to stay on
              track, get through hard times, and quit for good.
            </p>

            {/* PROGRESS BAR (step 4 active) */}
            <br />
            <br />
            <div className={styles.progressBar}>
              <div className={styles.stepActive}>1</div>
              <div className={styles.barActive} />
              <div className={styles.stepActive}>2</div>
              <div className={styles.barActive} />
              <div className={styles.stepActive}>3</div>
              <div className={styles.barActive} />
              <div className={styles.stepActive}>4</div>
              <div className={styles.bar} />
              <div className={styles.step}>5</div>
            </div>
            <br />
            <br />
            <h1 className={styles.title}>Know your triggers</h1>
            <br />
            <br />
            <p className={styles.subtitle}>
              After you stop smoking, certain places, situations, and feelings
              can make it hard to stay smokefree. Use this list to find what
              makes you want to smoke. We’ll give you strategies that will help
              you stay in control.
            </p>

            {/* TRIGGERS GRID */}
            <br />
            <br />
            <div className={styles.triggersGrid}>
              {triggers.map((group) => (
                <div key={group.group} className={styles.triggerCard}>
                  <h3 className={styles.triggerTitle}>{group.group}</h3>
                  <div className={styles.triggerList}>
                    {group.items.map((item) => (
                      <label key={item.value} className={styles.triggerItem}>
                        <input
                          type="checkbox"
                          checked={selectedTriggers.includes(item.value)}
                          onChange={() => toggle(item.value)}
                          className={styles.checkboxInput}
                        />
                        <span
                          className={`${styles.customCheckbox} ${
                            selectedTriggers.includes(item.value)
                              ? styles.checked
                              : ""
                          }`}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER BUTTONS */}
            <br />
            <div className={styles.footerButtons}>
              <NavLink to={ROUTES.PROGRESS_STEP3}>
                <button className={styles.prevBtn}>Previous step</button>
              </NavLink>
              <NavLink to={ROUTES.PROGRESS_STEP5}>
                <button className={styles.nextBtn} onClick={handleNext}>
                  Next Step
                </button>
              </NavLink>
            </div>
          </main>
        </div>
      </div>
    </FullPageLayout>
  );
}
