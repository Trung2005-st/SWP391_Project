import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../community/styleCreateBlog.module.css";
import { ROUTES } from "../../../configs/routes";
import FullPageLayout from "../../../components/layout/UserLayOut";
import { SearchOutlined, MessageOutlined } from "@ant-design/icons";

import avatarTracey from "../../../../image/avt.png";
import avatarJason from "../../../../image/avt2.png";
import avatarElizabeth from "../../../../image/avt3.png";
import avatarErnie from "../../../../image/avt.png";

export default function SendEncouragement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [displayed, setDisplayed] = useState([]);

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

  return (
    <FullPageLayout>
      <div className={styles.card}>
        <div className={styles.greenHeader}>
          <h2 className={styles.greenTitle}>Send Encouragement</h2>
          <p className={styles.greenSubtitle}>
            Find person you’d like to inspire with a positive message.
          </p>
        </div>

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
    </FullPageLayout>
  );
}
