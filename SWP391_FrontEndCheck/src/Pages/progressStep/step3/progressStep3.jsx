// src/Pages/progressStep/step3/progressStep3.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import logoImg from "../../../../image/quit.png";
import healthIcon from "../../../../image/icon-health.png";
import familyIcon from "../../../../image/icon-family.png";
import doctorIcon from "../../../../image/icon-doctor.png";
import moneyIcon from "../../../../image/icon-money.png";
import exampleIcon from "../../../../image/icon-example.png";
import futureIcon from "../../../../image/icon-future.png";
import controlIcon from "../../../../image/icon-control.png";
import envIcon from "../../../../image/icon-environment.png";
import smellIcon from "../../../../image/icon-smell.png";
import petsIcon from "../../../../image/icon-pets.png";
import noSmokingIcon from "../../../../image/icon-no-smoking.png";
import babyIcon from "../../../../image/icon-baby.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function ProgressComponent3() {
  const { selectedReasons, setSelectedReasons } = useContext(ProgressContext);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const navigate = useNavigate();

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  const toggleReason = (val) =>
    setSelectedReasons((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );

  // Helpers to know which group is selected
  const personalHealthSelected = selectedReasons.some((r) =>
    ["healthier", "reduceCancer", "reduceBreathing"].includes(r)
  );
  const familySelected = selectedReasons.some((r) =>
    ["protectChildren", "beRoleModel", "noHarm"].includes(r)
  );
  const financialSelected = selectedReasons.some((r) =>
    ["saveMoney", "tooExpensive", "investInstead"].includes(r)
  );
  const appearanceSelected = selectedReasons.some((r) =>
    ["freshBreath", "betterSmile", "moreEnergy"].includes(r)
  );
  const controlSelected = selectedReasons.some((r) =>
    ["notAddicted", "respectBans", "seeFewerPeople"].includes(r)
  );

  const reasonGroups = [
    {
      title: "Personal Health",
      reasons: [
        {
          value: "healthier",
          label: "I want to be healthier and live longer",
          icon: healthIcon,
        },
        {
          value: "reduceCancer",
          label: "I want to reduce my cancer risk",
          icon: doctorIcon,
        },
        {
          value: "reduceBreathing",
          label: "I want to reduce coughing and breathing issues",
          icon: petsIcon,
        },
      ],
    },
    {
      title: "Family & Community",
      reasons: [
        {
          value: "protectChildren",
          label: "I want to protect my children from secondhand smoke",
          icon: babyIcon,
        },
        {
          value: "beRoleModel",
          label: "I want to be a good role model",
          icon: exampleIcon,
        },
        {
          value: "noHarm",
          label: "I don't want to harm others around me",
          icon: familyIcon,
        },
      ],
    },
    {
      title: "Financial / Saving Money",
      reasons: [
        {
          value: "saveMoney",
          label: "I want to save money for more important things",
          icon: moneyIcon,
        },
        {
          value: "tooExpensive",
          label: "I feel smoking is too expensive",
          icon: futureIcon,
        },
        {
          value: "investInstead",
          label: "I want to spend that money on travel or investment",
          icon: envIcon,
        },
      ],
    },
    {
      title: "Appearance & Life Quality",
      reasons: [
        { value: "freshBreath", label: "I want fresh breath", icon: smellIcon },
        {
          value: "betterSmile",
          label: "I want a better smile and whiter teeth",
          icon: exampleIcon,
        },
        {
          value: "moreEnergy",
          label: "I want more energy and better physical performance",
          icon: controlIcon,
        },
      ],
    },
    {
      title: "Self-Control & Social Norms",
      reasons: [
        {
          value: "notAddicted",
          label: "I don't want to be addicted anymore",
          icon: controlIcon,
        },
        {
          value: "respectBans",
          label: "I want to respect smoking bans",
          icon: noSmokingIcon,
        },
        {
          value: "seeFewerPeople",
          label: "I see fewer people smoking these days",
          icon: envIcon,
        },
      ],
    },
  ];

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
            Plan
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
                  Send Encouragment
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        {/* conditional header buttons */}
        {token ? (
          <>
            <div class={styles.groupBtn}>
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
          </>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      <div className={styles.page}>
        <div className={styles.card}>
          <main className={styles.main}>
            <h1 className={styles.title}>Create quit plan</h1>
            <br />
            <br />
            <p className={styles.subtitle}>
              Creating a personalized quit plan makes it easier to stay on
              track, get through hard times, and quit for good.
            </p>
            <br />
            <br />
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
            <br />
            <br />

            <section className={styles.questionSection}>
              <h2 className={styles.questionTitle}>Why are you quitting?</h2>
              <br />
              <p className={styles.questionDesc}>
                Knowing your reasons for why you want to quit smoking can help
                you stay motivated and on track, especially in difficult
                moments.
              </p>
              <br />
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
                        name="reasons"
                        value={value}
                        checked={selectedReasons.includes(value)}
                        onChange={() => toggleReason(value)}
                        className={styles.checkboxInput}
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

                {/* Detailed form for Personal Health */}
                {group.title === "Personal Health" &&
                  personalHealthSelected && (
                    <>
                      <br />
                      <h4 className={styles.questionTitle}>
                        Let us know your current health status
                      </h4>
                      <div className={styles.healthStatusCard}>
                        <div className={styles.healthSection}>
                          <h4>What symptoms are you experiencing?</h4>
                          <label>
                            <input type="checkbox" />
                            <span>Persistent cough</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Shortness of breath</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Fatigue during light activity</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Chest tightness or pain</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>No noticeable symptoms</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>How long have you been smoking?</h4>
                          <select className={styles.customDropdown}>
                            <option>choose your time</option>
                            <option>under 1 year</option>
                            <option>1 – 3 years</option>
                            <option>3 – 5 years</option>
                            <option>more than 5 years</option>
                          </select>
                          <br />
                          <h4>
                            On average, how many cigarettes do you smoke per
                            day?
                          </h4>
                          <select className={styles.customDropdown}>
                            <option>choose your amount</option>
                            <option>under 5 cigarettes</option>
                            <option>5 – 10 cigarettes</option>
                            <option>10 – 20 cigarettes</option>
                            <option>more than 20 cigarettes</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>What are your health goals?</h4>
                          <label>
                            <input type="checkbox" />
                            <span>Reduce coughing</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Improve breathing</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Increase physical stamina</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Lower cancer risk</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Live a longer, healthier life</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>
                            Have you ever been diagnosed with any of the
                            following
                          </h4>
                          <label>
                            <input type="radio" name="diagnosis" />
                            <span>Never been diagnosed</span>
                          </label>
                          <label>
                            <input type="radio" name="diagnosis" />
                            <span>Asthma</span>
                          </label>
                          <label>
                            <input type="radio" name="diagnosis" />
                            <span>Pneumonia</span>
                          </label>
                          <label>
                            <input type="radio" name="diagnosis" />
                            <span>COPD</span>
                          </label>
                          <label>
                            <input type="radio" name="diagnosis" />
                            <span>Heart disease</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                {/* Detailed form for Family & Community */}
                {group.title === "Family & Community" && familySelected && (
                  <>
                    <br />
                    <h4 className={styles.questionTitle}>
                      Tell us more about Family & Community
                    </h4>
                    <div className={styles.healthStatusCard}>
                      <div className={styles.healthSection}>
                        <h4>Who are you most concerned about?</h4>
                        <label>
                          <input type="checkbox" />
                          <span>Children</span>
                        </label>
                        <label>
                          <input type="checkbox" />
                          <span>Partner</span>
                        </label>
                        <label>
                          <input type="checkbox" />
                          <span>Friends</span>
                        </label>
                        <label>
                          <input type="checkbox" />
                          <span>Parents</span>
                        </label>
                        <label>
                          <input type="checkbox" />
                          <span>Pets</span>
                        </label>
                      </div>
                      <div className={styles.healthSection}>
                        <h4>How often are they exposed to smoke?</h4>
                        <select className={styles.customDropdown}>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Rarely</option>
                        </select>
                      </div>
                      <div className={styles.healthSection}>
                        <h4>How important is protecting them?</h4>
                        <select className={styles.customDropdown}>
                          <option>Not important</option>
                          <option>Somewhat important</option>
                          <option>Important</option>
                          <option>Very important</option>
                        </select>
                      </div>
                      <div className={styles.healthSection}>
                        <h4>Anything else to share?</h4>
                        <input
                          type="text"
                          placeholder="Your notes..."
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Detailed form for Financial / Saving Money */}
                {group.title === "Financial / Saving Money" &&
                  financialSelected && (
                    <>
                      <br />
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
                          <label>
                            <input type="checkbox" />
                            <span>Travel</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Education</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Debt</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Hobbies</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Savings target timeline</h4>
                          <select className={styles.customDropdown}>
                            <option>1 month</option>
                            <option>3 months</option>
                            <option>6 months</option>
                            <option>1 year</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Additional notes</h4>
                          <input
                            type="text"
                            placeholder="Your notes..."
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {/* Detailed form for Appearance & Life Quality */}
                {group.title === "Appearance & Life Quality" &&
                  appearanceSelected && (
                    <>
                      <br />
                      <h4 className={styles.questionTitle}>
                        Tell us about your appearance & life goals
                      </h4>
                      <div className={styles.healthStatusCard}>
                        <div className={styles.healthSection}>
                          <h4>Which improvements matter most?</h4>
                          <label>
                            <input type="checkbox" />
                            <span>Breath freshness</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Whiter teeth</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Better skin</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Higher stamina</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Expected timeline for results</h4>
                          <select className={styles.customDropdown}>
                            <option>Within 1 week</option>
                            <option>1 month</option>
                            <option>3 months</option>
                            <option>6 months</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Activities you’ll resume</h4>
                          <label>
                            <input type="checkbox" />
                            <span>Exercise</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Social events</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Travel</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Hobbies</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Other notes</h4>
                          <input
                            type="text"
                            placeholder="Your notes..."
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {/* Detailed form for Self-Control & Social Norms */}
                {group.title === "Self-Control & Social Norms" &&
                  controlSelected && (
                    <>
                      <br />
                      <h4 className={styles.questionTitle}>
                        Self-control & social norms details
                      </h4>
                      <div className={styles.healthStatusCard}>
                        <div className={styles.healthSection}>
                          <h4>How often do you feel cravings?</h4>
                          <select className={styles.customDropdown}>
                            <option>Hourly</option>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Rarely</option>
                          </select>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>What triggers cravings?</h4>
                          <label>
                            <input type="checkbox" />
                            <span>Work</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Home</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Social gatherings</span>
                          </label>
                          <label>
                            <input type="checkbox" />
                            <span>Driving</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Previous quit attempts?</h4>
                          <label>
                            <input type="radio" name="tries" />
                            <span>Never</span>
                          </label>
                          <label>
                            <input type="radio" name="tries" />
                            <span>Once</span>
                          </label>
                          <label>
                            <input type="radio" name="tries" />
                            <span>Multiple times</span>
                          </label>
                        </div>
                        <div className={styles.healthSection}>
                          <h4>Confidence level</h4>
                          <select className={styles.customDropdown}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            ))}

            <br />
            <div className={styles.footerButtons}>
              <NavLink to={ROUTES.PROGRESS_STEP2}>
                <button className={styles.prevBtn}>Previous step</button>
              </NavLink>
              <NavLink to={ROUTES.PROGRESS_STEP4}>
                <button className={styles.nextBtn}>Next step</button>
              </NavLink>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
