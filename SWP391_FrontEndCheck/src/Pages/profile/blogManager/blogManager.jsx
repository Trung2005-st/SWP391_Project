import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button, Popconfirm, notification } from "antd";
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
import smokingBlogImg from "../../../../image/smokingBlog.png";
import { ROUTES } from "../../../configs/routes";

// --- mock data in state so we can remove it ---
const initialMockPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  image: smokingBlogImg,
  type: "COACH",
  title: "Smoke-Free, Stress-Free: How to Quit Without Losing Your Mind",
  date: "August 20, 2022",
}));

const roleMap = {
  1: "MEMBER",
  2: "COACH",
  3: "ADMIN",
};

// configure global notification defaults
notification.config({
  placement: "topRight",
  duration: 5,
});

export default function BlogManagerPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dbPosts, setDbPosts] = useState([]);
  const [mockPosts, setMockPosts] = useState(initialMockPosts);
  const [visibleCount, setVisibleCount] = useState(9);

  // fetch real blogs
  useEffect(() => {
    fetch("http://localhost:8080/api/blogs/dto", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blogs");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDbPosts(sorted);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [token]);

  // delete handler: real vs mock
  const handleDelete = (post) => {
    if (post.key.startsWith("db-")) {
      // real delete
      fetch(`http://localhost:8080/api/blogs/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          setDbPosts((prev) => prev.filter((p) => p.blogID !== post.id));
          notification.success({
            message: "Deleted!",
            description: "Your blog post was successfully removed.",
            style: {
              width: 360,
              fontSize: 16,
              padding: "16px 24px",
            },
          });
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Could not delete blog post.",
            style: { width: 360 },
          });
        });
    } else {
      // mock delete
      setMockPosts((prev) => prev.filter((p) => p.id !== post.id));
      notification.success({
        message: "Removed!",
        description: "Mock post has been removed.",
        style: {
          width: 360,
          fontSize: 16,
          padding: "16px 24px",
        },
      });
    }
  };

  // merge DB posts first, then mock
  const allPosts = [
    ...dbPosts.map((p) => {
      const url = `http://localhost:8080${p.bannerPath.replace(/\\/g, "/")}`;
      return {
        key: `db-${p.blogID}`,
        id: p.blogID,
        image: url,
        type: roleMap[p.role] || "MEMBER",
        title: p.title,
        date: new Date(p.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
    }),
    ...mockPosts.map((p) => ({
      key: `mock-${p.id}`,
      id: p.id,
      image: p.image,
      type: p.type,
      title: p.title,
      date: p.date,
    })),
  ];
  // /* 4. Dropdown menu community */
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };
  const visiblePosts = allPosts.slice(0, visibleCount);

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
            Progress
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
        {token ? (
          <div className={styles.groupBtn}>
            <NavLink to={ROUTES.PROFILE_PAGE}>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#52c41a",
                  color: "#fff",
                  marginRight: 16,
                }}
              />
            </NavLink>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("token");
                navigate(ROUTES.HOME);
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      {/* 2-COLUMN */}
      <div className={styles.pageWrapper}>
        <div className={styles.twoColumn}>
          {/* SIDEBAR */}
          <div className={styles.card}>
            <nav className={styles.sidebar}>
              <ul>
                <NavLink to={ROUTES.PROFILE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <UserOutlined className={styles.icon} />
                    <span>Profile</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.BLOG_MANAGER}>
                  <li className={[styles.sidebarItem, styles.active].join(" ")}>
                    <EditOutlined className={styles.icon} />
                    <span>Blog manager</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.NOTIFICATION}>
                  <li className={styles.sidebarItem}>
                    <BellOutlined className={styles.icon} />
                    <span>Notification</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.ARCHIVE_PAGE}>
                  <li className={styles.sidebarItem}>
                    <InboxOutlined className={styles.icon} />
                    <span>Archive</span>
                  </li>
                </NavLink>
                <NavLink to={ROUTES.FEEDBACK}>
                  <li className={styles.sidebarItem}>
                    <MessageOutlined className={styles.icon} />
                    <span>Feedback</span>
                  </li>
                </NavLink>
              </ul>
            </nav>
          </div>

          {/* CONTENT */}
          <div className={styles.card2}>
            <h2 className={styles.pageTitle}>Blog manager</h2>
            <div className={styles.blogGrid}>
              {visiblePosts.map((post) => (
                <div key={post.key} className={styles.blogCard}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className={styles.blogImage}
                  />
                  <span className={styles.blogType}>{post.type}</span>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <span className={styles.blogDate}>{post.date}</span>
                  <div className={styles.cardActions}>
                    <Button
                      style={{
                        backgroundColor: "#16a34a",
                        color: "#fff",
                        border: "none",
                      }}
                      onClick={() =>
                        navigate(`${ROUTES.BLOG_MANAGER}/edit/${post.id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure to delete this?"
                      onConfirm={() => handleDelete(post)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < allPosts.length && (
              <button
                className={styles.loadMore}
                onClick={() => setVisibleCount((c) => c + 9)}
              >
                Load more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
