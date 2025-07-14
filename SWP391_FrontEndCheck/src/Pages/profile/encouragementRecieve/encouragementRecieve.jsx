import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import styles from "../styleBlogManager.module.css"; // giữ nguyên file CSS đầu
import logoImg from "../../../../image/quit.png";
// reuse các template background
import enc1 from "../../../../image/encouragement1.png";
import enc2 from "../../../../image/encouragement2.jpg";
import enc3 from "../../../../image/encouragement3.jpg";
import enc4 from "../../../../image/encouragement4.jpg";

import { ROUTES } from "../../../configs/routes";

export default function ArchivePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // giả lập dữ liệu đã send
  const [archiveList, setArchiveList] = useState([
    {
      id: 1,
      name: "Minh Anh",
      days: 156,
      text: `Just stopping by to say YOU’RE CRUSHING IT! 156 smoke-free days. That’s superhero-level stuff.\nSending big encouragement and bigger hugs 💪💚`,
      tpl: 1,
    },
    {
      id: 2,
      name: "Minh Anh",
      days: 156,
      text: `Just stopping by to say YOU’RE CRUSHING IT! 156 smoke-free days. That’s superhero-level stuff.\nSending big encouragement and bigger hugs 💪💚`,
      tpl: 2,
    },
    {
      id: 3,
      name: "Minh Anh",
      days: 156,
      text: `Just stopping by to say YOU’RE CRUSHING IT! 156 smoke-free days. That’s superhero-level stuff.\nSending big encouragement and bigger hugs 💪💚`,
      tpl: 3,
    },
    {
      id: 4,
      name: "Minh Anh",
      days: 156,
      text: `Just stopping by to say YOU’RE CRUSHING IT! 156 smoke-free days. That’s superhero-level stuff.\nSending big encouragement and bigger hugs 💪💚`,
      tpl: 4,
    },
  ]);

  // chỉ show 4 bản ghi, ví dụ
  // const [visibleCount, setVisibleCount] = useState(4);

  const patterns = [null, enc1, enc2, enc3, enc4];
  // /* 4. Dropdown menu community */
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };
  return (
    <div className={styles.fullPage}>
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

      {/* LAYOUT 2 CỘT */}
      <div className={styles.pageWrapper}>
        <div className={styles.twoColumn}>
          {/* CỘT TRÁI */}
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
                <li className={styles.sidebarItem}>
                  <BellOutlined className={styles.icon} />
                  <span>Notification</span>
                </li>
                <NavLink to={ROUTES.ARCHIVE_PAGE}>
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
                    <InboxOutlined className={styles.icon} />
                    <span>Archive</span>
                  </li>
                </NavLink>
                <li className={styles.sidebarItem}>
                  <MessageOutlined className={styles.icon} />
                  <span>Feedback</span>
                </li>
              </ul>
            </nav>
          </div>

          {/* phải: Archive list */}
          <div className={styles.card2}>
            <h2 className={styles.pageTitle}>Archive</h2>

            <div className={styles.archiveList}>
              {archiveList.map((item) => (
                <div
                  key={item.id}
                  className={styles.archiveItem}
                  style={{
                    backgroundImage: `url(${patterns[item.tpl]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className={styles.archiveContent}>
                    <p>
                      Hi {item.name} ✨<br />
                      {item.text.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.loadMore}>Load more message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
