// src/Pages/userPlan/AfterProgressPlan.jsx
import React, { useState, useContext, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "../../userPlan/styleAfterProgress.module.css";
import logoImg from "../../../../image/quit.png";
import iconCigarette from "../../../../assets/icon-cigarette.png";
import iconSaving from "../../../../assets/icon-saving.png";
import iconCalendar from "../../../../assets/icon-calendar.png";
import iconCelebration from "../../../../assets/icon-celebration.png";
import cravingImg from "../../../../image/cravingImg.png";
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
import supportTeam from "../../../../image/supportTeam.png";
import expertHelp from "../../../../image/expertHelp.png";
import setBack from "../../../../image/setBack.png";
import { ROUTES } from "../../../configs/routes";
import { ProgressContext } from "../../../configs/ProgressContext";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function AfterProgressPlan() {
  const navigate = useNavigate();

  const {
    plan,
    quitDate,
    finishTimeline,
    cigarettesPerDay,
    packCost,
    cigarettesPerPack,
    selectedReasons,
    selectedTriggers,
    selectedStrategies,
  } = useContext(ProgressContext);
  const {
    setPlan,
    setQuitDate,
    setFinishTimeline,
    setCigarettesPerDay,
    setPackCost,
    setCigarettesPerPack,
    setSelectedReasons,
    setSelectedTriggers,
    setSelectedStrategies,
  } = useContext(ProgressContext);

  if (!plan || !Array.isArray(plan.weeklySteps)) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <div
            style={{ textAlign: "center", margin: "40px auto", maxWidth: 400 }}
          >
            <p>Chưa có kế hoạch. Vui lòng tạo kế hoạch mới.</p>
            <Button
              type="primary"
              onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
            >
              Tạo kế hoạch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);

  const nonSmokingDays = finishTimeline;
  const cigarettesAvoided = finishTimeline * cigarettesPerDay;
  const totalSaving = (cigarettesAvoided / cigarettesPerPack) * packCost;

  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((p) => !p);
  };

  const allSelections = useMemo(() => {
    const vals = [...selectedReasons];
    selectedTriggers.forEach((t) => vals.push(t.split("--")[1] || t));
    selectedStrategies.forEach((s) => vals.push(s.split("--")[1] || s));
    return vals;
  }, [selectedReasons, selectedTriggers, selectedStrategies]);

  const handleResetPlan = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa kế hoạch hiện tại và tạo mới không?"
      )
    ) {
      return;
    }
    try {
      await api.delete("/user-plan/general");
      setPlan(null);
      setQuitDate("");
      setFinishTimeline("");
      setCigarettesPerDay("");
      setPackCost("");
      setCigarettesPerPack("");
      setSelectedReasons([]);
      setSelectedTriggers([]);
      setSelectedStrategies([]);
      navigate(ROUTES.PROGRESS_STEP1);
    } catch (err) {
      console.error(err);
      alert("Xóa kế hoạch không thành công. Vui lòng thử lại.");
    }
  };

  // Summary cards
  const summary = [
    {
      icon: iconCigarette,
      value: `${cigarettesAvoided}`,
      label: "Cigarettes avoided",
    },
    {
      icon: iconSaving,
      value: `$${totalSaving.toFixed(2)}`,
      label: "Total saving",
    },
    {
      icon: iconCalendar,
      value: `${nonSmokingDays} days`,
      label: "Non‑smoking days",
    },
    {
      icon: iconCelebration,
      value: `${finishTimeline} days`,
      label: "Quitting timeline",
    },
  ];

  // Triggers
  const categoryMap = {
    social: {
      name: "Social Situations",
      keys: [
        "offered",
        "drinking",
        "party",
        "aroundSmokers",
        "seeingSmoke",
        "smellingSmoke",
      ],
    },
    routine: {
      name: "Routine Situations",
      keys: [
        "phone",
        "downtime",
        "coffee",
        "afterMeal",
        "tv",
        "commute",
        "drive",
        "gaming",
        "study",
      ],
    },
    emotions: {
      name: "My Emotions",
      keys: [
        "angry",
        "anxious",
        "bored",
        "frustrated",
        "happy",
        "lonely",
        "sad",
        "stressed",
      ],
    },
    withdrawal: {
      name: "Nicotine Withdrawal",
      keys: ["irritable", "restless", "cravings", "concentrate"],
    },
  };

  const triggersData = useMemo(() => {
    const counts = Object.fromEntries(
      Object.keys(categoryMap).map((k) => [k, 0])
    );
    allSelections.forEach((v) => {
      for (let k in categoryMap) {
        if (categoryMap[k].keys.includes(v)) {
          counts[k]++;
          break;
        }
      }
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([key, c]) => ({
      key,
      name: categoryMap[key].name,
      value: Math.round((c / total) * 100),
    }));
  }, [allSelections]);

  const sortedTriggers = useMemo(
    () => [...triggersData].sort((a, b) => b.value - a.value),
    [triggersData]
  );
  const currentKey = sortedTriggers[activeIndex]?.key;

  // Support cards
  const planSupportMap = {
    emotions: [
      {
        title: "Mindful Breathing",
        text: "Deep breaths can calm stress instead of a cigarette.",
        image: cravingImg,
        bold: "Try these tips:",
        list: [
          "Take 10 slow, deep breaths when you feel upset.",
          "Practice a two‑minute breathing exercise.",
          "Use a guided meditation app.",
        ],
        buttonText: "View details",
      },
      {
        title: "Call a Friend",
        text: "Reach out to someone supportive when emotions spike.",
        image: supportTeam,
        bold: "Try these tips:",
        list: [
          "Text or call a friend immediately when you’re stressed.",
          "Share your feelings instead of smoking.",
          "Join a supportive online community chat.",
        ],
        buttonText: "Community",
      },
    ],
    // ... routine/social/withdrawal tương tự nếu cần
  };

  const REASON_CARDS = {
    LIVE_LONGER: {
      icon: healthIcon,
      label: "Be healthier & live longer",
    },
    REDUCE_CANCER: {
      icon: doctorIcon,
      label: "Reduce my cancer risk",
    },
    LESS_COUGH: {
      icon: petsIcon,
      label: "Reduce coughing & breathing issues",
    },
    BE_A_ROLE_MODEL: {
      icon: exampleIcon,
      label: "Be a good role model",
    },
    SPEND_TIME: {
      icon: babyIcon,
      label: "Protect my children from secondhand smoke",
    },
    SOCIAL_PRESSURE: {
      icon: familyIcon,
      label: "Not harm others around me",
    },
    SAVE_MONEY: {
      icon: moneyIcon,
      label: "Save money for important things",
    },
    REDUCE_COST: {
      icon: futureIcon,
      label: "Smoking is too expensive",
    },
    PERSONAL_GOAL: {
      icon: envIcon,
      label: "Spend money on travel/investment",
    },
  };

  return (
    <div>
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

      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          {/* Summary cards */}
          <div className={styles.summaryGrid}>
            {summary.map((s, i) => (
              <div key={i} className={styles.summaryCard}>
                <img
                  src={s.icon}
                  className={styles.summaryIcon}
                  alt={s.label}
                />
                <div className={styles.summaryValue}>{s.value}</div>
                <div className={styles.summaryLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className={styles.title}>Your Personalized Plan</div>
          <div className={styles.timeline}>
            {plan.weeklySteps.map(({ week, title, content }, idx) => (
              <div key={week} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <span className={styles.weekCircle}>{week}</span>
                  {idx < plan.weeklySteps.length - 1 && (
                    <div className={styles.timelineLine} />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <h4>{title}</h4>
                  <div>{content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Support cards */}
          <div className={styles.title} style={{ marginTop: 28 }}>
            Support & Tips
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {planSupportMap[currentKey]?.map((card, idx) => (
              <div
                key={idx}
                className={styles.supportCard}
                style={{ flex: "1 1 280px", minWidth: 280 }}
              >
                <div className={styles.supportCover}>
                  <img alt={card.title} src={card.image} />
                </div>
                <div style={{ padding: 18 }}>
                  <strong>{card.title}</strong>
                  <div>{card.text}</div>
                  <div style={{ marginTop: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{card.bold}</span>
                    <ul className={styles.supportList}>
                      {card.list.map((li, i) => (
                        <li key={i}>{li}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    block
                    onClick={() =>
                      card.buttonText === "Community"
                        ? navigate(ROUTES.BLOG_SERVICE)
                        : navigate(ROUTES.COACH_LIST)
                    }
                    style={{ borderRadius: 20, marginTop: 8 }}
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Remind Yourself */}
          {selectedReasons.length > 0 && (
            <div className={styles.remindSection}>
              <div className={styles.title}>Remind Yourself Why You Quit</div>
              <div className={styles.remindGrid}>
                {selectedReasons.map((r) => (
                  <div key={r} className={styles.remindCard}>
                    <Avatar src={REASON_CARDS[r].icon} size={64} />
                    <div className={styles.remindText}>
                      {REASON_CARDS[r].label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button danger onClick={handleResetPlan}>
              Đặt lại kế hoạch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
