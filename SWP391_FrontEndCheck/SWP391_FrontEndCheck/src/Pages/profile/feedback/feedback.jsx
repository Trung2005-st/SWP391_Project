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
import FullPageLayout from "../../../components/layout/UserLayOut";
import UserSidebarLayout from "../../../components/layout/UserSidebar";

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

  return (
    <FullPageLayout>
      <div className={styles.twoColumn}>
        <UserSidebarLayout></UserSidebarLayout>
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
    </FullPageLayout>
  );
}
