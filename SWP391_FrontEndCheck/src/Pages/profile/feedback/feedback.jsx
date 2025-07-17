// src/Pages/community/FeedbackPage.jsx

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Button, notification } from "antd";
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
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import { ROUTES } from "../../../configs/routes";

// cấu hình chung cho notification
notification.config({ placement: "topRight", duration: 5 });

// mảng emoji đã định nghĩa
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

  const [feedbackList, setFeedbackList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const avatars = [avatar1, avatar2];

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFeedbackList(
          res.data.map((f, i) => ({
            id: f.id,
            name: f.userName,
            date: new Date(f.sentAt).toLocaleDateString("en-GB"),
            avatar: avatars[i % avatars.length],
            emoji: f.emoji, // f.emoji là "1".."5"
            text: f.message,
          }))
        );
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Could not load feedback.",
          style: { width: 360 },
        });
      });
  }, [token]);

  const handleLoadMore = () => setVisibleCount((v) => v + 4);
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
          <img src={logoImg} className={styles.logoImg} alt="QuitHub" />
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

          {/* FEEDBACK LIST */}
          <div className={styles.card2}>
            <h2 className={styles.pageTitle}>Feedback</h2>
            <div className={styles.feedbackList}>
              {feedbackList.slice(0, visibleCount).map((item) => {
                // tìm emoji tương ứng
                const em = EMOJIS.find((e) => e.value === String(item.emoji));
                return (
                  <div key={item.id} className={styles.feedbackItem}>
                    <div className={styles.feedbackHeader}>
                      <Avatar src={item.avatar} size={64} />
                      <div className={styles.feedbackMeta}>
                        <p className={styles.feedbackName}>{item.name}</p>
                        <p className={styles.feedbackDate}>{item.date}</p>
                      </div>
                      <div className={styles.feedbackEmoji}>
                        {em ? em.icon : "❓"}
                      </div>
                    </div>
                    <div className={styles.feedbackText}>{item.text}</div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER: Load more + Submit */}
            <div className={styles.feedbackFooter}>
              {visibleCount < feedbackList.length && (
                <Button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                  Load more
                </Button>
              )}

              <NavLink to={ROUTES.FEEDBACK_FORM}>
                <Button className={styles.submitFeedbackBtn} size="large">
                  Submit new feedback
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
