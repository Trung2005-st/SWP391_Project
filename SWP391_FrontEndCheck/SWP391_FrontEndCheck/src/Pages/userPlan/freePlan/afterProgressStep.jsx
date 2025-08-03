// src/Pages/userPlan/AfterProgressPlan.jsx
import React, { useState, useContext, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
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
import { Row, Col, Card, Typography, Space } from "antd";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

const { Title, Paragraph, Text } = Typography;

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
      <FullPageLayout>
        <Card
          style={{ textAlign: "center", margin: "40px auto", maxWidth: 400 }}
        >
          <Paragraph>
            You haven't set up a plan yet! Please create your personal quit
            plan!
          </Paragraph>
          <Button
            type="primary"
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Create your plan
          </Button>
        </Card>
      </FullPageLayout>
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const colors = ["#00D1A1", "#FAC64B", "#003F5C", "#0088FE"];

  const nonSmokingDays = finishTimeline;
  const cigarettesAvoided = finishTimeline * cigarettesPerDay;
  const totalSaving = (cigarettesAvoided / cigarettesPerPack) * packCost;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const allSelections = useMemo(() => {
    const vals = [...selectedReasons];
    selectedTriggers.forEach((t) => vals.push(t.split("--")[1] || t));
    selectedStrategies.forEach((s) => vals.push(s.split("--")[1] || s));
    return vals;
  }, [selectedReasons, selectedTriggers, selectedStrategies]);

  const handleResetPlan = async () => {
    if (
      !window.confirm(
        "Do you want to remove your current plan and have a new one?"
      )
    ) {
      return;
    }
    try {
      // 1) delete on server
      await api.delete("/user-plan/general");
      // 2) clear out all plan‐related context state
      setPlan(null);
      setQuitDate("");
      setFinishTimeline("");
      setCigarettesPerDay("");
      setPackCost("");
      setCigarettesPerPack("");
      setSelectedReasons([]);
      setSelectedTriggers([]);
      setSelectedStrategies([]);
      // 3) navigate back to step 1
      navigate(ROUTES.PROGRESS_STEP1);
    } catch (err) {
      console.error(err);
      alert("Remove plan failed! Please try again!");
    }
  };

  // 2) Map each trigger category to its values
  const categoryMap = {
    social: {
      name: "Social Situations",
      description:
        "Being offered, seeing, or smelling cigarettes can spark cravings.",
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
      description:
        "Phone breaks, meals, TV time or commuting can remind you of smoking.",
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
      description: "Stress, boredom or other feelings can trigger cravings.",
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
      description:
        "Restlessness, irritability or concentration issues happen without nicotine.",
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
      description: categoryMap[key].description,
      value: Math.round((c / total) * 100),
    }));
  }, [allSelections]);

  // 6) sorted triggers
  const sortedTriggers = useMemo(
    () => [...triggersData].sort((a, b) => b.value - a.value),
    [triggersData]
  );
  const currentKey = sortedTriggers[activeIndex]?.key;

  const reasonLabels = {
    LIVE_LONGER: "Be healthier & live longer",
    REDUCE_CANCER: "Reduce my cancer risk",
    LESS_COUGH: "Reduce coughing & breathing issues",
    BE_A_ROLE_MODEL: "Be a good role model",
    SPEND_TIME: "Protect my children from secondhand smoke",
    SOCIAL_PRESSURE: "Not harm others around me",
    SAVE_MONEY: "Save money for important things",
    REDUCE_COST: "Smoking is too expensive",
    PERSONAL_GOAL: "Spend money on travel/investment",
  };
  const planSteps = selectedReasons.map((code, i) => ({
    step: i + 1,
    label: reasonLabels[code] || code,
  }));
  // 4) Summary cards
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

  // 5) Plan‑support cards by top trigger key
  const planSupportMap = {
    social: [
      {
        title: "Plan for Social Settings",
        text: "Alternate drinks, bring gum, or suggest smoke‑free venues.",
        image: cravingImg,
        bold: "Try these tips:",
        list: [
          "Alternate alcoholic drinks with water or soda.",
          "Bring your own non‑alcoholic beverage.",
          "Have a go‑to conversation topic instead of accepting offers.",
        ],
        buttonText: "View details",
      },
      {
        title: "Enlist Your Friends",
        text: "An accountability partner makes it easier when others smoke.",
        image: supportTeam,
        bold: "Try these tips:",
        list: [
          "Share your quit date and ask for their support.",
          "Invite a quit buddy to events.",
          "Join an online quit group.",
        ],
        buttonText: "Community",
      },
    ],
    routine: [
      {
        title: "Change Your Daily Routine",
        text: "Break habits that cue a smoke—swap your after‑meal ritual.",
        image: cravingImg,
        bold: "Try these tips:",
        list: [
          "After meals, go for a brisk walk or chew gum.",
          "Use a stress ball during phone breaks.",
          "Schedule short stretch breaks instead of smoke breaks.",
        ],
        buttonText: "View details",
      },
      {
        title: "Build Positive Habits",
        text: "Replace old routines with healthy rituals to weaken cravings.",
        image: supportTeam,
        bold: "Try these tips:",
        list: [
          "Treat yourself to a healthy snack on smoke‑free days.",
          "Keep a puzzle or hobby at hand.",
          "Celebrate smoke‑free milestones.",
        ],
        buttonText: "Community",
      },
    ],
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
    withdrawal: [
      {
        title: "Nicotine Replacement",
        text: "Gum or lozenges can ease withdrawal cravings safely.",
        image: cravingImg,
        bold: "Try these tips:",
        list: [
          "Keep gum or lozenges handy at first sign of craving.",
          "Follow package directions carefully.",
          "Talk to your pharmacist about dosage.",
        ],
        buttonText: "View details",
      },
      {
        title: "Stay Hydrated",
        text: "Water can distract and alleviate restlessness.",
        image: supportTeam,
        bold: "Try these tips:",
        list: [
          "Carry a water bottle and sip often.",
          "Alternate water sips with deep breaths.",
          "Flavor water with lemon or cucumber.",
        ],
        buttonText: "Community",
      },
    ],
  };

  // 6) “Remind yourself why you’re quitting”
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

  // 7) Three static help sections
  const additionalSections = [
    {
      title: "Get Help From Experts",
      text: "Talk to your doctor or call a quitline for medications or counseling.",
      image: expertHelp,
      bold: "I will:",
      list: [
        "Ask my doctor for quit‑support medications.",
        "Call my state’s quitline to talk with a counselor.",
      ],
      buttonText: "Contact coach",
    },
    {
      title: "Setbacks Are Part of the Process",
      text: "One slip doesn’t undo your progress—learn and recommit immediately.",
      image: setBack,
      bold: "Try these steps:",
      list: [
        "Reread your quit‑reasons.",
        "Identify what triggered the slip.",
        "Plan how to handle it next time.",
      ],
    },
  ];

  return (
    <FullPageLayout>
      <div className={styles.card}>
        {/* 2. SUMMARY CARDS */}
        <Row justify="center" gutter={[16, 16]} style={{ marginBottom: 32 }}>
          {summary.map((s, i) => (
            <Col key={i}>
              <Card
                style={{
                  textAlign: "center",
                  width: 160,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={s.icon}
                  alt={s.label}
                  style={{ width: 40, marginBottom: 8 }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  {s.value}
                </Title>
                <Text type="secondary">{s.label}</Text>
              </Card>
            </Col>
          ))}
        </Row>
        <Title level={3}>Your Personalized Plan</Title>
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
                <Title level={4}>{title}</Title>
                <Paragraph style={{ margin: 0 }}>{content}</Paragraph>
              </div>
            </div>
          ))}
        </div>

        {/* 5. SUPPORT CARDS */}
        <Title level={4} style={{ marginTop: 32 }}>
          Support & Tips
        </Title>
        <Row gutter={[24, 24]}>
          {planSupportMap[currentKey]?.map((card, idx) => (
            <Col key={idx} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className={styles.supportCard}
                cover={
                  <div className={styles.supportCover}>
                    <img alt={card.title} src={card.image} />
                  </div>
                }
                actions={[
                  <Button
                    block
                    onClick={() =>
                      card.buttonText === "Community"
                        ? navigate(ROUTES.BLOG_SERVICE)
                        : navigate(ROUTES.COACH_LIST)
                    }
                  >
                    {card.buttonText}
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={card.title}
                  description={
                    <>
                      <Text>{card.text}</Text>
                      <Paragraph>
                        <Text strong>{card.bold}</Text>
                      </Paragraph>
                      <ul className={styles.supportList}>
                        {card.list.map((li, i) => (
                          <li key={i}>
                            <Text>{li}</Text>
                          </li>
                        ))}
                      </ul>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 6. REMINDERS */}
        {selectedReasons.length > 0 && (
          <>
            <Title level={4} style={{ marginTop: 32 }}>
              Remind Yourself Why You Quit
            </Title>
            <Row gutter={[16, 16]}>
              {selectedReasons.map((r) => (
                <Col key={r} xs={12} sm={8} md={6} lg={4}>
                  <Card className={styles.remindCard} hoverable>
                    <Avatar src={REASON_CARDS[r].icon} size={64} />
                    <Text className={styles.remindText}>
                      {REASON_CARDS[r].label}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
        <Row justify="end" style={{ marginTop: 24 }}>
          <Button danger onClick={handleResetPlan}>
            Đặt lại kế hoạch
          </Button>
        </Row>
      </div>
    </FullPageLayout>
  );
}
function SupportCard({ card }) {
  const navigate = useNavigate();
  const { title, text, image, bold, list, buttonText } = card;
  return (
    <div className={styles.planCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{text}</p>
      {image && <img src={image} alt={title} className={styles.cardImage} />}
      {bold && <strong className={styles.boldText}>{bold}</strong>}
      {list && (
        <ul className={styles.cardList}>
          {list.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
      {buttonText && (
        <Button
          type="primary"
          onClick={() => {
            if (buttonText === "Contact coach") navigate(ROUTES.COACH_LIST);
            else if (buttonText === "Community") navigate(ROUTES.BLOG_SERVICE);
          }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
