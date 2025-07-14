import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../community/styleCreateBlog.module.css";
import logoImg from "../../../../image/quit.png";
import { ROUTES } from "../../../configs/routes";
import { Editor } from "@tinymce/tinymce-react";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [story, setStory] = useState("");
  const [banner, setBanner] = useState(null);
  const fileInputRef = useRef(null);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setBanner(e.target.files[0]);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter your blog title.");
      return;
    }
    if (!subtitle.trim()) {
      alert("Please enter your blog subtitle.");
      return;
    }
    if (!story.trim() || story === "<p></p>") {
      alert("Please share your story content.");
      return;
    }

    let bannerPath = null;

    if (banner) {
      const formData = new FormData();
      formData.append("file", banner);

      try {
        const uploadRes = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (uploadRes.ok) {
          bannerPath = await uploadRes.text();
        } else {
          alert("Banner upload failed.");
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Banner upload error.");
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:8080/api/blogs/dto/my", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: title,
          subtitle: subtitle,
          story: story,
          bannerPath: bannerPath,
        }),
      });
      if (res.ok) {
        alert("Blog submitted successfully!");
        navigate(ROUTES.BLOG_SERVICE);
      } else {
        alert("Submit failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting blog!");
    }
  };

  return (
    <div>
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
                  Doctor Service
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
        {/* conditional header buttons */}
        {token ? (
          <>
            <div class={styles.groupBtn}>
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
          </>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      <div className={styles.fullPage}>
        <div className={styles.pageWrapper}>
          <div className={styles.card}>
            <div className={styles.greenHeader}>
              <h2 className={styles.greenTitle}>Share Your Story</h2>
              <p className={styles.greenSubtitle}>
                Inspire others by sharing the story of how lung disease or air
                quality affected you or someone you love.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.label}>Enter your blog title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Your blog title"
                required
              />

              <label className={styles.label}>Enter your blog subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={styles.input}
                placeholder="Your blog subtitle"
                required
              />

              <label className={styles.label}>
                Upload an image for your blog banner
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.hiddenFile}
                accept="image/*"
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current.click()}
              >
                Upload from my device ⬆️
              </button>

              {banner && (
                <div className={styles.preview}>
                  <strong>Selected:</strong> {banner.name}
                </div>
              )}

              <label className={styles.label}>Your story</label>
              <Editor
                apiKey="soignbkqf94dvep4irbnqwcl0bzoz2tpw69beym200w0e1ac"
                value={story}
                onEditorChange={(newValue) => setStory(newValue)}
                init={{
                  height: 300,
                  menubar: "edit format insert view tools table help",
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

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.BLOG_SERVICE)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
