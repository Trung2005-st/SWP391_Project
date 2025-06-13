import React from "react";
import { Button, Space } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Xử lý logout, ví dụ xóa token nếu cần
    console.log("Logged out");
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <Space>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Space>
  );
};

export default Navbar;
