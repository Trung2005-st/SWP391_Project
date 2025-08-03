import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Button } from "antd";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import DOMPurify from "dompurify";

import styles from "../styleBlogManager.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";

// encouragement templates
import enc1 from "../../../../image/encouragement1.png";
import enc2 from "../../../../image/encouragement2.jpg";
import enc3 from "../../../../image/encouragement3.jpg";
import enc4 from "../../../../image/encouragement4.jpg";
import enc5 from "../../../../image/encouragement5.png";
import enc6 from "../../../../image/encouragement6.png";
import enc7 from "../../../../image/encouragement7.png";

// avatars for detail overlay
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import avatar3 from "../../../../image/avt3.png";
import FullPageLayout from "../../../components/layout/UserLayOut";
import UserSidebarLayout from "../../../components/layout/UserSidebar";

const patterns = {
  1: enc1,
  2: enc2,
  3: enc3,
  4: enc4,
  5: enc5,
  6: enc6,
  7: enc7,
};
const avatars = [avatar1, avatar2, avatar3];

export default function ArchivePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // 1️⃣ Demo data
  const demoData = [
  ];

  // 2️⃣ State
  const [archiveList, setArchiveList] = useState(demoData);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar1);

  // 3️⃣ Helper for API‐provided templatePath
  const getBgUrl = (path) =>
    path ? `url(${path.startsWith("/") ? path.slice(1) : path})` : "";

  // 4️⃣ Fetch from backend
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/encouragements/received", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const apiCards = data.map((it) => ({
          id: it.encouragementID,
          // / name: `${it.sender?.firstName || ""} ${it.sender?.lastName || ""}`.trim(),
          name: "Trung cmnr",
          tpl: null,
          templatePath: it.template || "",
          text: it.message || "",
          sendAt: it.sentAt || "2025-07-10T08:30:00Z",
        }));
        setArchiveList([...demoData, ...apiCards]);
      })
      .catch(() => setArchiveList(demoData));
  }, [token]);

  // 5️⃣ Handlers
  const handleSelect = (item) => {
    const rand = Math.floor(Math.random() * avatars.length);
    setSelectedAvatar(avatars[rand]);
    setSelectedId(item.id);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setSelectedId(null);
  };

  // 6️⃣ Date formatting
  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB");

  return (
    <FullPageLayout>
      <div className={styles.twoColumn}>
        <UserSidebarLayout></UserSidebarLayout>
        {/* ARCHIVE LIST */}
        <div className={styles.card2}>
          <h2 className={styles.pageTitle}>Archive</h2>
          <div className={styles.archiveList}>
            {archiveList.map((item) => {
              const isSel = selectedId === item.id;
              const bgStyle =
                item.tpl && patterns[item.tpl]
                  ? { backgroundImage: `url(${patterns[item.tpl]})` }
                  : item.templatePath
                    ? { backgroundImage: getBgUrl(item.templatePath) }
                    : {};

              // combine classes
              const wrapperCls = [styles.archiveItem, isSel && styles.selected]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={item.id}
                  className={wrapperCls}
                  onClick={() => handleSelect(item)}
                  style={{
                    ...bgStyle,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* DETAIL CARD */}
                  {isSel && (
                    <div className={styles.detailCard}>
                      <Avatar src={selectedAvatar} size={48} />
                      <div className={styles.detailText}>
                        <p className={styles.detailName}> {item.name}</p>
                        <p className={styles.detailDate}>
                          {formatDate(item.sendAt)}
                        </p>
                      </div>
                      <CloseOutlined
                        onClick={handleClose}
                        className={styles.detailClose}
                      />
                    </div>
                  )}

                  {/* BUBBLE CONTENT */}
                  <div className={styles.archiveContent}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.text).replace(
                          /\n/g,
                          "<br/>"
                        ),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button className={styles.loadMore}>Load more message</button>
        </div>
      </div>
    </FullPageLayout>
  );
}
