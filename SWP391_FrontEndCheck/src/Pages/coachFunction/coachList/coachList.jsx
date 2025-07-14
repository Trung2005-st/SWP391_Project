// src/Pages/community/DoctorService.jsx
import React, { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../coachFunction/styleAfterProgress.module.css";
import logoImg from "../../../../image/quit.png";
import doctorIcon from "../../../../image/maleDoctor.png";
import { ROUTES } from "../../../configs/routes";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

// 27 mock doctors (vẫn giữ nguyên biến `doctors` và nội dung array)
const doctors = [
  {
    id: 1,
    name: "Dr. Do Thi Tuong Oanh",
    specialty: "Pulmonology",
    rating: 4.8,
    reviews: 32,
    experience: 33,
    institution: "HCM University of Medicine and Pharmacy",
  },
  {
    id: 2,
    name: "Dr. Nguyen Duc Bang",
    specialty: "Pediatrics",
    rating: 4.7,
    reviews: 28,
    experience: 32,
    institution: "Phan Thiet Hospital",
  },
  {
    id: 3,
    name: "Dr. Vo Kim Tuyen",
    specialty: "Pediatrics",
    rating: 4.6,
    reviews: 25,
    experience: 20,
    institution: "Cheryl Hospital",
  },
  {
    id: 4,
    name: "Dr. Christine Jones",
    specialty: "Pulmonology",
    rating: 4.9,
    reviews: 40,
    experience: 22,
    institution: "City Hospital",
  },
  {
    id: 5,
    name: "Dr. Anthony Nguyen",
    specialty: "Pediatrics",
    rating: 4.5,
    reviews: 18,
    experience: 15,
    institution: "Hanoi Pediatrics",
  },
  {
    id: 6,
    name: "Dr. Linda Tran",
    specialty: "Pulmonology",
    rating: 4.8,
    reviews: 35,
    experience: 26,
    institution: "Hanoi Medical School",
  },
  {
    id: 7,
    name: "Dr. John Smith",
    specialty: "Pulmonology",
    rating: 4.7,
    reviews: 38,
    experience: 30,
    institution: "Cheryl Hospital",
  },
  {
    id: 8,
    name: "Dr. Mary Le",
    specialty: "Pediatrics",
    rating: 4.6,
    reviews: 29,
    experience: 14,
    institution: "Phan Thiet Hospital",
  },
  {
    id: 9,
    name: "Dr. Bruce Wayne",
    specialty: "Pulmonology",
    rating: 4.9,
    reviews: 50,
    experience: 28,
    institution: "City Hospital",
  },
  {
    id: 10,
    name: "Dr. Emily Nguyen",
    specialty: "Pediatrics",
    rating: 4.8,
    reviews: 41,
    experience: 24,
    institution: "Children’s Medical Center",
  },
  {
    id: 11,
    name: "Dr. Steven Vo",
    specialty: "Pulmonology",
    rating: 4.7,
    reviews: 32,
    experience: 18,
    institution: "Cheryl Hospital",
  },
  {
    id: 12,
    name: "Dr. Angela Le",
    specialty: "Pediatrics",
    rating: 4.8,
    reviews: 45,
    experience: 19,
    institution: "Children’s Medical Center",
  },
  {
    id: 13,
    name: "Dr. William Tran",
    specialty: "Pulmonology",
    rating: 4.5,
    reviews: 27,
    experience: 25,
    institution: "HCM University of Medicine",
  },
  {
    id: 14,
    name: "Dr. Patricia Ho",
    specialty: "Pediatrics",
    rating: 4.9,
    reviews: 39,
    experience: 21,
    institution: "City Hospital",
  },
  {
    id: 15,
    name: "Dr. Monica Pham",
    specialty: "Pulmonology",
    rating: 4.6,
    reviews: 30,
    experience: 23,
    institution: "Phan Thiet Hospital",
  },
  {
    id: 16,
    name: "Dr. Ross Geller",
    specialty: "Pediatrics",
    rating: 4.7,
    reviews: 34,
    experience: 17,
    institution: "Hanoi Pediatrics",
  },
  {
    id: 17,
    name: "Dr. Rachel Green",
    specialty: "Pulmonology",
    rating: 4.8,
    reviews: 37,
    experience: 27,
    institution: "City Hospital",
  },
  {
    id: 18,
    name: "Dr. Phoebe Buffay",
    specialty: "Pediatrics",
    rating: 4.5,
    reviews: 22,
    experience: 16,
    institution: "Cheryl Hospital",
  },
  {
    id: 19,
    name: "Dr. Chandler Bing",
    specialty: "Pulmonology",
    rating: 4.8,
    reviews: 29,
    experience: 19,
    institution: "HCM University of Medicine",
  },
  {
    id: 20,
    name: "Dr. Joey Tribbiani",
    specialty: "Pediatrics",
    rating: 4.7,
    reviews: 33,
    experience: 14,
    institution: "Children’s Medical Center",
  },
  {
    id: 21,
    name: "Dr. Kevin Nguyen",
    specialty: "Pulmonology",
    rating: 4.6,
    reviews: 26,
    experience: 22,
    institution: "Phan Thiet Hospital",
  },
  {
    id: 22,
    name: "Dr. Sophie Tran",
    specialty: "Pediatrics",
    rating: 4.9,
    reviews: 47,
    experience: 29,
    institution: "City Hospital",
  },
  {
    id: 23,
    name: "Dr. David Pham",
    specialty: "Pulmonology",
    rating: 4.5,
    reviews: 21,
    experience: 20,
    institution: "Cheryl Hospital",
  },
  {
    id: 24,
    name: "Dr. Anna Hoang",
    specialty: "Pediatrics",
    rating: 4.8,
    reviews: 42,
    experience: 18,
    institution: "Children’s Medical Center",
  },
  {
    id: 25,
    name: "Dr. Peter Tran",
    specialty: "Pulmonology",
    rating: 4.7,
    reviews: 31,
    experience: 24,
    institution: "Hanoi Medical School",
  },
  {
    id: 26,
    name: "Dr. Natalie Le",
    specialty: "Pediatrics",
    rating: 4.6,
    reviews: 28,
    experience: 23,
    institution: "City Hospital",
  },
  {
    id: 27,
    name: "Dr. Benjamin Hoang",
    specialty: "Pulmonology",
    rating: 4.8,
    reviews: 35,
    experience: 26,
    institution: "HCM University of Medicine",
  },
];

export default function CoachList() {
  const navigate = useNavigate();
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  // token state for conditional header
  const [token, setToken] = useState(localStorage.getItem("token"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) &&
          (expertise === "" || d.specialty === expertise) &&
          d.experience >= experience
      ),
    [search, expertise, experience]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
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
                  Coach Service
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
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => navigate(ROUTES.PROGRESS_STEP1)}
          >
            Get Started
          </button>
        )}
      </header>

      {/* CONTENT */}
      <div className={styles.pageWrapper}>
        <div className={styles.card} style={{ padding: 32 }}>
          <h2 className={styles.title}>Our Qualified Coaches list</h2>
          <p className={styles.subtitle}>
            Clinical excellence must be the priority for any health care service
          </p>

          {/* FILTER BAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ position: "relative", flex: "0 0 360px" }}>
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 12,
                    transform: "translateY(-50%)",
                    fontSize: 18,
                    color: "#6b7280",
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for coach name"
                  style={{
                    width: "100%",
                    padding: "10px 16px 10px 40px",
                    borderRadius: 9999,
                    border: "2px solid #000",
                    outline: "none",
                  }}
                />
              </div>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 9999,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  minWidth: 160,
                }}
              >
                <option value="">Expertise</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ color: "#374151" }}>0 years</span>
              <input
                type="range"
                min={0}
                max={40}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                style={{ width: 200, accentColor: "#00D1A1" }}
              />
              <span style={{ color: "#374151" }}>40 years</span>
            </div>
          </div>

          {/* GRID */}
          <div className={styles.planSupportGrid} style={{ marginTop: 32 }}>
            {currentData.map((d) => (
              <div
                key={d.id}
                className={styles.planCard}
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => navigate(`${ROUTES.CHAT}/${d.id}`)}
              >
                <img
                  src={doctorIcon}
                  alt={d.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <h3 className={styles.cardTitle}>{d.name}</h3>
                <p className={styles.cardText}>{d.specialty}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ color: "#FAC64B" }}>★</span>
                  <span style={{ fontWeight: 600 }}>{d.rating}</span>
                  <span style={{ color: "#6b7280" }}>({d.reviews})</span>
                </div>
                <p className={styles.cardText}>
                  {d.experience} years of experience
                </p>
                <p className={styles.cardText} style={{ color: "#6b7280" }}>
                  {d.institution}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div
            className={styles.pagination}
            style={{ marginTop: 32, textAlign: "center" }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={currentPage === idx + 1 ? styles.activePage : ""}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
