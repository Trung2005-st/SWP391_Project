import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "../styleBlogManager.module.css";
import avt1 from "../../../../image/avt.png";
import avt2 from "../../../../image/avt2.png";
import { ROUTES } from "../../../configs/routes";
import api from "../../../configs/axios";
import FullPageLayout from "../../../components/layout/UserLayOut";
import UserSidebarLayout from "../../../components/layout/UserSidebar";

const AVATAR_MOCKS = [avt1, avt2];

function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
function formatTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AppointmentList() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchUserAndAppointments() {
      try {
        const resUser = await api.get("/users/me", {
          headers: { Authorization: "Bearer " + token },
        });
        setUser(resUser.data);

        const url =
          resUser.data.role === 2
            ? "/appointments/for-coach"
            : "/appointments/my";
        const resApp = await api.get(url, {
          headers: { Authorization: "Bearer " + token },
        });
        setAppointments(resApp.data || []);
      } catch (e) {
        setUser(null);
        setAppointments([]);
      }
    }

    if (token) fetchUserAndAppointments();
  }, [token]);

  const isCoach = user?.role === 2;

  const handleMeet = (item) => {
    if (item.meetUrl) {
      window.open(item.meetUrl, "_blank");
    } else {
      alert("Google Meet chưa sẵn sàng cho lịch hẹn này!");
    }
  };

  const handleEdit = (item) => {
    navigate(ROUTES.APPOINTMENT_UPDATE, { state: { appointment: item } });
  };

  const handleView = (item) => {
    navigate(ROUTES.APPOINTMENT_VIEW, { state: { appointment: item } });
  };

  const handleCancel = async (item) => {
    try {
      await api.delete(`/appointments/${item.id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAppointments((prev) => prev.filter((a) => a.id !== item.id));
      message.success("Appointment cancelled successfully.");
    } catch (error) {
      message.error("Failed to cancel. Please try again.");
    }
  };

  function isMeetAvailable(appointmentDate) {
    if (!appointmentDate) return false;
    const now = new Date();
    const appt = new Date(appointmentDate);
    return now < new Date(appt.getTime() + 30 * 60000);
  }

  return (
    <FullPageLayout>
      <div className={styles.twoColumn}>
        <UserSidebarLayout />

        <div className={styles.card2} style={{ maxWidth: 1200 }}>
          <h2 className={styles.pageTitle} style={{ marginBottom: 24 }}>
            Appointment
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 5px 16px rgba(8,15,52,0.08)",
              padding: "32px 0",
              maxWidth: 1200,
              margin: "10 auto",
            }}
          >
            {appointments.length === 0 && (
              <div style={{ textAlign: "center", padding: 40 }}>
                No appointments found.
              </div>
            )}
            {appointments.map((item) => {
              const avatar =
                AVATAR_MOCKS[
                  ((isCoach ? item.userName : item.doctorName)?.length || 0) %
                    AVATAR_MOCKS.length
                ];
              const displayName = isCoach
                ? item.userName || "Unknown"
                : item.doctorName || "Unknown";
              const isAvailable = isMeetAvailable(item.appointmentDate);

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    borderRadius: 16,
                    padding: "16px 24px",
                    background: isAvailable
                      ? "linear-gradient(90deg, #e7fbee, #e6fef1)"
                      : "linear-gradient(90deg, #e0edfa, #e8f1fa)",
                    boxShadow: "0 2px 12px 0 rgba(20, 61, 50, 0.04)",
                    width: "90%", // 👈 chiếm gần hết chiều ngang
                    margin: "0 auto", // 👈 căn giữa trong thẻ cha
                  }}
                >
                  <Avatar src={avatar} size={44} />
                  <div style={{ marginLeft: 20, flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 2,
                        color: "#1f2041",
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#63667c",
                        marginBottom: 2,
                      }}
                    >
                      {formatTime(item.appointmentDate)}{" "}
                      <span style={{ color: "#aaa" }}>
                        {formatDate(item.appointmentDate)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="large"
                    style={{
                      background: isAvailable ? "#16a34a" : "#e5e7eb",
                      color: isAvailable ? "#fff" : "#737373",
                      fontWeight: 600,
                      borderRadius: 16,
                      width: 110,
                      marginLeft: 20,
                      fontSize: 16,
                      boxShadow: isAvailable ? "0 2px 8px #b8efc2" : undefined,
                    }}
                    disabled={!isAvailable}
                    onClick={() => handleMeet(item)}
                  >
                    Meet
                  </Button>
                  {isCoach && (
                    <Button
                      size="large"
                      style={{
                        background: isAvailable ? "#2563eb" : "#e5e7eb",
                        color: isAvailable ? "#fff" : "#737373",
                        fontWeight: 600,
                        borderRadius: 16,
                        minWidth: 75,
                        fontSize: 16,
                      }}
                      disabled={!isAvailable}
                      icon={<EditOutlined />}
                      onClick={() => handleView(item)}
                    >
                      View Info
                    </Button>
                  )}
                  {!isCoach && (
                    <div style={{ display: "flex", gap: 10, marginLeft: 8 }}>
                      <Button
                        size="large"
                        style={{
                          background: isAvailable ? "#2563eb" : "#e5e7eb",
                          color: isAvailable ? "#fff" : "#737373",
                          fontWeight: 600,
                          borderRadius: 16,
                          minWidth: 75,
                          fontSize: 16,
                        }}
                        disabled={!isAvailable}
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        title="Are you sure you want to cancel this appointment?"
                        onConfirm={() => handleCancel(item)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          size="large"
                          style={{
                            background: isAvailable ? "#dc2626" : "#e5e7eb",
                            color: isAvailable ? "#fff" : "#737373",
                            fontWeight: 600,
                            borderRadius: 16,
                            minWidth: 75,
                            fontSize: 16,
                          }}
                          disabled={!isAvailable}
                          icon={<DeleteOutlined />}
                        >
                          Cancel
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FullPageLayout>
  );
}
