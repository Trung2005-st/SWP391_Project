// src/Pages/profile/ProfilePage.jsx

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button, notification, Radio } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import userPic from "../../../../image/avt.png";
import { ROUTES } from "../../../configs/routes";

notification.config({
  placement: "topRight",
  duration: 5,
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // Load profile
  useEffect(() => {
    if (!token) return navigate(ROUTES.HOME);
    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setContact(data.phone || "");
        setGender(data.gender || "");
      })
      .catch(() =>
        notification.error({
          message: "Error",
          description: "Could not load profile.",
          style: { width: 360 },
        })
      );
  }, [token, navigate]);

  const validate = () => {
    if (!firstName.trim()) {
      notification.error({
        message: "First name is required",
        style: { width: 360 },
      });
      return false;
    }
    if (!lastName.trim()) {
      notification.error({
        message: "Last name is required",
        style: { width: 360 },
      });
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      notification.error({ message: "Invalid email", style: { width: 360 } });
      return false;
    }
    const phoneRe = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;
    if (!phoneRe.test(contact)) {
      notification.error({ message: "Invalid phone", style: { width: 360 } });
      return false;
    }
    if (!["MALE", "FEMALE"].includes(gender)) {
      notification.error({ message: "Select a gender", style: { width: 360 } });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate() || !user) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/users/${user.userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...user,
        firstName,
        lastName,
        email,
        phone: contact,
        gender,
      }),
    })
      .then((res) => {
        setLoading(false);
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((updated) => {
        setUser(updated);
        notification.success({
          message: "Profile Updated!",
          description: "Your changes have been saved.",
          style: { width: 360, fontSize: 16, padding: "16px 24px" },
        });
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Error",
          description: "Could not update profile.",
          style: { width: 360 },
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };
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

      {/* CONTENT */}
      <div className={styles.pageWrapper}>
        <div className={styles.twoColumn}>
          {/* SIDEBAR */}
          <div className={styles.card}>
            <nav className={styles.sidebar}>
              <ul>
                <NavLink to={ROUTES.PROFILE_PAGE}>
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
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
                  <li className={styles.sidebarItem}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* PROFILE FORM */}
          <div className={styles.card2}>
            <div className={styles.profileHeader}>
              <h2 className={styles.profileTitle}>Profile</h2>
              <Avatar
                src={user?.avatarUrl || userPic}
                size={64}
                className={styles.profileAvatar}
              />
            </div>
            <section className={styles.profileContent}>
              {/* First Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>First Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              {/* Last Name */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Last Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <div className={styles.inputWithIcon}>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <CheckCircleOutlined className={styles.verifyIcon} />
                </div>
              </div>
              {/* Contact */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contact Number</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              {/* Gender */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Gender</label>
                <Radio.Group
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                >
                  <Radio value="MALE">Male</Radio>
                  <Radio value="FEMALE">Female</Radio>
                </Radio.Group>
              </div>
              {/* Buttons */}
              <div className={styles.buttons}>
                <button className={styles.prevBtn} onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button
                  className={styles.nextBtn}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
