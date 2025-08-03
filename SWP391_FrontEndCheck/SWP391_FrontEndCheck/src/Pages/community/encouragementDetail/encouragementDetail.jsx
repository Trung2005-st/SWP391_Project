import React, { useEffect, useState } from "react";
import styles from "../../community/styleCommunity.module.css";
import { ROUTES } from "../../../configs/routes";
import FullPageLayout from "../../../components/layout/UserLayOut";
import { Editor } from "@tinymce/tinymce-react";
import { MessageOutlined } from "@ant-design/icons";
import { notification } from "antd";

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
import { useLocation, useNavigate } from "react-router-dom";

notification.config({ placement: "topRight", duration: 5 });

export default function SendEncouragementForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const receiver = state?.receiver;
  const [yourName, setYourName] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(0);
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

  const avatarMap = {
    1: avatarTracey,
    2: avatarJason,
    3: avatarElizabeth,
    4: avatarErnie,
  };

  useEffect(() => {
    if (!receiver) navigate(ROUTES.SEND_ENCOURAGEMENT);
  }, [receiver, navigate]);
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
      notification.success({
        message: "Sent!",
        description: "Your encouragement message was sent successfully.",
        style: { width: 360, fontSize: 16, padding: "16px 24px" },
      });
      navigate(ROUTES.SEND_ENCOURAGEMENT);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Could not send message. Please try again.",
        style: { width: 360 },
      });
    }
  };

  return (
    <FullPageLayout>
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

          <label className={styles.label}>Choose your message template</label>
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
    </FullPageLayout>
  );
}
