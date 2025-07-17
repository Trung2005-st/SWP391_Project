// src/Pages/notification/NotificationPage.jsx

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Input, Tag, Button, Card } from "antd";
import {
  UserOutlined,
  BellOutlined,
  InboxOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import api from "../../../configs/axios";
import { ROUTES } from "../../../configs/routes";
import { LogoutOutlined } from "@ant-design/icons/lib/icons";

const ROLE_LABEL = {
  ALL: "All",
  MEMBER: "Member",
  COACH: "Coach",
  ADMIN: "Admin",
};
const ROLE_COLOR = {
  ALL: "#e9eef6",
  MEMBER: "#e6f9ea",
  COACH: "#fff7e6",
  ADMIN: "#fdeaea",
};

export default function NotificationPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const avatars = [avatar1, avatar2];

  // Lấy user hiện tại
  useEffect(() => {
    if (!token) return navigate(ROUTES.HOME);
    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate(ROUTES.HOME));
  }, [token, navigate]);

  // Lấy ds notification phù hợp role
  useEffect(() => {
    if (!user) return;
    api.get("/notification").then((res) => {
      const list = res.data.map((n, i) => ({
        ...n,
        from: n.sender || "Admin",
        date: n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-GB") : "",
        avatar: avatars[i % avatars.length],
        role: n.targetRole || "ALL",
        message: n.message,
      }));
      let filtered = [];
      if (user.role === "ADMIN") filtered = list;
      else
        filtered = list.filter((n) => n.role === "ALL" || n.role === user.role);
      setNotifications(filtered);
    });
  }, [user]);

  const displayList = notifications.filter(
    (item) =>
      item.from.toLowerCase().includes(search.toLowerCase()) ||
      (item.message || "").toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý click notification để xem detail
  const handleShowDetail = (item) => setDetail(item);
  const handleCloseDetail = () => setDetail(null);
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

      {/* CONTENT */}
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
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
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
                  <li className={styles.sidebarItem}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* CARD DANH SÁCH NOTIFICATION */}
          <div className={styles.card2} style={{ minHeight: 560 }}>
            <div className={styles.profileHeader}>
              <h2 className={styles.profileTitle}>Notifications</h2>
            </div>
            <div>
              <Input
                placeholder="Search notification..."
                className={styles.formInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 16, maxWidth: 340 }}
                prefix={<BellOutlined />}
                allowClear
              />
            </div>
            {/* DANH SÁCH NOTIFICATION */}
            <div className={styles.archiveList}>
              {displayList.length === 0 && (
                <div style={{ textAlign: "center", color: "#888" }}>
                  No notifications found.
                </div>
              )}
              {displayList.map((item, i) => (
                <div
                  className={styles.archiveItem}
                  key={item.id}
                  style={{
                    background: "#f7fbfe",
                    boxShadow: "0 1px 4px 0 rgba(31,32,65,0.07)",
                    cursor: "pointer",
                    padding: "22px 24px 10px 24px",
                  }}
                  onClick={() => handleShowDetail(item)}
                >
                  {/* HÀNG 1: avatar - sender/date - badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <Avatar
                        src={item.avatar}
                        size={52}
                        style={{
                          border: "2.5px solid #16a34a",
                          boxShadow: "0 2px 8px #dbf4e4",
                          marginRight: 8,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "1.14rem",
                            color: "#161e3c",
                            lineHeight: 1.1,
                          }}
                        >
                          {item.from}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#6f6090",
                            marginTop: 1,
                            fontWeight: 500,
                          }}
                        >
                          {item.date}
                        </div>
                      </div>
                    </div>
                    <Tag
                      style={{
                        background: ROLE_COLOR[item.role],
                        color: "#404040",
                        fontSize: "1em",
                        fontWeight: 700,
                        padding: "3px 20px",
                        borderRadius: 10,
                        minWidth: 62,
                        textAlign: "center",
                        marginLeft: 12,
                        marginTop: 2,
                      }}
                    >
                      {ROLE_LABEL[item.role] || item.role}
                    </Tag>
                  </div>
                  {/* HÀNG 2: NỘI DUNG MESSAGE */}
                  <div
                    style={{
                      fontSize: "1.08rem",
                      color: "#192039",
                      marginTop: 5,
                      minHeight: 36,
                      fontWeight: 400,
                      wordBreak: "break-word",
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.message }} />
                  </div>
                </div>
              ))}
            </div>
            {/* DETAIL CARD OVERLAY */}
            {detail && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1100,
                  background: "rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleCloseDetail}
              >
                <Card
                  style={{
                    width: 420,
                    borderRadius: 20,
                    padding: "18px 24px",
                    boxShadow: "0 5px 24px rgba(31,32,65,0.13)",
                    position: "relative",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Avatar src={detail.avatar} size={54} />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>
                        {detail.from}
                      </div>
                      <div style={{ color: "#6f6090", fontSize: 13 }}>
                        {detail.date}
                      </div>
                    </div>
                    <Tag
                      style={{
                        background: ROLE_COLOR[detail.role],
                        color: "#404040",
                        fontWeight: 600,
                        fontSize: 14,
                        borderRadius: 8,
                        minWidth: 64,
                        textAlign: "center",
                        marginLeft: 8,
                      }}
                    >
                      {ROLE_LABEL[detail.role] || detail.role}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 16, color: "#232345" }}>
                    <div dangerouslySetInnerHTML={{ __html: detail.message }} />
                  </div>
                  <Button
                    onClick={handleCloseDetail}
                    style={{
                      marginTop: 18,
                      float: "right",
                      background: "#16a34a",
                      color: "#fff",
                      borderRadius: 16,
                      padding: "0 18px",
                      fontWeight: 600,
                    }}
                  >
                    Close
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
