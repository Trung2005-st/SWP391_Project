import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../community/styleBlogDetail.module.css";
import postImg from "../../../../image/smokingBlog.png";
import avatarImg from "../../../../image/avt.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";
import { Modal, Form, Radio, message } from "antd";

const EMOJI_LIST = ["😍", "😲", "🔥", "❤️", "👍", "👎"];

export default function BlogDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    id,
    image = postImg,
    avatar = avatarImg,
    type = "Coach",
    title = "",
    subtitle: mockSubtitle = "",
    content: mockContent = "",
    author = "",
    date = "",
  } = location.state || {};

  const [subtitle, setSubtitle] = useState(mockSubtitle);
  const [storyContent, setStoryContent] = useState(mockContent);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [blogReactions, setBlogReactions] = useState({});
  const [userReactedEmoji, setUserReactedEmoji] = useState("");
  const [isReacting, setIsReacting] = useState(false);

  if (!location.state) {
    navigate(ROUTES.BLOG_SERVICE);
    return null;
  }

  useEffect(() => {
    if (id) {
      loadBlogDetail(id);
      loadComments(id);
      loadBlogReactions(id);
      loadUserReaction(id);
    }
  }, [id]);

  const loadBlogDetail = async (blogID) => {
    try {
      const res = await api.get(`/blogs/${blogID}`);
      setSubtitle(res.data.subtitle || "");
      setStoryContent(res.data.story || "");
    } catch {
      console.error("Failed to fetch blog detail.");
    }
  };

  const loadComments = async (blogID) => {
    try {
      const res = await api.get(`/blog-interaction/comments/${blogID}`);
      setComments(res.data || []);
    } catch (error) {
      console.error("Failed to load comments", error);
    }
  };

  const loadBlogReactions = async (blogID) => {
    try {
      const res = await api.get(`/blog-interaction/reactions/${blogID}`);
      setBlogReactions(res.data || {});
    } catch (error) {
      console.error("Failed to load blog reactions", error);
    }
  };

  const loadUserReaction = async (blogID) => {
    try {
      const res = await api.get(`/blog-interaction/user-reaction/${blogID}`);
      setUserReactedEmoji(res.data.emoji || "");
    } catch (error) {
      console.error("Failed to load user reaction", error);
    }
  };

  const handleBlogReact = async (emoji) => {
    if (isReacting) return;
    setIsReacting(true);

    const isSame = userReactedEmoji === emoji;
    const newEmoji = isSame ? "" : emoji;

    try {
      await api.post(`/blog-interaction/react`, null, {
        params: {
          blogID: id,
          emoji: newEmoji,
        },
      });
      setUserReactedEmoji(newEmoji);
      loadBlogReactions(id);
    } catch {
      message.error("Failed to react to blog.");
    } finally {
      setIsReacting(false);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      message.warning("Comment cannot be empty.");
      return;
    }
    try {
      await api.post(`/blog-interaction/comment`, null, {
        params: {
          blogID: id,
          content: commentText,
          emoji: selectedEmoji,
        },
      });
      message.success("Comment posted!");
      setCommentText("");
      setSelectedEmoji("");
      loadComments(id);
    } catch {
      message.error("Failed to post comment.");
    }
  };

  const showReportModal = () => setIsModalOpen(true);
  const handleReportCancel = () => setIsModalOpen(false);
  const handleReportSubmit = async () => {
    if (!reportReason) {
      message.warning("Please select a reason to report.");
      return;
    }
    try {
      await api.post("/blog-interaction/report", null, {
        params: {
          blogID: id,
          reason: reportReason,
        },
      });
      message.success("Report submitted!");
      setIsModalOpen(false);
      setReportReason("");
    } catch {
      message.error("Failed to report.");
    }
  };

  return (
    <FullPageLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          {/* LEFT */}
          <div className={styles.leftCard}>
            <span className={styles.detailLabel}>{type}</span>
            <h1 className={styles.detailTitle}>{title}</h1>
            <div className={styles.metaInfo}>
              <img src={avatar} alt={author} className={styles.avatarSmall} />
              <span className={styles.metaText}>
                {author} • {date}
              </span>
            </div>
            <img src={image} alt={title} className={styles.detailImage} />
            <div className={styles.detailContent}>
              {subtitle && <p>{subtitle}</p>}
              {storyContent ? (
                <div dangerouslySetInnerHTML={{ __html: storyContent }} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.rightCard}>
            <h3 className={styles.rightTitle}>Community Reactions 💬</h3>

            {/* EMOJI COUNTS */}
            <br></br>
            <div style={{ paddingTop: 8 }}>
              <div className={styles.emojiCountWrapper}>
                {EMOJI_LIST.map((emoji, i) => (
                  <span
                    key={i}
                    className={`${styles.emojiItem} ${userReactedEmoji === emoji ? styles.selected : ""
                      }`}
                    onClick={() => handleBlogReact(emoji)}
                    style={{ cursor: isReacting ? "not-allowed" : "pointer", opacity: isReacting ? 0.5 : 1 }}
                  >
                    {emoji} {blogReactions[emoji] || 0}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.divCheck}>
              <br></br>
              <br></br>
            </div>
            {/* COMMENT BOX */}
            <div className={styles.commentBox}>
              <div className={styles.inputRow}>
                <img src={avatarImg} alt="me" className={styles.avatarSmall} />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.actionRow}>
                <button className={styles.submitBtn} onClick={handleSendComment}>
                  Send
                </button>
                <button className={styles.reportBtn} onClick={showReportModal}>
                  🚩 Report
                </button>
              </div>
            </div>

            {/* COMMENT LIST */}
            <div className={styles.commentList}>
              {comments.map((cmt, idx) => (
                <div key={idx} className={styles.commentCard}>
                  <img
                    src={avatarImg}
                    className={styles.avatarSmall}
                    alt="User"
                  />
                  <div>
                    <strong>{cmt.userName}</strong>
                    <span className={styles.commentDate}>
                      · {cmt.createdAt}
                    </span>
                    <p>
                      {cmt.content} {cmt.emoji}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      <Modal
        title="Report"
        open={isModalOpen}
        onCancel={handleReportCancel}
        onOk={handleReportSubmit}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#16a34a",
            borderRadius: "20px",
            fontWeight: "bold",
            border: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "20px",
            fontWeight: "bold",
          },
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Select a reason:">
            <Radio.Group
              onChange={(e) => setReportReason(e.target.value)}
              value={reportReason}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <Radio value="Spam or misleading">Spam or misleading</Radio>
              <Radio value="Hate speech">Hate speech</Radio>
              <Radio value="Harassment or bullying">
                Harassment or bullying
              </Radio>
              <Radio value="Inappropriate content">Inappropriate content</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </FullPageLayout>
  );
}
