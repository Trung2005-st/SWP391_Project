// src/Pages/progressStep/step1/progressStep1.jsx
import React, { useContext, useState } from "react";
import styles from "../../progressStep/styleProgress.module.css";
import logoImg from "../../../../image/quit.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function ProgressComponent1() {
  const { quitDate, setQuitDate, finishTimeline, setFinishTimeline } =
    useContext(ProgressContext);

  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [dateError, setDateError] = useState(false);

  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const handleNextStep = () => {
    if (quitDate === "pickDate" && !finishTimeline) {
      setDateError(true);
      return;
    }
    setDateError(false);
    navigate(ROUTES.PROGRESS_STEP2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  const options = [
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "pickDate", label: "Pick my date" },
    { value: "notReady", label: "Next week" },
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
          {/* MAIN */}
          <main className={styles.main}>
            <br />
            <h1 className={styles.title}>Create quit plan</h1>
            <p className={styles.subtitle}>
              <br />
              <br />
              Creating a personalized quit plan makes it easier to stay on
              track, get through hard times, and quit for good.
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

            <div className={styles.options}>
              {options.map(({ value, label }) => (
                <label
                  key={value}
                  className={`${styles.option} ${
                    quitDate === value ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="quitDate"
                    value={value}
                    checked={quitDate === value}
                    onChange={() => {
                      setQuitDate(value);
                      if (value === "pickDate" && !finishTimeline) {
                        setDateError(true);
                      } else {
                        setDateError(false);
                      }
                    }}
                    className={styles.radioInput}
                  />
                  <span className={styles.customRadio} />
                  {label}
                </label>
              ))}
            </div>

            {/* PICK DATE CARD */}
            <br></br>
            {quitDate === "pickDate" && (
              <div className={styles.dateCard}>
                <h4 className={styles.dateTitle}>Select your date</h4>
                <br />
                <input
                  type="date"
                  className={`${styles.datePicker} ${
                    dateError ? styles.inputError : ""
                  }`}
                  value={finishTimeline}
                  onChange={(e) => {
                    setFinishTimeline(e.target.value);
                    setDateError(false);
                  }}
                />
                {dateError && (
                  <div className={styles.errorText}>
                    Please select a date before continuing
                  </div>
                )}
              </div>
            )}
            <br></br>

            {/* FOOTER */}
            <br />
            <br />
            <div className={styles.footer}>
              <button className={styles.nextBtn} onClick={handleNextStep}>
                Next step
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
