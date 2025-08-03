import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../community/styleCommunityBlog.module.css";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";
import avatar1 from "../../../../image/avt.png";
import avatar2 from "../../../../image/avt2.png";
import avatar3 from "../../../../image/avt3.png";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import FullPageLayout from "../../../components/layout/UserLayOut";

// helper decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export default function BlogService() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(9);
  const [dynamicPosts, setDynamicPosts] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);

  const avatarList = [avatar1, avatar2, avatar3];
  useEffect(() => {
    const tok = localStorage.getItem("token");
    if (tok) {
      const decoded = parseJwt(tok);
      if (decoded?.sub) setCurrentEmail(decoded.sub);
    }

    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/dto");
        const data = res.data.map((b) => ({
          id: b.blogID,
          title: b.title,
          subtitle: b.subtitle,
          story: b.story,
          author: b.username,
          email: b.email,
          date: new Date(b.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          type: b.role === 3 ? "Admin" : b.role === 1 ? "Member" : "Coach",
          image: `http://localhost:8080${b.bannerPath}`,
          avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
        }));
        setDynamicPosts(data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  const mergedPosts = useMemo(() => {
    return [...dynamicPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [dynamicPosts]);
  const filtered = useMemo(() => {
    return mergedPosts.filter((p) => {
      const m1 =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.subtitle || "").toLowerCase().includes(search.toLowerCase());
      let m2 = false;
      if (tab === "Latest") m2 = true;
      else if (tab === "Coach's blogs") m2 = p.type === "Coach";
      else if (tab === "Member's blogs") m2 = p.type === "Member";
      else if (tab === "Your Blogs" && currentEmail)
        m2 = p.email === currentEmail;
      return m1 && m2;
    });
  }, [mergedPosts, search, tab, currentEmail]);

  const visiblePosts = filtered.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <FullPageLayout>
      <div className={styles.card}>
        <h2 className={styles.title}>Our community blogs</h2>
        <p className={styles.subtitle}>
          Clinical excellence must be the priority for any health care service
        </p>
        <div className={styles.filterBar}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a blog"
            className={styles.searchInput}
          />
          <button className={styles.filterBtn}>Search 🔍</button>
          <button
            className={styles.filterBtn}
            onClick={() => navigate(ROUTES.CREATE_BLOG)}
          >
            Create new post ➕
          </button>
        </div>
        <ul className={styles.tabs}>
          {["Latest", "Coach's blogs", "Member's blogs", "Your Blogs"].map(
            (label) => (
              <li
                key={label}
                className={tab === label ? styles.activeNav : styles.navItem}
                onClick={() => setTab(label)}
              >
                {label}
              </li>
            )
          )}
        </ul>

        <div className={styles.planSupportGrid}>
          {visiblePosts.map((p) => (
            <div
              key={p.id}
              className={styles.planCard}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(ROUTES.BLOG_DETAIL, {
                  state: {
                    id: p.id,
                    image: p.image,
                    avatar: p.avatar,
                    type: p.type,
                    title: p.title,
                    subtitle: p.subtitle,
                    story: p.story,
                    author: p.author,
                    date: p.date,
                    email: p.email,
                  },
                })
              }
            >
              <img src={p.image} alt={p.title} className={styles.cardImage} />
              <span className={styles.planCardLabel}>{p.type}</span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              {p.subtitle && <p className={styles.subtitle}>{p.subtitle}</p>}
              <div className={styles.cardFooter}>
                <img
                  src={p.avatar}
                  alt={p.author}
                  className={styles.avatarSmall}
                />
                <span className={styles.metaText}>
                  {p.author} • {p.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <button className={styles.loadMore} onClick={handleLoadMore}>
            Load more posts
          </button>
        )}
      </div>
    </FullPageLayout>
  );
}
