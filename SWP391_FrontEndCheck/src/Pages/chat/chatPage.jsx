// src/Pages/community/ChatPage.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styles from "../chat/styleAfterProgress.module.css"; // chỉ 1 CSS chung
import logoImg from "../../../image/quit.png";
import { ROUTES } from "../../configs/routes";
import api from "../../configs/axios";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function ChatPage() {
  const { contactId } = useParams();
  const navigate = useNavigate();

  // header/menu
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  // chat data
  const [contacts, setContacts] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    api.get("/chats").then((r) => setContacts(r.data));
  }, []);

  useEffect(() => {
    api.get(`/chats/${contactId}`).then((r) => setMsgs(r.data));
  }, [contactId]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    api.post(`/chats/${contactId}`, { content: newMsg }).then((r) => {
      setMsgs((m) => [...m, r.data]);
      setNewMsg("");
    });
  };

  return (
    <div>
      {/* HEADER VÀ NAV GIỐNG Y S DoctorService */}
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
                <NavLink
                  to={ROUTES.COACH_LIST}
                  className={styles.dropdownItem}
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Coach Service
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
              style={{ backgroundColor: "#52c41a", color: "#fff" }}
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

      {/* PAGE WRAPPER + CARD giống y */}
      <div className={styles.pageWrapper}>
        <div className={styles.card} style={{ padding: 32 }}>
          {/* CHAT */}
          <div className={styles.chatContainer}>
            {/* sidebar */}
            <div className={styles.sidebar}>
              {contacts.map((c) => (
                <div
                  key={c.userID}
                  className={
                    c.userID.toString() === contactId
                      ? styles.activeChat
                      : styles.contactItem
                  }
                  onClick={() => navigate(`${ROUTES.CHAT}/${c.userID}`)}
                >
                  {c.username}
                </div>
              ))}
            </div>

            {/* messages panel */}
            <div className={styles.chatWindow}>
              <div className={styles.chatHeader}>
                <span className={styles.chatTitle}>
                  Chat with{" "}
                  {
                    contacts.find((x) => x.userID.toString() === contactId)
                      ?.username
                  }
                </span>
                <span className={styles.chatStatus}>Online</span>
              </div>
              <div className={styles.messages}>
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.sender.userID.toString() === contactId
                        ? styles.msgThem
                        : styles.msgMe
                    }
                  >
                    {m.content}
                  </div>
                ))}
              </div>
              <div className={styles.inputBox}>
                <textarea
                  className={styles.inputField}
                  rows={2}
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type your message…"
                />
                <button className={styles.sendBtn} onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
