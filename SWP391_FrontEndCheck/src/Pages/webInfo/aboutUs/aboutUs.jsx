// src/Pages/about/AboutUs.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../webInfo/styleAfterProgress.module.css";
import swpLogo from "../../../../image/quit.png";
import missionImg from "../../../../image/icon-control.png";
import valuesIcon from "../../../../image/icon-future.png";
import storyImg from "../../../../image/icon-no-smoking.png";
import milestoneIcon from "../../../../image/icon-smell.png";
import featureIcon from "../../../../image/health.png";
import serviceIcon from "../../../../image/Lung.png";
import faqIcon from "../../../../image/icon-example.png";
import team1 from "../../../../image/maleDoctor.png";
import team2 from "../../../../image/people.png";
import team3 from "../../../../image/expertHelp.png";
import { ROUTES } from "../../../configs/routes";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function AboutUs() {
  const navigate = useNavigate();
  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };
  const team = [
    { id: 1, name: "Alice Nguyen", role: "Product Manager", photo: team1 },
    { id: 2, name: "Bob Tran", role: "Lead Developer", photo: team2 },
    { id: 3, name: "Carol Le", role: "UX/UI Designer", photo: team3 },
  ];

  const values = [
    "Empathy: We understand each journey is unique.",
    "Innovation: We leverage technology to provide new solutions.",
    "Community: Peer support fuels success.",
    "Integrity: Your privacy and trust matter most.",
  ];

  const milestones = [
    { year: "2022", event: "SWP founded by healthcare & tech experts." },
    { year: "2023", event: "Beta launch with 500+ early users." },
    { year: "2024", event: "Partnered with top hospitals." },
    { year: "2025", event: "10,000 active users globally." },
  ];

  const features = [
    "Daily quit-tracker with personalized insights",
    "Craving-management strategies",
    "Interactive peer community",
    "Savings & health progress reports",
  ];

  const services = [
    "One-on-one expert consultations",
    "Self-paced quitting courses",
    "Customizable reminders & notifications",
    "24/7 emergency chat support",
  ];

  const faqs = [
    {
      q: "How do I get started?",
      a: "Click ‘Get Started’ above, choose your plan, and follow the guided steps.",
    },
    {
      q: "Is my data private?",
      a: "Yes, we use strong encryption and never share your personal data.",
    },
    {
      q: "Can I talk to a doctor?",
      a: "Absolutely—book an online session with our healthcare partners.",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={swpLogo} alt="SWP Logo" className={styles.logoImg} />
          <span className={styles.logoText}>QuitHub</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to={ROUTES.HOME} className={styles.navItem}>
            Home
          </NavLink>
          <NavLink
            to={ROUTES.ABOUT}
            className={`${styles.navItem} ${styles.activeNav}`}
          >
            About Us
          </NavLink>
          <NavLink to={ROUTES.PLAN} className={styles.navItem}>
            Plan
          </NavLink>
          <NavLink to={ROUTES.COMMUNITY} className={styles.navItem}>
            Community
          </NavLink>
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

      {/* MAIN */}
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <section style={{ textAlign: "center", paddingBottom: 32 }}>
            <img
              src={swpLogo}
              alt="SWP Logo"
              style={{ width: 120, marginBottom: 16 }}
            />
            <h1 className={styles.title}>About QuitHub Platform</h1>
            <p className={styles.subtitle}>
              A comprehensive smoking-cessation support platform powered by
              technology, expert guidance, and community.
            </p>
          </section>

          {/* Grid of Cards */}
          <div className={styles.planSupportGrid}>
            {/* Our Story */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Our Story</h3>
              <div className={styles.cardBody}>
                <img
                  src={storyImg}
                  alt="Our Story"
                  className={styles.cardImage}
                />
                <p className={styles.cardText}>
                  Founded in 2022 by healthcare & tech experts, SWP blends
                  clinical insights with modern UX to guide every quit journey.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Our Mission</h3>
              <div className={styles.cardBody}>
                <img
                  src={missionImg}
                  alt="Mission"
                  className={styles.cardImage}
                />
                <p className={styles.cardText}>
                  Empower smokers worldwide to quit safely and sustainably
                  through innovation, compassion, and community.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Our Values</h3>
              <div className={styles.cardBody}>
                <img
                  src={valuesIcon}
                  alt="Values"
                  className={styles.cardImage}
                />
                <ul className={styles.cardList}>
                  {values.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestones */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Milestones</h3>
              <div className={styles.cardBody}>
                <img
                  src={milestoneIcon}
                  alt="Milestones"
                  className={styles.cardImage}
                />
                <ul className={styles.cardList}>
                  {milestones.map((m, i) => (
                    <li key={i}>
                      <strong>{m.year}:</strong> {m.event}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Platform Features */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Platform Features</h3>
              <div className={styles.cardBody}>
                <img
                  src={featureIcon}
                  alt="Features"
                  className={styles.cardImage}
                />
                <ul className={styles.cardList}>
                  {features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services We Offer */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>Services We Offer</h3>
              <div className={styles.cardBody}>
                <img
                  src={serviceIcon}
                  alt="Services"
                  className={styles.cardImage}
                />
                <ul className={styles.cardList}>
                  {services.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Meet the Team */}
            <div
              className={styles.planCard}
              style={{ flexDirection: "column" }}
            >
              <h3 className={styles.cardTitle}>Meet the Team</h3>
              <div className={styles.planSupportGrid}>
                {team.map((m) => (
                  <div
                    key={m.id}
                    className={styles.planCard}
                    style={{ textAlign: "center" }}
                  >
                    <img
                      src={m.photo}
                      alt={m.name}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: "0 auto",
                      }}
                    />
                    <p
                      className={styles.cardText}
                      style={{ fontWeight: 600, marginTop: 8 }}
                    >
                      {m.name}
                    </p>
                    <p className={styles.cardText} style={{ color: "#6b7280" }}>
                      {m.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className={styles.planCard}>
              <h3 className={styles.cardTitle}>FAQ</h3>
              <div className={styles.cardBody}>
                <img src={faqIcon} alt="FAQ" className={styles.cardImage} />
                <div className={styles.cardContent}>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <p
                        className={styles.cardText}
                        style={{ fontWeight: 600 }}
                      >
                        Q: {faq.q}
                      </p>
                      <p className={styles.cardText}>A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <section style={{ textAlign: "center", marginTop: 32 }}>
            <button
              className={`${styles.nextBtn} ${styles.fullBtn}`}
              onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
            >
              Join Us Today
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
