import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../coachFunction/styleAfterProgress.module.css";
import logoImg from "../../../../image/quit.png";
import doctorIcon from "../../../../image/maleDoctor.png";
import { ROUTES } from "../../../configs/routes";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";

// Random các trường mock
const randomRating = () => (Math.random() * 1 + 4).toFixed(1); // 4.0-5.0
const randomReviews = () => Math.floor(Math.random() * 50) + 10; // 10-59

export default function DoctorService() {
  const navigate = useNavigate();
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch từ API coach
  useEffect(() => {
    api.get("/coach").then((res) => {
      const mapped = (res.data || []).map((c, idx) => ({
        id: c.coachID, // chỉ để key FE, KHÔNG dùng gửi API
        userID: c.coachID, // <-- BẮT BUỘC, gửi sang trang đặt lịch dùng trường này
        firstName: c.firstName,
        lastName: c.lastName,
        name: `Dr. ${c.firstName} ${c.lastName}`,
        specialty: c.expertise,
        experience: c.yearsOfExperience,
        institution: c.institution,
        biography: c.biography,
        // Mock các trường FE tự sinh
        rating: randomRating(),
        reviews: randomReviews(),
        avatar: doctorIcon,
      }));
      setDoctors(mapped);
      setLoading(false);
    });
  }, []);

  const toggleCommunityMenu = (e) => {
    e.preventDefault();
    setShowCommunityMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate(ROUTES.HOME);
  };

  // Filter
  const filtered = useMemo(
    () =>
      doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) &&
          (expertise === "" || d.specialty === expertise) &&
          d.experience >= experience
      ),
    [search, expertise, experience, doctors]
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
          <h2 className={styles.title}>Our Qualified Doctors list</h2>
          <p className={styles.subtitle}>
            Clinical excellence must be the priority for any health care service
          </p>

          {/* FILTER BAR */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <div className={styles.searchInput}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for doctor name"
                />
              </div>
              <select
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className={styles.selectExpertise}
              >
                <option value="">Expertise</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Pediatrics">Pediatrics</option>
                {/* Thêm các chuyên môn khác nếu backend có */}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.rangeLabel}>0 years</span>
              <input
                type="range"
                min={0}
                max={40}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <span className={styles.rangeLabel}>40 years</span>
            </div>
          </div>

          {/* GRID */}
          <div className={styles.planSupportGrid}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 48 }}>Loading...</div>
            ) : currentData.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48 }}>
                No doctors found.
              </div>
            ) : (
              currentData.map((d) => (
                <div key={d.id} className={styles.cardItem}>
                  <img src={d.avatar} alt="" className={styles.cardAvatar} />
                  <h3 className={styles.cardName}>{d.name}</h3>
                  <p className={styles.cardSpec}>{d.specialty}</p>
                  <p className={styles.cardExp}>
                    {d.experience} years of experience
                  </p>
                  <div className={styles.cardRating}>
                    <span>★</span> <strong>{d.rating}</strong>{" "}
                    <span>({d.reviews})</span>
                  </div>
                  <button
                    className={styles.cardBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Chuyển đầy đủ thông tin doctor, ĐẶC BIỆT PHẢI CÓ userID
                      navigate(ROUTES.APPOINTMENT_FORM, {
                        state: { doctor: d },
                      });
                    }}
                  >
                    Make an appointment
                  </button>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
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
