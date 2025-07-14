// src/components/header/Header.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);

  const isCommunityActive =
    location.pathname.startsWith("/coachList") ||
    location.pathname.startsWith("/blogService");

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".communityWrapper")) {
        setShowCommunityMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-img">
          <img className="element" src="/image/quit.png" alt="Lung logo" />
        </div>

        <div className="text-wrapper">QuitHub</div>
      </div>
      <div className="frame">
        <nav className="navbar">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-active" : "nav-inactive"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? "nav-active" : "nav-inactive"
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/progressStep1"
            className={({ isActive }) =>
              isActive ? "nav-active" : "nav-inactive"
            }
          >
            Plan
          </NavLink>
          <div className="communityWrapper">
            <span
              className={isCommunityActive ? "nav-active" : "nav-inactive"}
              onClick={(e) => {
                e.preventDefault();
                setShowCommunityMenu((prev) => !prev);
              }}
            >
              Community
            </span>
            {showCommunityMenu && (
              <div className="dropdownMenu show">
                <NavLink
                  to="/coachList"
                  className="dropdownItem"
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Doctor Service
                </NavLink>
                <NavLink
                  to="/blogService"
                  className="dropdownItem"
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Blog Service
                </NavLink>
                <NavLink
                  to="/encouragement"
                  className="dropdownItem"
                  onClick={() => setShowCommunityMenu(false)}
                >
                  Send Encouragement
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        {user ? (
          <>
            <NavLink
              to="/profile"
              className="dropdownItem"
              onClick={() => setShowCommunityMenu(false)}
            >
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
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-active" : "nav-inactive"
            }
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#52c41a", color: "#fff" }}
            >
              Get Started
            </Button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
