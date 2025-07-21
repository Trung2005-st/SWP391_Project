// src/Pages/progressStep/step5/ProgressStep5.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styleProgress.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
export default function ProgressComponent5() {
  const navigate = useNavigate();

  const { selectedStrategies, setSelectedStrategies } =
    useContext(ProgressContext);

  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };
  const toggleCommunityMenu = (e) => {
    e.preventDefault(); // ngăn NavLink navigate ngay lập tức
    setShowCommunityMenu((prev) => !prev);
  };

  // Lấy các lý do người dùng đã chọn khi component mount

  const groups = [
    {
      key: "reachSupport",
      title: "This is how I will reach out for support:",
      items: [
        {
          value: "sharePlan",
          label: "Share my plans to quit with people important to me",
        },
        { value: "findBuddy", label: "Find a quit buddy" },
        {
          value: "askAdvice",
          label:
            "Ask for advice or support from someone who has successfully quit",
        },
        {
          value: "joinCommunity",
          label:
            "Join a social media community with other people who are trying to quit",
        },
        {
          value: "reachOut",
          label: "Reach out to someone else close to me not listed here.",
        },
      ],
    },
    {
      key: "getExpert",
      title: "This is how I will get help from experts:",
      items: [
        {
          value: "talkDoctor",
          label:
            "Talk to my doctor, pharmacist, or other health care professional about how to quit smoking",
        },
        {
          value: "findCounsel",
          label: "Look for in-person quit-smoking counseling in my area.",
        },
        {
          value: "quitline",
          label:
            "Call a quitline to talk one-on-one with a trained counselor to help me quit.",
        },
        {
          value: "downloadApp",
          label:
            "Download a SmokeFree app to help me track cravings, get tips, and monitor my progress.",
        },
        {
          value: "chatOnline",
          label: "Chat online with a trained quit counselor.",
        },
        {
          value: "findExpert",
          label: "Find another way to connect with an expert for help.",
        },
      ],
    },
    {
      key: "distract",
      title: "When a craving hits, I will distract myself by:",
      items: [
        { value: "drinkWater", label: "Drinking a glass of water." },
        {
          value: "eatCrunchy",
          label:
            "Eating something crunchy like carrots, apples, or sunflower seeds.",
        },
        { value: "takeBreaths", label: "Taking 10 deep breaths." },
        { value: "getExercise", label: "Getting some exercise." },
        {
          value: "listenAudio",
          label:
            "Playing a game on my phone or listening to a podcast or audiobook.",
        },
        {
          value: "textSupport",
          label: "Texting or talking with someone who supports me.",
        },
        {
          value: "goOutside",
          label: "Going to a place where smoking isn’t allowed.",
        },
        {
          value: "findOther",
          label: "I will find other ways to distract myself.",
        },
      ],
    },
  ];

  const toggleItem = (groupKey, val) => {
    const key = `${groupKey}--${val}`;
    setSelectedStrategies((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  function computeQuitDate(opt, picked) {
    const today = new Date();
    if (opt === "today") {
      return today.toISOString().slice(0, 10);
    }
    if (opt === "tomorrow") {
      const t = new Date(today);
      t.setDate(t.getDate() + 1);
      return t.toISOString().slice(0, 10);
    }
    if (opt === "notReady") {
      const w = new Date(today);
      w.setDate(w.getDate() + 7);
      return w.toISOString().slice(0, 10);
    }
    // pickDate → we've bound pickedDate to be an ISO yyyy‑MM‑dd string
    return picked;
  }
  // after fetching:

  const handleFinish = () => {
    navigate(ROUTES.AFTER_PROGRESS_PLAN);
  };

  return (
    <div>
      {/* HEADER */}
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

          {/* Community với dropdown */}
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
              <div className={styles.barActive} />
              <div className={styles.stepActive}>5</div>
            </div>
            <br />
            <br />
            <h1 className={styles.title}>Set yourself up for success</h1>
            <br />
            <br />
            <p className={styles.subtitle}>
              Choose strategies and tools to help you quit. When preparing to
              quit, think about who you will reach out to for support, how you
              will get expert help, and how you will distract yourself when you
              have an urge.
            </p>
            <br />
            <br />

            <div className={styles.step5Groups}>
              {groups.map((g) => (
                <div key={g.key} className={styles.step5Card}>
                  <h2 className={styles.step5CardTitle}>{g.title}</h2>
                  <ul className={styles.step5List}>
                    {g.items.map((item) => {
                      const key = `${g.key}--${item.value}`;
                      const isSel = selectedStrategies.includes(key);
                      return (
                        <li
                          key={item.value}
                          className={styles.step5Item}
                          onClick={() => toggleItem(g.key, item.value)}
                        >
                          <span
                            className={`${styles.step5Custom} ${isSel ? styles.step5CustomChecked : ""}`}
                          >
                            {isSel && (
                              <svg
                                className={styles.checkIcon}
                                width="14"
                                height="11"
                                viewBox="0 0 14 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 5.5L5 9L13 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className={styles.step5Label}>
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* FOOTER BUTTONS */}
            <br />
            <br />
            <div className={styles.footerButtons}>
              <NavLink to={ROUTES.PROGRESS_STEP4}>
                <button className={styles.prevBtn}>Previous step</button>
              </NavLink>

              <button
                className={styles.nextBtn}
                onClick={() => navigate(ROUTES.AFTER_PROGRESS_STEP)}
              >
                See my plan
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
