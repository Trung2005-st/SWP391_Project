import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from "./userLayout.module.css";
import logoImg from "../../../image/quit.png";
import { ROUTES } from "../../configs/routes";

export default function FullPageLayout({ children }) {
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showProgressMenu, setShowProgressMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const toggleProgressMenu = (e) => {
    e.preventDefault();
    setShowProgressMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };

  const isProgressActive = location.pathname.startsWith("/progress");
  const isCommunityActive =
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/coach") ||
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/encouragement");

  return (
    <div className={styles.fullPage}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logoImg} alt="QuitHub" className={styles.logoImg} />
          <span className={styles.logoText}>QuitHub</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to={ROUTES.HOME}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            Home
          </NavLink>

          <NavLink
            to={ROUTES.DAILY_PROGRESS}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            Progress
          </NavLink>
          <NavLink
            to={ROUTES.AFTER_PROGRESS_STEP}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            Plan
          </NavLink>

          <div className={styles.communityWrapper}>
            <a
              href="/community"
              className={`${styles.navItem} ${isCommunityActive ? styles.navItemActive : ""}`}
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
                  to={ROUTES.SEND_ENCOURAGEMENT}
                  className={styles.dropdownItem}
                >
                  Send Encouragement
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {token ? (
          <div className={styles.groupBtn}>
            <NavLink to="/profile">
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
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={styles.logoutBtn}
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

      <div className={styles.pageWrapper}>{children}</div>
    </div>
  );
}
