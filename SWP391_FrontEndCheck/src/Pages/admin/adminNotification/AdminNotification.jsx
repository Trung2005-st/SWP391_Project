import React, { useEffect, useState } from "react";
import { Button, Input, Avatar, Select, message, Card } from "antd";
import {
  SearchOutlined,
  NotificationOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../../configs/axios";
import styles from "./adminNotification.module.css";
import AppLayout from "../../../components/layout/AppLayout";
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "MEMBER", label: "Member" },
  { value: "COACH", label: "Coach" },
  { value: "ADMIN", label: "Admin" },
];

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

export default function AdminNotificationPage() {
  const [notifies, setNotifies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [form, setForm] = useState({
    from: "admin",
    role: "ALL",
    message: "",
  });
  const avatars = [avatar1, avatar2];

  useEffect(() => {
    fetchNotifies();
    // eslint-disable-next-line
  }, []);

  // Lấy danh sách notification từ API
  const fetchNotifies = async () => {
    try {
      const res = await api.get("/notification");
      setNotifies(
        res.data.map((n, i) => ({
          ...n,
          id: n.id,
          from: n.sender || "Admin", // backend trả về sender
          date: n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-GB") : "",
          avatar: avatars[i % avatars.length],
          role: n.targetRole || "ALL", // backend trả về targetRole
          message: n.message,
        }))
      );
    } catch {
      message.error("Failed to load notifications!");
      setNotifies([]);
    }
  };

  // Lọc danh sách notification (HIỆN "ALL" ở mọi filter)
  useEffect(() => {
    let arr = notifies;
    if (roleFilter !== "ALL")
      arr = arr.filter((n) => n.role === "ALL" || n.role === roleFilter);
    if (search)
      arr = arr.filter(
        (n) =>
          (n.from || "").toLowerCase().includes(search.toLowerCase()) ||
          (n.message || "").toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(arr);
  }, [search, notifies, roleFilter]);

  // Thống kê
  const total = notifies.length;
  const roleStats = [
    { value: "ALL", label: "All", count: total },
    ...ROLE_OPTIONS.slice(1).map((r) => ({
      ...r,
      count: notifies.filter((n) => n.role === r.value).length,
    })),
  ];

  // Gửi notification gọi API thực
  const handleSend = async () => {
    if (!form.message || !form.message.trim() || form.message === "<p></p>") {
      message.warning("Please enter your notification message.");
      return;
    }
    try {
      // SỬA ĐÚNG field backend: targetRole, sender
      const res = await api.post("/notification", {
        targetRole: form.role,
        message: form.message,
        sender: form.from,
      });
      const created = {
        ...res.data,
        avatar: avatar1,
        date: res.data.sentAt
          ? new Date(res.data.sentAt).toLocaleDateString("en-GB")
          : "",
        role: res.data.targetRole,
        from: res.data.sender,
      };
      setNotifies([created, ...notifies]);
      message.success("Notification sent!");
      setForm({ ...form, message: "" });
    } catch {
      message.error("Failed to send notification!");
    }
  };

  return (
    <AppLayout>
      <div className={styles.adminNotifyRoot}>
        {/* STATISTICS ROW */}
        <div className={styles.statRow}>
          {roleStats.map((r) => (
            <div className={styles.statCard} key={r.value}>
              <div className={styles.statValWrap}>
                <span className={styles.statValue} style={{ color: "#161e3c" }}>
                  {r.count}
                </span>
                <NotificationOutlined className={styles.statIcon} />
              </div>
              <span className={styles.statTitle}>{r.label}</span>
            </div>
          ))}
        </div>
        {/* 2 CARD NGANG */}
        <div className={styles.rowCards}>
          {/* FORM SEND NOTIFY */}
          <Card className={styles.sendCard} bordered={false}>
            <div className={styles.cardTitle}>Send Notification</div>
            <div className={styles.formGroup}>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Sender</label>
                <Input value={form.from} disabled className={styles.input} />
              </div>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>To Roles</label>
                <div className={styles.roleRadioRow}>
                  {ROLE_OPTIONS.map((role) => (
                    <div
                      key={role.value}
                      className={`${styles.roleRadioCard} ${
                        form.role === role.value ? styles.roleRadioActive : ""
                      }`}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: role.value }))
                      }
                      tabIndex={0}
                    >
                      <span className={styles.roleRadioLabel}>
                        {role.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.formItem}>
                <label className={styles.formLabel}>Message</label>
                <Editor
                  apiKey="soignbkqf94dvep4irbnqwcl0bzoz2tpw69beym200w0e1ac"
                  value={form.message}
                  onEditorChange={(newValue) =>
                    setForm((prev) => ({ ...prev, message: newValue }))
                  }
                  init={{
                    height: 185,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table help wordcount",
                      "format",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic underline | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat | help",
                  }}
                />
              </div>
              <Button
                type="primary"
                icon={<SendOutlined />}
                className={styles.sendBtn}
                onClick={handleSend}
                style={{ width: "100%", marginTop: 8, fontWeight: 800 }}
              >
                Send Notification
              </Button>
            </div>
          </Card>
          {/* CARD PHẢI: FILTER + LIST */}
          <Card className={styles.listCard} bordered={false}>
            <div className={styles.cardTitle}>Notifications</div>
            <div className={styles.filterBar}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search notification..."
                allowClear
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                value={roleFilter}
                className={styles.input}
                style={{ width: 110, fontSize: "0.98rem" }}
                onChange={setRoleFilter}
                options={ROLE_OPTIONS}
              />
            </div>
            <div className={styles.notifyList}>
              {filtered.map((item, i) => (
                <div className={styles.notifyItem} key={item.id}>
                  <div className={styles.notifyHeader}>
                    <Avatar src={item.avatar} />
                    <div>
                      <div className={styles.notifyFrom}>{item.from}</div>
                      <div className={styles.notifyDate}>{item.date}</div>
                    </div>
                    <span
                      className={styles.roleTag}
                      style={{
                        background: ROLE_COLOR[item.role] || "#e9eef6",
                        color: "#404040",
                        fontSize: "0.95em",
                        padding: "2.5px 10px 2.5px 9px",
                        minWidth: 58,
                        textAlign: "center",
                      }}
                    >
                      {ROLE_LABEL[item.role] || item.role}
                    </span>
                  </div>
                  <div
                    className={styles.notifyMsg}
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </div>
              ))}
              {!filtered.length && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "32px 0",
                    color: "#999",
                  }}
                >
                  No notifications found.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
