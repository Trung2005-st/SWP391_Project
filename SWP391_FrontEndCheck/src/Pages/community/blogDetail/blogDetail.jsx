// src/Pages/community/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "../../community/styleBlogDetail.module.css";
import logoImg from "../../../../image/quit.png";
import postImg from "../../../../image/smokingBlog.png";
import avatarImg from "../../../../image/avt.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";

export default function BlogDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // /* 1. Nhận tất cả props tĩnh từ state do BlogService truyền */
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

  // /* 2. Nếu direct URL không có state → quay về list */
  if (!location.state) {
    navigate(ROUTES.BLOG_SERVICE);
    return null;
  }

  // /* 3. State để hiển thị subtitle + story */
  const [subtitle, setSubtitle] = useState(mockSubtitle);
  const [storyContent, setStoryContent] = useState(mockContent);

  useEffect(() => {
    // Chỉ chạy khi mockSubtitle hoặc mockContent trống và id tồn tại
    if ((!mockSubtitle || !mockContent) && id) {
      // 3.1. Lấy toàn bộ list DTO trước
      api
        .get("/blogs/dto")
        .then((res) => {
          // 3.2. Tìm record khớp cả author (username) và title
          const found = res.data.find(
            (b) => b.username === author && b.title === title
          );
          if (found) {
            // 3.3. Nếu tìm thấy, mới gọi detail API theo blogID
            api
              .get(`/blogs/${found.blogID}`)
              .then((detailRes) => {
                setSubtitle(detailRes.data.subtitle || "");
                setStoryContent(detailRes.data.story || "");
              })
              .catch((err) => {
                console.error("Error fetching detail", err);
              });
          }
          // Nếu không tìm thấy, giữ nguyên mockSubtitle/mockContent
        })
        .catch((err) => {
          console.error("Error fetching list DTO", err);
        });
    }
  }, [id, author, title, mockSubtitle, mockContent]);

  // /* 4. Dropdown menu community */
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  return (
    <div className={styles.fullPage}>
      {/* HEADER */}
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

        <button
          className={styles.startBtn}
          onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
        >
          Get Started
        </button>
      </header>

      {/* BODY */}
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
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
            {/* Hiển thị subtitle nếu có */}
            {subtitle && <p>{subtitle}</p>}

            {/* storyContent HTML */}
            {storyContent ? (
              <div dangerouslySetInnerHTML={{ __html: storyContent }} />
            ) : (
              <>
                {/* Fallback: giữ nguyên mock default content */}
                <p>
                  Quitting smoking is one of the best decisions you can make for
                  your health, but it’s no secret that the process can be
                  stressful. Nicotine withdrawal, cravings, and the emotional
                  habit of smoking can make quitting feel overwhelming. However,
                  with the right strategies, you can break free from cigarettes
                  without losing your sanity.
                </p>
                <p>In this blog, we’ll explore:</p>
                <ul>
                  <li>The connection between smoking and stress</li>
                  <li>How quitting actually reduces anxiety in the long run</li>
                  <li>Practical tips to quit smoking without extreme stress</li>
                  <li>Healthy alternatives to manage cravings</li>
                  <li>How to stay motivated on your smoke-free journey</li>
                </ul>
                <h2>Why Do We Associate Smoking with Stress Relief?</h2>
                <p>
                  Many smokers believe that cigarettes help them relax, but this
                  is a misconception. Nicotine is a stimulant that creates
                  temporary relief from withdrawal symptoms, not actual stress
                  reduction. In reality, smoking increases heart rate and blood
                  pressure, contributing to long-term anxiety.
                </p>
                <h2>The Truth: Quitting Smoking Reduces Stress</h2>
                <p>
                  Studies show that ex-smokers experience lower stress levels
                  than current smokers. Here’s why:
                </p>
                <ul>
                  <li>No more withdrawal-induced anxiety</li>
                  <li>Better sleep & mood</li>
                  <li>Increased oxygen flow</li>
                  <li>Regained control and confidence</li>
                </ul>
                <h2>How to Quit Smoking Without Extreme Stress</h2>
                <ol>
                  <li>
                    Choose a quit date during a low-stress period to prepare
                    mentally.
                  </li>
                  <li>Use nicotine replacement therapy if needed.</li>
                  <li>
                    Replace smoking with healthy habits (deep breathing,
                    exercise).
                  </li>
                  <li>Identify and avoid your triggers.</li>
                  <li>
                    Seek social support from friends, family, or a quitline.
                  </li>
                </ol>
                <h2>Final Thoughts</h2>
                <p>
                  Quitting smoking is challenging, but achievable. The initial
                  stress of withdrawal is temporary, while the benefits of being
                  smoke-free last a lifetime. You’ve got this!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
