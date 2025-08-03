import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../coachFunction/styleAfterProgress.module.css";
import doctorIcon from "../../../../image/maleDoctor.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";

const randomRating = () => (Math.random() * 1 + 4).toFixed(1);
const randomReviews = () => Math.floor(Math.random() * 50) + 10;

export default function DoctorService() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/coach").then((res) => {
      const mapped = (res.data || []).map((c) => ({
        id: c.coachID,
        userID: c.coachID,
        firstName: c.firstName,
        lastName: c.lastName,
        name: `${c.firstName} ${c.lastName}`,
        specialty: c.expertise,
        experience: c.yearsOfExperience,
        institution: c.institution,
        biography: c.biography,
        rating: randomRating(),
        reviews: randomReviews(),
        avatar: doctorIcon,
      }));
      setDoctors(mapped);
      setLoading(false);
    });
  }, []);

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
    <FullPageLayout>
      <div className={styles.card} style={{ padding: 32 }}>
        <h2 className={styles.title}>Our Qualified Doctors list</h2>
        <p className={styles.subtitle}>
          Clinical excellence must be the priority for any health care service
        </p>

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
              <option value="Nutrition">Nutrition</option>
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
    </FullPageLayout>
  );
}
