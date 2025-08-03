import React from "react";
import { NavLink } from "react-router-dom";
import {
  UserOutlined,
  EditOutlined,
  BellOutlined,
  InboxOutlined,
  MessageOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import styles from "./profileLayout.module.css";
import { ROUTES } from "../../configs/routes";

export default function UserSidebarLayout() {
  const menuItems = [
    {
      label: "Profile",
      icon: <UserOutlined />,
      to: ROUTES.PROFILE_PAGE,
    },
    {
      label: "Blog manager",
      icon: <EditOutlined />,
      to: ROUTES.BLOG_MANAGER,
    },
    {
      label: "Notification",
      icon: <BellOutlined />,
      to: ROUTES.NOTIFICATION,
    },
    {
      label: "Archive",
      icon: <InboxOutlined />,
      to: ROUTES.ARCHIVE_PAGE,
    },
    {
      label: "Feedback",
      icon: <MessageOutlined />,
      to: ROUTES.FEEDBACK,
    },
    {
      label: "Appointment",
      icon: <ScheduleOutlined />,
      to: ROUTES.APPOINTMENT_LIST,
    },
  ];

  return (
    <div className={styles.sidebarContainer}>
           {" "}
      <nav className={styles.sidebar}>
               {" "}
        <ul>
                   {" "}
          {menuItems.map((item) => (
            <li key={item.to}>
                           {" "}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.sidebarItem} ${styles.active}`
                    : styles.sidebarItem
                }
              >
                                <span className={styles.icon}>{item.icon}</span>
                               {" "}
                <span className={styles.label}>{item.label}</span>           
                 {" "}
              </NavLink>
                         {" "}
            </li>
          ))}
                 {" "}
        </ul>
             {" "}
      </nav>
         {" "}
    </div>
  );
}
