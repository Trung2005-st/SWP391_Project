import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import DOMPurify from "dompurify";

import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";

// encouragement templates
import enc1 from "../../../../image/encouragement1.png";
import enc2 from "../../../../image/encouragement2.jpg";
import enc3 from "../../../../image/encouragement3.jpg";
import enc4 from "../../../../image/encouragement4.jpg";
import enc5 from "../../../../image/encouragement5.png";
import enc6 from "../../../../image/encouragement6.png";
import enc7 from "../../../../image/encouragement7.png";

// avatars for detail overlay
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import avatar3 from "../../../../image/avt3.png";

const patterns = {
  1: enc1,
  2: enc2,
  3: enc3,
  4: enc4,
  5: enc5,
  6: enc6,
  7: enc7,
};
const avatars = [avatar1, avatar2, avatar3];

export default function ArchivePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // /* 4. Dropdown menu community */
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };
  // 1️⃣ Demo data
  const demoData = [
    {
      id: 1,
      name: "Minh Anh",
      tpl: 1,
      text: `Just stopping by to say YOU’RE CRUSHING IT! 156 smoke-free days. That’s superhero-level stuff.\nSending big encouragement and bigger hugs 💪💚`,
      sendAt: "2025-07-10T08:30:00Z",
    },
    {
      id: 2,
      name: "Minh Anh",
      tpl: 2,
      text: `Keep going strong!`,
      sendAt: "2025-07-11T14:45:00Z",
    },
    {
      id: 3,
      name: "Minh Anh",
      tpl: 3,
      text: `<b>Bold move!</b>`,
      sendAt: "2025-07-12T09:20:00Z",
    },
    {
      id: 4,
      name: "Minh Anh",
      tpl: 4,
      text: `<ul><li>Item 1</li><li>Item 2</li></ul>`,
      sendAt: "2025-07-13T16:00:00Z",
    },
  ];

  // 2️⃣ State
  const [archiveList, setArchiveList] = useState(demoData);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar1);

  // 3️⃣ Helper for API‐provided templatePath
  const getBgUrl = (path) =>
    path ? `url(${path.startsWith("/") ? path.slice(1) : path})` : "";

  // 4️⃣ Fetch from backend
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/encouragements/received", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const apiCards = data.map((it) => ({
          id: it.encouragementID,
          name: `${it.sender?.firstName || ""} ${it.sender?.lastName || ""}`.trim(),
          tpl: null,
          templatePath: it.template || "",
          text: it.message || "",
          sendAt: it.sentAt || "2025-07-10T08:30:00Z",
        }));
        setArchiveList([...demoData, ...apiCards]);
      })
      .catch(() => setArchiveList(demoData));
  }, [token]);

  // 5️⃣ Handlers
  const handleSelect = (item) => {
    const rand = Math.floor(Math.random() * avatars.length);
    setSelectedAvatar(avatars[rand]);
    setSelectedId(item.id);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setSelectedId(null);
  };

  // 6️⃣ Date formatting
  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB");

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

      {/* LAYOUT */}
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
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
                    <InboxOutlined className={styles.icon} />
                    <span>Archive</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.FEEDBACK}>
                  <li className={styles.sidebarItem}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* ARCHIVE LIST */}
          <div className={styles.card2}>
            <h2 className={styles.pageTitle}>Archive</h2>
            <div className={styles.archiveList}>
              {archiveList.map((item) => {
                const isSel = selectedId === item.id;
                const bgStyle =
                  item.tpl && patterns[item.tpl]
                    ? { backgroundImage: `url(${patterns[item.tpl]})` }
                    : item.templatePath
                      ? { backgroundImage: getBgUrl(item.templatePath) }
                      : {};

                // combine classes
                const wrapperCls = [
                  styles.archiveItem,
                  isSel && styles.selected,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={item.id}
                    className={wrapperCls}
                    onClick={() => handleSelect(item)}
                    style={{
                      ...bgStyle,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    {/* DETAIL CARD */}
                    {isSel && (
                      <div className={styles.detailCard}>
                        <Avatar src={selectedAvatar} size={48} />
                        <div className={styles.detailText}>
                          <p className={styles.detailName}>Hi {item.name}</p>
                          <p className={styles.detailDate}>
                            {formatDate(item.sendAt)}
                          </p>
                        </div>
                        <CloseOutlined
                          onClick={handleClose}
                          className={styles.detailClose}
                        />
                      </div>
                    )}

                    {/* BUBBLE CONTENT */}
                    <div className={styles.archiveContent}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.text).replace(
                            /\n/g,
                            "<br/>"
                          ),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className={styles.loadMore}>Load more message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
