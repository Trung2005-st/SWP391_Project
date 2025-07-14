// src/Pages/community/SendEncouragement.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../community/styleCreateBlog.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";
import {
  SearchOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button } from "antd";

import avatarTracey from "../../../../image/avt.png";
import avatarJason from "../../../../image/avt2.png";
import avatarElizabeth from "../../../../image/avt3.png";
import avatarErnie from "../../../../image/avt.png";

export default function SendEncouragement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);

  // load users once
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const payload = JSON.parse(atob(token.split(".")[1]));
        const meEmail = payload.sub;
        const avatarList = [
          avatarTracey,
          avatarJason,
          avatarElizabeth,
          avatarErnie,
        ];
        const mapped = data
          .filter((u) => u.email !== meEmail)
          .map((u) => ({
            id: u.userID,
            name: u.username,
            email: u.email,
            quitDate: new Date(u.joinDate).toLocaleDateString("en-GB"),
            image: avatarList[Math.floor(Math.random() * avatarList.length)],
          }));
        setUsers(mapped);
        setDisplayed(mapped);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, []);

  // filter when button clicked
  const handleSearch = () => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setDisplayed(users);
    } else {
      setDisplayed(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      );
    }
  };

  const handleSend = (user) => {
    navigate(ROUTES.SEND_ENCOURAGEMENT_FORM, {
      state: { receiver: { id: user.id, name: user.name, email: user.email } },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
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
                <NavLink to={ROUTES.COACH_LIST} className={styles.dropdownItem}>
                  Doctor Service
                </NavLink>
                <NavLink
                  to={ROUTES.BLOG_SERVICE}
                  className={styles.dropdownItem}
                >
                  Blog Service
                </NavLink>
                <NavLink
                  to={ROUTES.SEND_ENCOURAGEMENT_LIST}
                  className={styles.dropdownItem}
                >
                  Send Encouragement
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        {localStorage.getItem("token") ? (
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
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      <div className={styles.fullPage}>
        <div className={styles.pageWrapper}>
          <div className={styles.card}>
            <div className={styles.greenHeader}>
              <h2 className={styles.greenTitle}>Send Encouragement</h2>
              <p className={styles.greenSubtitle}>
                Find person you’d like to inspire with a positive message.
              </p>
            </div>

            {/* search row */}
            <div style={{ padding: "24px 32px", display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
                placeholder="Search for a person"
                style={{ flex: 1 }}
              />
              <button className={styles.submitBtn} onClick={handleSearch}>
                Search <SearchOutlined />
              </button>
            </div>

            {/* results */}
            <div
              style={{
                padding: "0 32px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {displayed.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "16px 24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{user.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        starting quit day since {user.quitDate}
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSend(user)}
                  >
                    Send a message <MessageOutlined />
                  </button>
                </div>
              ))}
              {displayed.length === 0 && (
                <div style={{ textAlign: "center", color: "#6b7280" }}>
                  No matches found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
