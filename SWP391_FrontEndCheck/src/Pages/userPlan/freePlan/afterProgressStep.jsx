// src/Pages/userPlan/freePlan/AfterProgressPlan.jsx
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

export default function AfterProgressPlan() {
  const navigate = useNavigate();

  const [showCommunityMenu, setShowCommunityMenu] = useState(false);

  const toggleCommunityMenu = (e) => {
    e.preventDefault(); // ngăn NavLink navigate ngay lập tức
    setShowCommunityMenu((prev) => !prev);
  };
  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  const REASON_CARDS = {
    health: {
      icon: healthIcon,
      label: "It is affecting my health",
    },
    family: {
      icon: familyIcon,
      label: "For my family or friends",
    },
    doctor: {
      icon: doctorIcon,
      label: "My doctor recommended",
    },
    money: {
      icon: moneyIcon,
      label: "To save money",
    },
    example: {
      icon: exampleIcon,
      label: "To set a good example",
    },
    future: {
      icon: futureIcon,
      label: "To have a better future",
    },
    control: {
      icon: controlIcon,
      label: "To take back control",
    },
    environment: {
      icon: envIcon,
      label: "For the environment",
    },
    smell: {
      icon: smellIcon,
      label: "To look and smell better",
    },
    pets: {
      icon: petsIcon,
      label: "For my pets",
    },
    restricted: {
      icon: noSmokingIcon,
      label: "Increasingly restricted in public spaces",
    },
    baby: {
      icon: babyIcon,
      label: "Baby on the way",
    },
  };

  // 1) Get baseline & user selections
  const {
    cigarettesPerDay,
    packCost,
    selectedReasons,
    selectedTriggers,
    selectedStrategies,
  } = useContext(ProgressContext);

  // 2) Combine all selected keys
  const allSelections = useMemo(() => {
    const vals = [...selectedReasons];
    selectedTriggers.forEach((t) => {
      const v = t.includes("--") ? t.split("--")[1] : t;
      vals.push(v);
    });
    selectedStrategies.forEach((s) => {
      const v = s.includes("--") ? s.split("--")[1] : s;
      vals.push(v);
    });
    return vals;
  }, [selectedReasons, selectedTriggers, selectedStrategies]);

  // 3) If no plan yet
  if (allSelections.length === 0) {
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
            <NavLink
              to={ROUTES.PLAN}
              className={`${styles.navItem} ${styles.activeNav}`}
            >
              Plan
            </NavLink>
            <NavLink to={ROUTES.COMMUNITY} className={styles.navItem}>
              Community
            </NavLink>
          </nav>
          <Button className={styles.startBtn}>Get Started</Button>
        </header>
        <div className={styles.pageWrapper}>
          <div
            className={styles.card}
            style={{
              textAlign: "center",
              padding: "50px",
              height: "620px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1f2041",
                  marginBottom: "16px",
                }}
              >
                OOPS you don't have any plan yet!
              </h2>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "1rem",
                  color: "#6f6090",
                  marginBottom: "32px",
                }}
              >
                Create a plan?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <Button
                  onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "24px",
                    padding: "8px 20px",
                  }}
                >
                  OK
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.HOME)}
                  style={{
                    background: "transparent",
                    color: "#16a34a",
                    border: "2px solid #16a34a",
                    borderRadius: "24px",
                    padding: "8px 20px",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4) Plan & Support cards per trigger key (with CTA)
  const planSupportMap = {
    emotional: [
      {
        title: "Plan for Your Cravings",
        text: `Cravings are temporary and will fade over time the longer you stay quit. When a craving hits, find something else to do instead of smoking—this will pass. The important thing is to keep trying different things until you find what works for you.`,
        image: cravingImg,
        bold: "Try these ways to handle stress and emotions:",
        list: [
          "Drink a glass of water.",
          "Getting some exercise.",
          "Playing games on my phone or listening to a podcast.",
        ],
        buttonText: "View details",
      },
      {
        title: "Build Your Support Team",
        text: `Surrounding yourself with positive support can make it easier to quit. Reach out to the supporters you’ve chosen to talk when you’re quitting and would like their help.`,
        image: supportTeam,
        bold: "Try these ways to reach out for support:",
        list: [
          "Share my plans to quit with people important to me.",
          "Connect on social media with other people who are quitting.",
          "Reach out for professional counseling or a quitline.",
        ],
        buttonText: "Community",
      },
    ],
    routine: [
      {
        title: "Change Your Daily Routine",
        text: `Many smoke breaks are tied to routines. Changing those small habits can weaken cravings over time.`,
        image: cravingImg,
        bold: "Try these ways to shift your routine:",
        list: [
          "Swap your morning coffee-&-cigarette combo for tea or water.",
          "After meals, chew sugar-free gum instead of smoking.",
          "Set an alarm for a short stretch or walk break.",
        ],
        buttonText: "View details",
      },
      {
        title: "Build Positive Habits",
        text: `Filling your day with new, healthy rituals helps replace old smoking cues.`,
        image: supportTeam,
        bold: "Try these ways to build new habits:",
        list: [
          "Schedule a brief walk or puzzle after lunch.",
          "Keep a stress ball at your desk.",
          "Treat yourself to a healthy snack on smoke-free days.",
        ],
        buttonText: "Community",
      },
    ],
    environment: [
      {
        title: "Manage Your Environment",
        text: `External cues—like ashtrays or smoky rooms—can trigger cravings even when you’re calm. Modify your surroundings to remove those cues.`,
        image: cravingImg,
        bold: "Try these ways to clear your space:",
        list: [
          "Remove ashtrays, lighters, and cigarettes from home and car.",
          "Open windows or use an air purifier to clear smells.",
          "Decorate with plants or fresh colors for a clean vibe.",
        ],
        buttonText: "View details",
      },
      {
        title: "Create a Smoke-Free Zone",
        text: `A dedicated smoke-free zone sends a clear signal to yourself and others that you’re serious about quitting.`,
        image: supportTeam,
        bold: "Try these ways to enforce your zone:",
        list: [
          "Ask household members not to smoke indoors.",
          "Carry gum or mints when entering smoky venues.",
          "Choose smoke-free cafés or parks for breaks.",
        ],
        buttonText: "Community",
      },
    ],
    social: [
      {
        title: "Plan for Social Settings",
        text: `Parties, peer pressure, and drinks can all lead to an unplanned smoke. A little planning goes a long way.`,
        image: cravingImg,
        bold: "Try these ways to handle social cues:",
        list: [
          "Alternate alcoholic drinks with water or soda.",
          "Bring your own non-alcoholic beverage.",
          "Have a go-to conversation topic instead of accepting offers.",
        ],
        buttonText: "View details",
      },
      {
        title: "Enlist Your Friends",
        text: `An accountability partner or group makes it easier to resist when everyone else is smoking.`,
        image: supportTeam,
        bold: "Try these ways to build support:",
        list: [
          "Let friends know your quit date and ask for their backup.",
          "Invite a quit buddy to join you at events.",
          "Join a quit-smoking group online or in person.",
        ],
        buttonText: "Community",
      },
    ],
  };

  // 5) Three static sections after the dynamic cards
  const additionalSections = [
    {
      title: "Get Help From Experts",
      text: `Getting quit support from an expert, like a health care professional or trained quit counselor, can increase your chances of success. Ask how they might be able to help you quit.`,
      image: expertHelp,
      bold: "I will:",
      list: [
        `Talk to my doctor, pharmacist, or other health care professional about how to quit smoking. Ask how they can help you manage your nicotine withdrawal symptoms or other quitting concerns, and see if nicotine replacement therapy (NRT) or another quit medication is right for you.`,
        `Call a quitline to talk one-on-one with a trained counselor to help me quit. Check with your insurance plan, local community centers or hospitals, or your state's quitline.`,
      ],
      buttonText: "Contact coach",
    },
    {
      title: "Remember Setbacks Are Part of the Process",
      text: `If you slip up and smoke, don’t think of it as failure. Remind yourself that you’ve had a temporary setback. The important thing is that you move forward to start quitting again.`,
      image: setBack,
      bold: "Try these steps:",
      list: [
        "Reread your reasons for quitting.",
        "Be proud of yourself for all the times you didn’t smoke.",
        "Think about what caused you to smoke and come up with a plan for how you would handle it differently next time.",
      ],
      // no buttonText here
    },
  ];

  // 6) Trigger categories & descriptions
  const categoryMap = {
    emotional: {
      name: "Emotional triggers",
      description: `My Emotional Triggers: angry; anxious, worried, or nervous; frustrated or upset; lonely; stressed or overwhelmed.

Many people make smoking a way to enjoy a good mood or escape a bad one. Smoking is not a healthy way to cope with feelings. If you are stressed or anxious, whatever is causing it will still be there after you smoke.

Try these ways to handle stress and emotions:
 • Take a break. Sometimes all you need is a "time out" from an upsetting or stressful situation in order to calm down. Go for a walk, listen to music, or find a quiet spot to take slow, deep breaths.
 • Get your body moving—it can keep boredom at bay and is a great way to handle both negative and positive emotions. Dance, play a sport, or follow an online workout.
 • Reach out to people who care about you to celebrate successes and lift you up when you’re feeling down.
 • Watch for signs of depression, which can be serious and may require professional help.`,
      keys: [
        "angry", // Angry
        "anxious", // Anxious, worried, or nervous
        "bored", // Bored
        "frustrated", // Frustrated or upset
        "happy", // Happy or excited
        "lonely", // Lonely
        "sad", // Sad, down, or depressed
        "stressed", // Stressed or overwhelmed
      ],
    },
    routine: {
      name: "Routine triggers",
      description: `My Routine Triggers: morning coffee; after-meal habit; work or study breaks; TV time; phone scrolling; downtime.

Daily routines often become automatic signals to smoke. Changing these habits can weaken the urge.

Try these ways to change your routine:
 • Swap your coffee-and-cigarette combo for tea, water, or a fruit smoothie in the morning.
 • After meals, go for a brisk walk, chew sugar-free gum, or practice deep breathing.
 • During work or study breaks, stretch, grab a healthy snack, or chat with a friend instead of smoking.
 • Replace TV or phone time with a short hobby: read an article, doodle, or solve a puzzle.
 • Keep your hands busy with a stress ball, knitting, or a small craft.`,
      keys: [
        "phone", // Being on my phone
        "downtime", // Down time or in between activities
        "coffee", // Drinking coffee
        "afterMeal", // Finishing a meal
        "tv", // Seeing cigarettes on TV or in movies
        "commute", // Waiting for the bus or a ride
        "drive", // Walking or driving
        "gaming", // Watching TV or playing video games
        "study", // Working or studying
      ],
    },
    environment: {
      name: "Environmental triggers",
      description: `My Environmental Triggers: smell of smoke; seeing ashtrays; smoky rooms; certain locations like bars or outdoor smoking areas.

External cues in your surroundings can spark cravings even when you’re not stressed.

Try these ways to manage environmental cues:
 • Avoid places where others are smoking or step away to a smoke-free zone.
 • Remove ashtrays, lighters, and any smoking items from your home and car.
 • Air out rooms, use air purifiers, or open windows to reduce lingering smells.
 • When entering a smoky venue, bring mints or chew gum to distract from the odor.
 • Decorate your spaces with plants or fresh colors to create a cleaner atmosphere.`,
      keys: [
        "seeingSmoke",
        "smellingSmoke",
        "aroundSmokers",
        "ashtraySight",
        "smokyRoom",
        "barOrClub",
        "carInterior",
        "publicPark",
        "officeArea",
        "poorAirQuality",
        "irritable",
        "restless",
        "cravings",
        "concentrate",
      ],
    },
    social: {
      name: "Social triggers",
      description: `My Social Triggers: friends offering cigarettes; drinking alcohol; parties; commuting with smokers; social gatherings.

Social interactions can make you feel pressured to smoke to fit in or relax.

Try these ways to handle social cues:
 • Let friends know you’re quitting—ask them not to offer or smoke near you.
 • At events with alcohol, alternate alcoholic drinks with water or nonalcoholic beverages.
 • Carry mints or sugar-free gum to use when offered a cigarette.
 • Suggest group activities that don’t involve smoking: board games, sports, or outdoor picnics.
 • Plan meetups in smoke-free places like cafés or parks instead of bars.`,
      keys: [
        "offered", // Being offered a cigarette
        "drinking", // Drinking alcohol or going to a bar
        "party", // Going to a party or other social event
        "aroundSmokers", // Being around others who smoke or use another tobacco product
        "seeingSmoke", // Seeing someone else smoke
        "smellingSmoke", // Smelling cigarette smoke
        "irritable", // Feeling irritable if I haven't smoked in a while
        "restless", // Feeling restless or jumpy
        "cravings", // Feeling strong cravings to smoke
        "concentrate", // Having a hard time concentrating
      ],
    },
  };

  // 7) Count & percent
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
    return Object.entries(counts).map(([key, cnt]) => ({
      key,
      name: categoryMap[key].name,
      description: categoryMap[key].description,
      value: Math.round((cnt / total) * 100),
    }));
  }, [allSelections]);

  // 8) Sort for info panel
  const sortedTriggers = useMemo(
    () =>
      [...triggersData].sort(
        (a, b) => b.value - a.value || a.key.localeCompare(b.key)
      ),
    [triggersData]
  );

  // 9) Daily checklist
  const [dailyStrategies, setDailyStrategies] = useState([]);
  const toggleItem = (g, v) => {
    const key = `${g}--${v}`;
    setDailyStrategies((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };
  const groups = [
    {
      key: "dailyActions",
      title: "Daily action checklist",
      items: [
        { value: "avoidSmoking", label: "Did you avoid smoking today?" },
        {
          value: "disposedItems",
          label: "Disposed of all cigarettes, lighters, ashtrays, matches",
        },
        {
          value: "cleanedAreas",
          label: "Cleaned areas with smoke smell: home, car, bag...",
        },
        {
          value: "unfollowedMedia",
          label: "Unfollowed social media/movies with smoking scenes",
        },
        {
          value: "practicedNo",
          label: `Practiced saying "No, thank you" when offered a cigarette`,
        },
        {
          value: "avoidedTemptation",
          label: "Avoided cafes/karaoke to reduce temptation",
        },
        {
          value: "rewardedYourself",
          label: "Rewarded yourself with a small gift for staying smoke-free",
        },
        {
          value: "changedHabits",
          label:
            "Changed habits that often lead to smoking (e.g. coffee breaks)",
        },
        {
          value: "sharedJourney",
          label: "Shared your journey with an online support group",
        },
        {
          value: "learnedNicotine",
          label:
            "Learned more about nicotine and asked a doctor about medications",
        },
        { value: "viewBlog", label: "View a blog in community" },
      ],
    },
  ];

  // 10) Summary cards
  const summary = [
    {
      label: "Total cigarettes avoid",
      value: "25 cigarettes",
      trend: "4.3% ↑",
      icon: iconCigarette,
    },
    { label: "Total saving", value: "25$", trend: "1.2% ↑", icon: iconSaving },
    {
      label: "Total non-smoking day",
      value: "23 days",
      trend: "8.1% ↑",
      icon: iconCalendar,
    },
    { label: "Total quitting day", value: "30 days", icon: iconCelebration },
  ];

  // 11) Report & savings
  const [report, setReport] = useState({ times: "", smoked: "", mood: "" });
  const [reduction, setReduction] = useState(0);
  const [savedMoney, setSavedMoney] = useState(0);
  const handleReportChange = (e) =>
    setReport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const submitReport = (e) => {
    e.preventDefault();
    const smoked = Number(report.times) || 0;
    const diff = cigarettesPerDay - smoked;
    setReduction(diff > 0 ? diff : 0);
    setSavedMoney(diff > 0 ? diff * packCost : 0);
  };

  // 12) Chart & legend
  const colors = ["#00D1A1", "#FAC64B", "#003F5C", "#0088FE"];
  const [activeIndex, setActiveIndex] = useState(0);
  const currentKey = sortedTriggers[activeIndex].key;

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

      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <main className={styles.main}>
            {/* SUMMARY CARDS */}
            <div className={styles.summaryGrid}>
              {summary.map((s, i) => (
                <div key={i} className={styles.summaryCard}>
                  <img
                    src={s.icon}
                    alt={s.label}
                    className={styles.summaryIcon}
                  />
                  <h3 className={styles.summaryValue}>{s.value}</h3>
                  <p className={styles.summaryLabel}>{s.label}</p>
                  <small className={styles.summaryTrend}>{s.trend}</small>
                </div>
              ))}
            </div>

            {/* CHECKLIST & RIGHT COLUMN */}
            <div className={styles.dualPanel}>
              <div className={styles.checklistPanel}>
                <h2 className={styles.panelTitle}>{groups[0].title}</h2>
                <ul className={styles.checklistList}>
                  {groups[0].items.map((item) => {
                    const key = `${groups[0].key}--${item.value}`;
                    const isSel = dailyStrategies.includes(key);
                    return (
                      <li
                        key={key}
                        onClick={() => toggleItem(groups[0].key, item.value)}
                      >
                        <input
                          type="checkbox"
                          checked={isSel}
                          readOnly
                          className={styles.checkboxInput}
                        />
                        <span
                          className={`${styles.customCheckbox} ${
                            isSel ? styles.checked : ""
                          }`}
                        />
                        <span className={styles.checklistLabel}>
                          {item.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={styles.reportColumn}>
                <div className={styles.reportPanelWrapper}>
                  <form className={styles.reportPanel} onSubmit={submitReport}>
                    <h2 className={styles.panelTitle}>Daily report</h2>

                    <label className={styles.inputGroup}>
                      <span className={styles.inputLabel}>
                        How many cigars you smoke today ?
                      </span>
                      <input
                        type="number"
                        name="times"
                        value={report.times}
                        onChange={handleReportChange}
                        placeholder="10"
                        className={styles.inputField}
                      />
                    </label>

                    <label className={styles.inputGroup}>
                      <span className={styles.inputLabel}>
                        Why did you smoke ?
                      </span>
                      <input
                        name="smoked"
                        value={report.smoked}
                        onChange={handleReportChange}
                        placeholder="I feel so stress"
                        className={styles.inputField}
                      />
                    </label>

                    <label className={styles.inputGroup}>
                      <span className={styles.inputLabel}>
                        How do you feel about today checklist ?
                      </span>
                      <input
                        name="mood"
                        value={report.mood}
                        onChange={handleReportChange}
                        placeholder="hard"
                        className={styles.inputField}
                      />
                    </label>

                    <button type="submit" className={styles.submitBtn}>
                      submit
                    </button>
                  </form>

                  <div className={styles.reportPanel}>
                    <h2 className={styles.panelTitle}>Keep in mind</h2>
                    <p className={styles.remindText}>
                      Today, you made an important decision: to start your quit
                      smoking journey! Stay committed, patient, and disciplined
                      every day.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC TRIGGERS CHART */}
            <section className={styles.triggersSection}>
              <div className={styles.chartContainer}>
                <PieChart width={400} height={400}>
                  <Pie
                    data={triggersData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                    onClick={(_, idx) => setActiveIndex(idx)}
                  >
                    {triggersData.map((_, idx) => (
                      <Cell key={idx} fill={colors[idx]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className={styles.legend}>
                  {triggersData.map((d, i) => (
                    <div key={d.key} className={styles.legendItem}>
                      <span
                        className={styles.legendColorBox}
                        style={{ backgroundColor: colors[i] }}
                      />
                      <span className={styles.legendLabel}>
                        {d.name} — {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.infoPanel}>
                <h1 className={styles.infoTitle}>Understand your triggers</h1>
                <h2 className={styles.infoTitle}>
                  {sortedTriggers[activeIndex].name}
                </h2>
                <p className={styles.infoContent}>
                  {sortedTriggers[activeIndex].description}
                </p>
                <div className={styles.arrowButtons}>
                  <button
                    className={styles.arrowBtn}
                    onClick={() =>
                      setActiveIndex(
                        (activeIndex + sortedTriggers.length - 1) %
                          sortedTriggers.length
                      )
                    }
                  >
                    &lt;
                  </button>
                  <button
                    className={styles.arrowBtn}
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % sortedTriggers.length)
                    }
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </section>

            {/* DYNAMIC PLAN/SUPPORT CARDS */}
            <section className={styles.planSupportSection}>
              <div className={styles.planSupportGrid}>
                {planSupportMap[currentKey].map((card, idx) => (
                  <SupportCard key={idx} card={card} />
                ))}
              </div>
            </section>

            {/* ——— Remind Yourself Why You Want to Quit ——— */}
            {selectedReasons.length > 0 && (
              <section className={styles.planSupportSection}>
                <div className={styles.planSupportGrid}>
                  <div className={styles.planCard}>
                    <h2 className={styles.cardTitle}>
                      Remind Yourself Why You Want to Quit
                    </h2>
                    <p className={styles.cardText}>
                      When quitting feels tough, think back on these reasons why
                      quitting smoking is important to you.
                    </p>
                    <div className={styles.remindGrid}>
                      {selectedReasons.map((reasonKey) => {
                        const rc = REASON_CARDS[reasonKey];
                        if (!rc) return null;
                        return (
                          <div key={reasonKey} className={styles.remindCard}>
                            <img
                              src={rc.icon}
                              alt={rc.label}
                              className={styles.remindImage}
                            />
                            <p className={styles.remindLabel}>{rc.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* THREE NEW STATIC SECTIONS */}
            {additionalSections.map((card, i) => (
              <section key={i} className={styles.planSupportSection}>
                <div className={styles.planSupportGrid}>
                  <SupportCard card={card} />
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ card }) {
  const navigate = useNavigate(); // call hook
  const { title, text, image, bold, list, buttonText } = card;
  return (
    <div className={styles.planCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{text}</p>

      <div className={styles.cardBody}>
        <img src={image} alt={title} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <div className={`${styles.cardText} ${styles.boldText}`}>{bold}</div>
          <ul className={styles.cardList}>
            {list.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>

          {/* CTA button under the list */}
          {buttonText && (
            <button
              className={`${styles.nextBtn} ${styles.smallBtn1}`}
              onClick={() => {
                if (buttonText === "Contact coach") {
                  navigate(ROUTES.COACH_LIST); // 3) perform navigation
                }
                if (buttonText === "Community") {
                  navigate(ROUTES.BLOG_SERVICE);
                }
              }}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
