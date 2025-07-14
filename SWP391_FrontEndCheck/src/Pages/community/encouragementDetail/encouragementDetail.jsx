// src/Pages/community/SendEncouragementForm.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Button, notification } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";

import styles from "../../community/styleCommunity.module.css";
import logoImg from "../../../../image/quit.png";
import avatarTracey from "../../../../image/avt.png";
import avatarJason from "../../../../image/avt2.png";
import avatarElizabeth from "../../../../image/avt3.png";
import avatarErnie from "../../../../image/avt.png";
import encouragement1 from "../../../../image/encouragement1.png";
import encouragement2 from "../../../../image/encouragement2.jpg";
import encouragement3 from "../../../../image/encouragement3.jpg";
import encouragement4 from "../../../../image/encouragement4.jpg";
import encouragement5 from "../../../../image/encouragement5.png";
import encouragement6 from "../../../../image/encouragement6.png";
import encouragement7 from "../../../../image/encouragement7.png";

import { ROUTES } from "../../../configs/routes";

// Configure global notification defaults
notification.config({
  placement: "topRight",
  duration: 5,
});

export default function SendEncouragementForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const receiver = state?.receiver; // { id, name, email }

  // redirect if no receiver
  useEffect(() => {
    if (!receiver) navigate(ROUTES.SEND_ENCOURAGEMENT);
  }, [receiver, navigate]);

  const [yourName, setYourName] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(0);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const today = new Date().toLocaleDateString("en-GB");
  const token = localStorage.getItem("token");

  const templates = [
    null,
    encouragement1,
    encouragement2,
    encouragement3,
    encouragement4,
    encouragement5,
    encouragement6,
    encouragement7,
  ];

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(ROUTES.HOME);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/encouragements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: receiver.id,
          message,
          template: templates[selected],
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      // show big notification
      notification.success({
        message: "Sent!",
        description: "Your encouragement message was sent successfully.",
        style: {
          width: 360,
          fontSize: 16,
          padding: "16px 24px",
        },
      });
      // return to list
      navigate(ROUTES.SEND_ENCOURAGEMENT);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Could not send message. Please try again.",
        style: { width: 360 },
      });
    }
  };

  const avatarMap = {
    1: avatarTracey,
    2: avatarJason,
    3: avatarElizabeth,
    4: avatarErnie,
  };

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

      {/* FORM */}
      <div className={styles.fullPage}>
        <div className={styles.pageWrapper}>
          <div className={`${styles.card} ${styles.sendEncouragementCard}`}>
            <div className={styles.greenHeader}>
              <h2 className={styles.greenTitle}>Send Encouragement</h2>
              <p className={styles.greenSubtitle}>
                Find person you’d like to inspire with a positive message.
              </p>
            </div>

            <div className={styles.formSection}>
              <label className={styles.label}>Your name (optional)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your name here"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
              />

              <label className={styles.label}>Message</label>
              <Editor
                apiKey="soignbkqf94dvep4irbnqwcl0bzoz2tpw69beym200w0e1ac"
                value={message}
                init={{
                  height: 300,
                  menubar: "edit format insert view tools table help",
                  plugins:
                    "advlist autolink lists link image charmap preview anchor " +
                    "searchreplace visualblocks code fullscreen " +
                    "insertdatetime media table help wordcount",
                  toolbar:
                    "undo redo | formatselect | bold italic underline | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | help",
                }}
                onEditorChange={(newValue) => setMessage(newValue)}
              />

              <label className={styles.label}>
                Choose your message template
              </label>
              <div className={styles.templateGrid}>
                <div
                  className={`${styles.templateItem} ${selected === 0 ? styles.templateSelected : ""}`}
                  onClick={() => setSelected(0)}
                />
                {templates.slice(1).map((src, i) => (
                  <img
                    key={i + 1}
                    src={src}
                    className={`${styles.templateItem} ${selected === i + 1 ? styles.templateSelected : ""}`}
                    onClick={() => setSelected(i + 1)}
                    alt={`template ${i + 1}`}
                  />
                ))}
              </div>

              <div
                className={styles.templatePreviewWrapper}
                style={{
                  background:
                    selected === 0
                      ? "#ffffff"
                      : `url(${templates[selected]}) center/cover no-repeat`,
                }}
              >
                <div className={styles.previewHeaderCard}>
                  <div className={styles.previewHeader}>
                    <img
                      src={avatarMap[selected] || avatarTracey}
                      className={styles.previewAvatar}
                      alt="Avatar"
                    />
                    <div>
                      <div className={styles.previewName}>{receiver?.name}</div>
                      <div className={styles.previewDate}>{today}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.previewBodyCard}>
                  <div
                    className={styles.previewBody}
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                  Send a message <MessageOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
