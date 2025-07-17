import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../community/styleCommunityBlog.module.css";
import logoImg from "../../../../image/quit.png";
import post1Img from "../../../../image/smokingBlog.png";
import post2Img from "../../../../image/keepTower.png";
import post3Img from "../../../../image/carGirl.png";
import post4Img from "../../../../image/greenHouse.png";
import post5Img from "../../../../image/rockAndSun.png";
import post6Img from "../../../../image/blueCar.png";
import post7Img from "../../../../image/phone.png";
import post8Img from "../../../../image/beach.png";
import post9Img from "../../../../image/gameTool.png";
import avatarTracey from "../../../../image/avt.png";
import avatarJason from "../../../../image/avt2.png";
import avatarElizabeth from "../../../../image/avt3.png";
import avatarErnie from "../../../../image/avt.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

// helper decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const staticPosts = [
  {
    id: 1,
    title: "Smoke-Free, Stress-Free: How to Quit Without Losing Your Mind",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    type: "Coach",
    image: post5Img,
    avatar: avatarJason,
  },
  {
    id: 2,
    title: "Kick the Cigarette, Keep Your Power: Reclaim Your Health",
    author: "Jason Francisco",
    date: "August 20, 2022",
    type: "Member",
    image: post3Img,
    avatar: avatarElizabeth,
  },
  {
    id: 3,
    title:
      "The Quitter's Guide: Empowering Stories and Support to Help You Quit",
    author: "Elizabeth Slavin",
    date: "August 20, 2022",
    type: "Member",
    image: post7Img,
    avatar: avatarTracey,
  },
  {
    id: 4,
    title: "Breathe Free: Your Journey to a Smoke-Free Life Starts Today",
    author: "Ernie Smith",
    date: "August 20, 2022",
    type: "Member",
    image: post9Img,
    avatar: avatarErnie,
  },
  {
    id: 5,
    title: "Breaking the Habit: Proven Strategies to Quit Smoking for Good",
    author: "Ernie Smith",
    date: "August 20, 2022",
    type: "Coach",
    image: post2Img,
    avatar: avatarJason,
  },
  {
    id: 6,
    title: "From Cravings to Confidence: Real Tips for Quitting Smoking",
    author: "Tracey Wilson",
    date: "August 20, 2022",
    type: "Member",
    image: post4Img,
    avatar: avatarElizabeth,
  },
  {
    id: 7,
    title: "One Puff Closer to Freedom: Why Now Is the Time to Quit",
    author: "Jason Francisco",
    date: "August 20, 2022",
    type: "Member",
    image: post6Img,
    avatar: avatarTracey,
  },
  {
    id: 8,
    title: "Life After Cigarettes: What to Expect and How to Thrive",
    author: "Elizabeth Slavin",
    date: "August 20, 2022",
    type: "Coach",
    image: post8Img,
    avatar: avatarErnie,
  },
  {
    id: 9,
    title: "Lighting Up a New Life: The Ultimate Smoking Cessation Resource",
    author: "Ernie Smith",
    date: "August 20, 2022",
    type: "Coach",
    image: post1Img,
    avatar: avatarJason,
  },
  {
    id: 10,
    title: "Quit Smoking: Small Steps to Big Wins",
    author: "Tracey Wilson",
    date: "September 10, 2022",
    type: "Coach",
    image: post7Img,
    avatar: avatarTracey,
  },
  {
    id: 11,
    title: "Healthy Lungs, Happy Life",
    author: "Jason Francisco",
    date: "September 12, 2022",
    type: "Member",
    image: post2Img,
    avatar: avatarErnie,
  },
  {
    id: 12,
    title: "The Power of Support When You Quit",
    author: "Elizabeth Slavin",
    date: "September 14, 2022",
    type: "Member",
    image: post5Img,
    avatar: avatarElizabeth,
  },
  {
    id: 13,
    title: "Your Freedom Plan Starts Today",
    author: "Ernie Smith",
    date: "September 16, 2022",
    type: "Member",
    image: post9Img,
    avatar: avatarJason,
  },
  {
    id: 14,
    title: "Science-Backed Methods to Quit",
    author: "Ernie Smith",
    date: "September 18, 2022",
    type: "Coach",
    image: post3Img,
    avatar: avatarErnie,
  },
  {
    id: 15,
    title: "Stay Motivated to Be Smoke-Free",
    author: "Tracey Wilson",
    date: "September 20, 2022",
    type: "Coach",
    image: post8Img,
    avatar: avatarElizabeth,
  },
  {
    id: 16,
    title: "Cravings: Tame the Beast",
    author: "Jason Francisco",
    date: "September 22, 2022",
    type: "Member",
    image: post4Img,
    avatar: avatarJason,
  },
  {
    id: 17,
    title: "Life Beyond Addiction",
    author: "Elizabeth Slavin",
    date: "September 24, 2022",
    type: "Coach",
    image: post6Img,
    avatar: avatarTracey,
  },
  {
    id: 18,
    title: "Building Habits That Last",
    author: "Ernie Smith",
    date: "September 26, 2022",
    type: "Coach",
    image: post1Img,
    avatar: avatarErnie,
  },
  {
    id: 19,
    title: "Get Back on Track After Relapse",
    author: "Tracey Wilson",
    date: "October 2, 2022",
    type: "Coach",
    image: post9Img,
    avatar: avatarElizabeth,
  },
  {
    id: 20,
    title: "New You, New Health",
    author: "Jason Francisco",
    date: "October 4, 2022",
    type: "Member",
    image: post2Img,
    avatar: avatarJason,
  },
  {
    id: 21,
    title: "Kick the Habit for Good",
    author: "Elizabeth Slavin",
    date: "October 6, 2022",
    type: "Member",
    image: post7Img,
    avatar: avatarTracey,
  },
  {
    id: 22,
    title: "Start Fresh, Start Today",
    author: "Ernie Smith",
    date: "October 8, 2022",
    type: "Member",
    image: post5Img,
    avatar: avatarErnie,
  },
  {
    id: 23,
    title: "Quitting as a Team: Success Stories",
    author: "Ernie Smith",
    date: "October 10, 2022",
    type: "Coach",
    image: post3Img,
    avatar: avatarElizabeth,
  },
  {
    id: 24,
    title: "Stay Strong When Urges Hit",
    author: "Tracey Wilson",
    date: "October 12, 2022",
    type: "Coach",
    image: post4Img,
    avatar: avatarTracey,
  },
  {
    id: 25,
    title: "Celebrate Smoke-Free Milestones",
    author: "Jason Francisco",
    date: "October 14, 2022",
    type: "Member",
    image: post6Img,
    avatar: avatarJason,
  },
  {
    id: 26,
    title: "Freedom Feels Better Every Day",
    author: "Elizabeth Slavin",
    date: "October 16, 2022",
    type: "Coach",
    image: post8Img,
    avatar: avatarElizabeth,
  },
  {
    id: 27,
    title: "The Final Goodbye to Cigarettes",
    author: "Ernie Smith",
    date: "October 18, 2022",
    type: "Coach",
    image: post1Img,
    avatar: avatarErnie,
  },
];

export default function BlogService() {
  const navigate = useNavigate();
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(9);
  const [dynamicPosts, setDynamicPosts] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);

  const avatars = [avatarTracey, avatarJason, avatarElizabeth, avatarErnie];

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
          type: b.role === 1 ? "Coach" : "Member",
          image: `http://localhost:8080${b.bannerPath}`,
          avatar: avatars[Math.floor(Math.random() * avatars.length)],
        }));
        setDynamicPosts(data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      }
    };
    fetchBlogs();
  }, []);
  // avoid duplicates: drop static posts whose id appears in dynamic
  const mergedPosts = useMemo(() => {
    const dynIds = new Set(dynamicPosts.map((p) => p.id));
    return [
      ...dynamicPosts,
      ...staticPosts.filter((p) => !dynIds.has(p.id)),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
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
        {localStorage.getItem("token") ? (
          <div className={styles.groupBtn}>
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

      <div className={styles.fullPage}>
        <div className={styles.pageWrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>Our community blogs</h2>
            <p className={styles.subtitle}>
              Clinical excellence must be the priority for any health care
              service
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
                    className={
                      tab === label ? styles.activeNav : styles.navItem
                    }
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
                        image: p.image,
                        avatar: p.avatar,
                        type: p.type,
                        title: p.title,
                        subtitle: p.subtitle,
                        story: p.story,
                        author: p.author,
                        date: p.date,
                      },
                    })
                  }
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className={styles.cardImage}
                  />
                  <span className={styles.planCardLabel}>{p.type}</span>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  {p.subtitle && (
                    <p className={styles.subtitle}>{p.subtitle}</p>
                  )}
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
        </div>
      </div>
    </div>
  );
}
