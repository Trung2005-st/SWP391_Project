// src/Pages/community/FeedbackPage.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button, Input, notification } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";

// cấu hình notification giống ProfilePage
notification.config({
  placement: "topRight",
  duration: 5,
});

const EMOJIS = [
  { value: "1", icon: "😡", label: "Didn't meet expectations" },
  { value: "2", icon: "☹️", label: "Below expectations" },
  { value: "3", icon: "😐", label: "Met expectations" },
  { value: "4", icon: "🙂", label: "Above expectations" },
  { value: "5", icon: "😄", label: "Exceeded expectations" },
];

export default function FeedbackPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!selectedEmoji) {
      notification.warning({
        message: "Oops!",
        description: "Please choose a rating before submitting.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emoji: selectedEmoji,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      notification.success({
        message: "Thank you!",
        description: "Your feedback was sent successfully.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });

      navigate(ROUTES.FEEDBACK);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Could not submit feedback. Please try again.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });
    }
  };
  // /* 4. Dropdown menu community */
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };
  return (
    <div className={`${styles.fullPage} ${styles.feedbackPage}`}>
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
            Progress
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
                  Send Encouragement
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        {token ? (
          <div className={styles.groupBtn}>
            <NavLink to={ROUTES.PROFILE_PAGE}>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#52c41a",
                  color: "#fff",
                  marginRight: 16,
                }}
              />
            </NavLink>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("token");
                navigate(ROUTES.HOME);
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      {/* MAIN CONTENT */}
      <div className={styles.pageWrapper}>
        <div className={styles.twoColumn}>
          {/* SIDEBAR */}
          <div className={styles.card}>
            <nav className={styles.sidebar}>
              <ul>
                <NavLink to={ROUTES.PROFILE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <UserOutlined className={styles.icon} />
                    <span>Profile</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.BLOG_MANAGER}>
                  <li className={styles.sidebarItem}>
                    <EditOutlined className={styles.icon} />
                    <span>Blog manager</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.NOTIFICATION}>
                  <li className={styles.sidebarItem}>
                    <BellOutlined className={styles.icon} />
                    <span>Notification</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.ARCHIVE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <InboxOutlined className={styles.icon} />
                    <span>Archive</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.FEEDBACK}>
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* FEEDBACK FORM */}
          <div className={styles.card2}>
            <div className={styles.innerCard}>
              <h2 className={styles.pageTitle}>Rate your experience</h2>
              <p>
                Please take a moment to rate your experience with our service.
              </p>

              <div className={styles.emojiOptions}>
                {EMOJIS.map((e) => (
                  <div
                    key={e.value}
                    className={[
                      styles.emojiOption,
                      selectedEmoji === e.value ? styles.selectedEmoji : "",
                    ].join(" ")}
                    onClick={() => setSelectedEmoji(e.value)}
                  >
                    <span className={styles.emojiIcon}>{e.icon}</span>
                    <span className={styles.emojiLabel}>{e.label}</span>
                  </div>
                ))}
              </div>

              <Input.TextArea
                rows={4}
                placeholder="Tell us about your experience (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.feedbackTextarea}
              />

              <Button
                type="primary"
                size="large"
                block
                className={styles.submitFeedbackBtn}
                onClick={handleSubmit}
              >
                Submit feedback
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
