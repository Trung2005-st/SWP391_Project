import React, { useEffect, useState } from "react";
import { Button, Input, Avatar, Modal, message } from "antd";
import { SearchOutlined, MessageOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import api from "../../../configs/axios";
import styles from "./adminFeedback.module.css";
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import AppLayout from "../../../components/layout/AppLayout";

// Emoji/Color constant
const EMOJIS = [
  { value: "1", icon: "😡", label: "Didn't meet expectations" },
  { value: "2", icon: "☹️", label: "Below expectations" },
  { value: "3", icon: "😐", label: "Met expectations" },
  { value: "4", icon: "🙂", label: "Above expectations" },
  { value: "5", icon: "😄", label: "Exceeded expectations" },
];
const COLORS = ["#ff4444", "#faad14", "#1890ff", "#52c41a", "#9361e7"];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEmoji, setFilterEmoji] = useState("ALL");
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const avatars = [avatar1, avatar2];

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  const fetchFeedbacks = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedbacks(
        res.data.map((f, i) => ({
          ...f,
          id: f.id,
          avatar: avatars[i % avatars.length],
          date: new Date(f.sentAt).toLocaleDateString("en-GB"),
          emoji: String(f.emoji),
          name: f.userName,
          text: f.message,
        }))
      );
    } catch {
      message.error("Failed to load feedbacks!");
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    let arr = feedbacks;
    if (filterEmoji !== "ALL") arr = arr.filter((f) => f.emoji === filterEmoji);
    if (search)
      arr = arr.filter(
        (f) =>
          (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (f.text || "").toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(arr);
  }, [search, feedbacks, filterEmoji]);

  // Stats, Pie data
  const stats = EMOJIS.map((e) => ({
    ...e,
    count: feedbacks.filter((f) => f.emoji === e.value).length,
  }));
  const total = feedbacks.length;
  const chartData = stats.map((e) => ({
    name: e.label,
    value: e.count,
    color: COLORS[EMOJIS.indexOf(e)],
    icon: e.icon,
  }));

  // Response modal
  const [responseText, setResponseText] = useState("");
  const handleResponse = (fb) => {
    setSelected(fb);
    setResponseText("");
    setModal(true);
  };
  const submitResponse = () => {
    setModal(false);
    message.success("Sent response to user: " + selected.name);
  };

  return (
    <AppLayout>
      <div className={styles.adminFeedbackRoot}>
        {/* Dãy THỐNG KÊ */}
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Total</span>
            <div className={styles.statValWrap}>
              <span className={styles.statValueBig}>{total}</span>
              <MessageOutlined
                className={styles.statEmoji}
                style={{ color: "#1890ff" }}
              />
            </div>
          </div>
          {stats.map((e, idx) => (
            <div className={styles.statCard} key={e.value}>
              <span className={styles.statTitle}>{e.label}</span>
              <div className={styles.statValWrap}>
                <span
                  className={styles.statValueBig}
                  style={{ color: COLORS[idx] }}
                >
                  {e.count}
                </span>
                <span className={styles.statEmoji}>{e.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2 panel ngang: Pie + Filter/Feedback */}
        <div className={styles.dashboardRow}>
          {/* BIỂU ĐỒ PANEL */}
          <div className={styles.leftPanel}>
            <div className={styles.pieWrapper}>
              <PieChart width={230} height={180}>
                <Pie
                  data={chartData}
                  cx={110}
                  cy={85}
                  innerRadius={36}
                  outerRadius={66}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                  label={({ percent }) =>
                    percent > 0 ? `${Math.round(percent * 100)}%` : ""
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className={styles.customLegend}>
                {chartData.map((entry, i) => (
                  <div className={styles.legendRow} key={entry.name}>
                    <span
                      className={styles.legendColor}
                      style={{ background: COLORS[i] }}
                    ></span>
                    <span className={styles.legendIcon}>{entry.icon}</span>
                    <span className={styles.legendLabel}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* FILTER + LIST PANEL */}
          <div className={styles.rightPanel}>
            <div className={styles.filterBar}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search feedback..."
                allowClear
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className={styles.emojiFilter}>
                <Button
                  size="small"
                  className={filterEmoji === "ALL" ? styles.activeEmoji : ""}
                  onClick={() => setFilterEmoji("ALL")}
                >
                  All
                </Button>
                {EMOJIS.map((e) => (
                  <Button
                    key={e.value}
                    size="small"
                    className={
                      filterEmoji === e.value ? styles.activeEmoji : ""
                    }
                    style={{ fontSize: 18, margin: "0 2px" }}
                    onClick={() => setFilterEmoji(e.value)}
                  >
                    {e.icon}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.feedbackList}>
              {filtered.map((fb) => {
                const emojiObj = EMOJIS.find((e) => e.value === fb.emoji);
                return (
                  <div className={styles.userCard} key={fb.id}>
                    <div className={styles.userCardHeader}>
                      <Avatar src={fb.avatar} size={36} />
                      <div className={styles.userMainInfo}>
                        <div className={styles.userName}>{fb.name}</div>
                        <div className={styles.userEmail}>{fb.date}</div>
                      </div>
                      <span className={styles.emojiLarge}>
                        {emojiObj ? emojiObj.icon : "❓"}
                      </span>
                    </div>
                    <div className={styles.feedbackText}>{fb.text}</div>
                  </div>
                );
              })}
              {!filtered.length && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "30px 0",
                    color: "#888",
                  }}
                >
                  No feedback found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
