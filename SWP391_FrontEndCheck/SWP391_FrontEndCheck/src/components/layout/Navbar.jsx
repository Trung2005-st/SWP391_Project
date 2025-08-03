import React, { useEffect, useState } from "react";
import { Space, Avatar, Dropdown, Spin } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../configs/routes";
import api from "../../configs/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // dùng state local
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    // Nếu dùng Redux thì gọi dispatch(logout()) ở đây luôn
    navigate("/login");
  };

  const handleProfile = () => {
    navigate(ROUTES.PROFILE_PAGE);
  };

  const items = [
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: <span onClick={handleProfile}>Profile</span>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  // Nếu đang loading thì show spinner
  if (loading) {
    return (
      <Space size="middle">
        <Spin size="small" />
      </Space>
    );
  }

  // Nếu chưa có user (token lỗi, hết hạn)
  if (!user) {
    return null;
  }

  return (
    <Space size="middle">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <span
          className="navbarUser"
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Avatar className="customAvatar" icon={<UserOutlined />} />
          <div className="navbarUser-info" style={{ marginLeft: 8 }}>
            <div className="navbarUser-name">{user.username}</div>
            <div className="navbarUser-email">{user.email}</div>
          </div>
        </span>
      </Dropdown>
    </Space>
  );
}
