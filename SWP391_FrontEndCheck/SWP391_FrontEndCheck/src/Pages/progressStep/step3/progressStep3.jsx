// src/Pages/progressStep/step3/progressStep3.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import healthIcon from "../../../../image/icon-health.png";
import doctorIcon from "../../../../image/icon-doctor.png";
import petsIcon from "../../../../image/icon-pets.png";
import exampleIcon from "../../../../image/icon-example.png";
import babyIcon from "../../../../image/icon-baby.png";
import familyIcon from "../../../../image/icon-family.png";
import moneyIcon from "../../../../image/icon-money.png";
import futureIcon from "../../../../image/icon-future.png";

import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { getRecommendedPlan, PLAN_DEFINITIONS } from "../planUtils";
import FullPageLayout from "../../../components/layout/UserLayOut";

export default function ProgressComponent3() {
  const { selectedReasons, setSelectedReasons, setPlan } =
    useContext(ProgressContext);
  const navigate = useNavigate();

  // header token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // chọn / bỏ chọn lý do
  const toggleReason = (code) => {
    setSelectedReasons((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  // kiểm tra từng nhóm đã có ít nhất 1 lý do
  const personalHealthSelected = selectedReasons.some((r) =>
    ["LIVE_LONGER", "REDUCE_CANCER", "LESS_COUGH"].includes(r)
  );
  const familySelected = selectedReasons.some((r) =>
    ["BE_A_ROLE_MODEL", "SPEND_TIME", "SOCIAL_PRESSURE"].includes(r)
  );
  const financialSelected = selectedReasons.some((r) =>
    ["SAVE_MONEY", "REDUCE_COST", "PERSONAL_GOAL"].includes(r)
  );

  // cấu trúc các nhóm lý do
  const reasonGroups = [
    {
      title: "Personal Health",
      reasons: [
        {
          value: "LIVE_LONGER",
          label: "I want to be healthier and live longer",
          icon: healthIcon,
        },
        {
          value: "REDUCE_CANCER",
          label: "I want to reduce my cancer risk",
          icon: doctorIcon,
        },
        {
          value: "LESS_COUGH",
          label: "I want to reduce coughing and breathing issues",
          icon: petsIcon,
        },
      ],
    },
    {
      title: "Family & Community",
      reasons: [
        {
          value: "BE_A_ROLE_MODEL",
          label: "I want to be a good role model",
          icon: exampleIcon,
        },
        {
          value: "SPEND_TIME",
          label: "I want to protect my children from secondhand smoke",
          icon: babyIcon,
        },
        {
          value: "SOCIAL_PRESSURE",
          label: "I don't want to harm others around me",
          icon: familyIcon,
        },
      ],
    },
    {
      title: "Financial / Saving Money",
      reasons: [
        {
          value: "SAVE_MONEY",
          label: "I want to save money for more important things",
          icon: moneyIcon,
        },
        {
          value: "REDUCE_COST",
          label: "I feel smoking is too expensive",
          icon: futureIcon,
        },
        {
          value: "PERSONAL_GOAL",
          label: "I want to spend that money on travel or investment",
          icon: futureIcon,
        },
      ],
    },
  ];

  const handleNext = () => {
    if (!selectedReasons.length) {
      alert("Hãy chọn ít nhất một lý do");
      return;
    }
    const planCode = getRecommendedPlan(selectedReasons);
    const plan = PLAN_DEFINITIONS[planCode];
    setPlan(plan);
    navigate(ROUTES.PROGRESS_STEP4, { state: plan });
  };

  return (
    <FullPageLayout>
      <div className={styles.page}>
        <div className={styles.card}>
          <main className={styles.main}>
            <h1 className={styles.title}>Create quit plan</h1>
            <p className={styles.subtitle}>
              Creating a personalized quit plan makes it easier to stay on
              track, get through hard times, and quit for good.
            </p>

            <div className={styles.progressBar}>
              <div className={styles.stepActive}>1</div>
              <div className={styles.barActive} />
              <div className={styles.stepActive}>2</div>
              <div className={styles.barActive} />
              <div className={styles.stepActive}>3</div>
              <div className={styles.bar} />
              <div className={styles.step}>4</div>
              <div className={styles.bar} />
              <div className={styles.step}>5</div>
            </div>

            <section className={styles.questionSection}>
              <h2 className={styles.questionTitle}>Why are you quitting?</h2>
              <p className={styles.questionDesc}>
                Knowing your reasons for why you want to quit smoking can help
                you stay motivated and on track, especially in difficult
                moments.
              </p>
            </section>

            {reasonGroups.map((group) => (
              <div key={group.title} className={styles.reasonGroup}>
                <h3 className={styles.reasonGroupTitle}>{group.title}</h3>
                <div className={styles.reasonRow}>
                  {group.reasons.map(({ value, label, icon }) => (
                    <label
                      key={value}
                      className={`${styles.reasonCard} ${selectedReasons.includes(value) ? styles.selected : ""}`}
                      onClick={() => toggleReason(value)}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={selectedReasons.includes(value)}
                        onChange={() => toggleReason(value)}
                      />
                      <img
                        src={icon}
                        alt={label}
                        className={styles.reasonIcon}
                      />
                      <span className={styles.reasonLabel}>{label}</span>
                    </label>
                  ))}
                </div>

                {/* Personal Health detail */}
                {group.title === "Personal Health" &&
                  personalHealthSelected && (
                    <>
                      <h4 className={styles.questionTitle}>
                        Let us know your current health status
                      </h4>
                      <div className={styles.healthStatusCard}>
                        <div className={styles.healthSection}>
                          <h4>What symptoms are you experiencing?</h4>
                          {[
                            "Persistent cough",
                            "Shortness of breath",
                            "Fatigue during light activity",
                            "Chest tightness or pain",
                            "No noticeable symptoms",
                          ].map((t) => (
                            <label key={t}>
                              <input type="checkbox" />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                        <div className={styles.healthSection}>
                          <h4>How long have you been smoking?</h4>
                          <select className={styles.customDropdown}>
                            <option>under 1 year</option>
                            <option>1 – 3 years</option>
                            <option>3 – 5 years</option>
                            <option>more than 5 years</option>
                          </select>
                          <h4>Average cigarettes per day?</h4>
                          <select className={styles.customDropdown}>
                            <option>under 5</option>
                            <option>5 – 10</option>
                            <option>10 – 20</option>
                            <option>more than 20</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>What are your health goals?</h4>
                          {[
                            "Reduce coughing",
                            "Improve breathing",
                            "Increase stamina",
                            "Lower cancer risk",
                            "Live a longer, healthier life",
                          ].map((t) => (
                            <label key={t}>
                              <input type="checkbox" />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                {/* Family & Community detail */}
                {group.title === "Family & Community" && familySelected && (
                  <>
                    <h4 className={styles.questionTitle}>
                      Tell us more about Family & Community
                    </h4>
                    <div className={styles.healthStatusCard}>
                      <div className={styles.healthSection}>
                        <h4>Who are you most concerned about?</h4>
                        {[
                          "Children",
                          "Partner",
                          "Friends",
                          "Parents",
                          "Pets",
                        ].map((t) => (
                          <label key={t}>
                            <input type="checkbox" />
                            <span>{t}</span>
                          </label>
                        ))}
                      </div>
                      <div className={styles.healthSection}>
                        <h4>How often are they exposed?</h4>
                        <select className={styles.customDropdown}>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Rarely</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Financial detail */}
                {group.title === "Financial / Saving Money" &&
                  financialSelected && (
                    <>
                      <h4 className={styles.questionTitle}>
                        Help us understand your financial goals
                      </h4>
                      <div className={styles.healthStatusCard}>
                        <div className={styles.healthSection}>
                          <h4>Weekly cigarette spend</h4>
                          <select className={styles.customDropdown}>
                            <option>Under $10</option>
                            <option>$10–20</option>
                            <option>$20–50</option>
                            <option>Over $50</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>What would you rather save for?</h4>
                          {["Travel", "Education", "Debt", "Hobbies"].map(
                            (t) => (
                              <label key={t}>
                                <input type="checkbox" />
                                <span>{t}</span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
              </div>
            ))}

            <div className={styles.footerButtons}>
              <NavLink to={ROUTES.PROGRESS_STEP2}>
                <button className={styles.prevBtn}>Previous step</button>
              </NavLink>
              <button className={styles.nextBtn} onClick={handleNext}>
                Next step
              </button>
            </div>
          </main>
        </div>
      </div>
    </FullPageLayout>
  );
}
