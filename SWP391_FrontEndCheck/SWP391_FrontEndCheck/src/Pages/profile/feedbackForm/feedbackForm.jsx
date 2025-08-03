// src/Pages/community/FeedbackPage.jsx

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button, Input, notification } from "antd";
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
import { ROUTES } from "../../../configs/routes";
import FullPageLayout from "../../../components/layout/UserLayOut";
import UserSidebarLayout from "../../../components/layout/UserSidebar";

// cấu hình notification giống ProfilePage
notification.config({
  placement: "topRight",
  duration: 5,
});

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

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!selectedEmoji) {
      notification.warning({
        message: "Oops!",
        description: "Please choose a rating before submitting.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emoji: selectedEmoji,
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      notification.success({
        message: "Thank you!",
        description: "Your feedback was sent successfully.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });

      navigate(ROUTES.FEEDBACK);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Could not submit feedback. Please try again.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });
    }
  };
  return (
    <FullPageLayout>
      <div className={styles.twoColumn}>
        <UserSidebarLayout></UserSidebarLayout>
        {/* FEEDBACK FORM */}
        <div className={styles.card2}>
          <div className={styles.innerCard}>
            <h2 className={styles.pageTitle}>Rate your experience</h2>
            <p>
              Please take a moment to rate your experience with our service.
            </p>

            <div className={styles.emojiOptions}>
              {EMOJIS.map((e) => (
                <div
                  key={e.value}
                  className={[
                    styles.emojiOption,
                    selectedEmoji === e.value ? styles.selectedEmoji : "",
                  ].join(" ")}
                  onClick={() => setSelectedEmoji(e.value)}
                >
                  <span className={styles.emojiIcon}>{e.icon}</span>
                  <span className={styles.emojiLabel}>{e.label}</span>
                </div>
              ))}
            </div>

            <Input.TextArea
              rows={4}
              placeholder="Tell us about your experience (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.feedbackTextarea}
            />

            <Button
              type="primary"
              size="large"
              block
              className={styles.submitFeedbackBtn}
              onClick={handleSubmit}
            >
              Submit feedback
            </Button>
          </div>
        </div>
      </div>
    </FullPageLayout>
  );
}
