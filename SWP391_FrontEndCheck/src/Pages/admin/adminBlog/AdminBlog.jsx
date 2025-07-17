import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  message,
  Avatar,
  Select,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import AppLayout from "../../../components/layout/AppLayout";
import api from "../../../configs/axios";
import styles from "./adminBlog.module.css";

const BLOG_TYPES = [
  { value: "ALL", label: "All" },
  { value: "COACH", label: "Coach" },
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [addModal, setAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Form states cho add blog
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [story, setStory] = useState("");
  const [banner, setBanner] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs/dto");
      setBlogs(res.data);
    } catch {
      message.error("Failed to load blogs!");
      setBlogs([]);
    }
  };

  // FILTER blogs
  useEffect(() => {
    let result = [...blogs];
    if (searchKey)
      result = result.filter(
        (b) =>
          (b.title &&
            b.title.toLowerCase().includes(searchKey.toLowerCase())) ||
          (b.subtitle &&
            b.subtitle.toLowerCase().includes(searchKey.toLowerCase()))
      );
    if (typeFilter !== "ALL") {
      result = result.filter(
        (b) =>
          (typeFilter === "COACH" && b.role === 1) ||
          (typeFilter === "MEMBER" && b.role === 2) ||
          (typeFilter === "ADMIN" && b.role === 3)
      );
    }
    setFiltered(result);
  }, [searchKey, blogs, typeFilter]);

  // RESET FORM khi mở modal add blog
  const openAddModal = () => {
    setTitle("");
    setSubtitle("");
    setStory("");
    setBanner(null);
    setAddModal(true);
  };

  // Handle chọn file banner
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setBanner(e.target.files[0]);
  };

  // ----- ADD BLOG SUBMIT -----
  const handleAddOk = async () => {
    if (!title.trim()) {
      message.warning("Please enter your blog title.");
      return;
    }
    if (!subtitle.trim()) {
      message.warning("Please enter your blog subtitle.");
      return;
    }
    if (!story.trim() || story === "<p></p>") {
      message.warning("Please share your story content.");
      return;
    }
    setAddLoading(true);

    let bannerPath = null;
    if (banner) {
      const formData = new FormData();
      formData.append("file", banner);

      try {
        const uploadRes = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (uploadRes.ok) {
          bannerPath = await uploadRes.text();
        } else {
          message.error("Banner upload failed.");
          setAddLoading(false);
          return;
        }
      } catch (err) {
        message.error("Banner upload error.");
        setAddLoading(false);
        return;
      }
    }

    // Gửi blog mới (dùng fetch, không cần userID, role, ...)
    try {
      const res = await fetch("http://localhost:8080/api/blogs/dto/my", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          subtitle,
          story,
          bannerPath,
        }),
      });
      if (res.ok) {
        message.success("Blog added successfully!");
        setAddModal(false);
        fetchBlogs();
      } else {
        message.error("Submit failed!");
      }
    } catch (err) {
      message.error("Error submitting blog!");
    } finally {
      setAddLoading(false);
    }
  };

  // ----- DELETE BLOG -----
  const handleDelete = async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      message.success("Blog deleted!");
      fetchBlogs();
    } catch {
      message.error("Delete failed!");
    }
  };

  return (
    <AppLayout>
      <div className={styles.adminPageRoot}>
        {/* DASHBOARD */}
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Total Blogs</span>
              <span className={styles.statValue}>{blogs.length}</span>
            </div>
            <span className={styles.statIcon}>
              <UserOutlined />
            </span>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Coach Blogs</span>
              <span className={styles.statValue} style={{ color: "#16a34a" }}>
                {blogs.filter((b) => b.role === 1).length}
              </span>
            </div>
            <span className={`${styles.statIcon} ${styles.green}`}>
              <UserOutlined />
            </span>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Member Blogs</span>
              <span className={styles.statValue} style={{ color: "#2196f3" }}>
                {blogs.filter((b) => b.role === 2).length}
              </span>
            </div>
            <span className={`${styles.statIcon} ${styles.red}`}>
              <UserOutlined />
            </span>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <span className={styles.statTitle}>Admin Blogs</span>
              <span className={styles.statValue} style={{ color: "#faad14" }}>
                {blogs.filter((b) => b.role === 3).length}
              </span>
            </div>
            <span
              className={styles.statIcon}
              style={{ background: "#fffbe6", color: "#faad14" }}
            >
              <UserOutlined />
            </span>
          </div>
        </div>

        {/* FILTER + ADD BTN ROW */}
        <div className={styles.filterRow}>
          <div className={styles.leftFilter}>
            <Input
              placeholder="Search blogs..."
              allowClear
              className={styles.searchInput}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Select
              className={styles.statusSelect}
              value={typeFilter}
              style={{ width: 110 }}
              onChange={setTypeFilter}
              options={BLOG_TYPES}
            />
          </div>
          <Button
            className={styles.addUserBtn}
            icon={<PlusOutlined />}
            onClick={openAddModal}
          >
            Add Blog
          </Button>
        </div>

        {/* BLOG GRID */}
        <div className={styles.userGrid}>
          {filtered.map((b) => (
            <div className={styles.userCard} key={b.blogID}>
              <div
                className={styles.userCardHeader}
                style={{ marginBottom: 12 }}
              >
                <div className={styles.userHeaderLeft}>
                  <Avatar
                    src={b.avatar || ""}
                    icon={<UserOutlined />}
                    className={styles.userAvatar}
                  />
                  <div className={styles.userMainInfo}>
                    <div className={styles.userName}>{b.title}</div>
                    <div className={styles.userEmail}>{b.subtitle || ""}</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color:
                      b.role === 1
                        ? "#16a34a"
                        : b.role === 2
                          ? "#2196f3"
                          : "#faad14",
                    fontWeight: 600,
                    background:
                      b.role === 1
                        ? "#e7fbee"
                        : b.role === 2
                          ? "#e8f1fe"
                          : "#fffbe6",
                    borderRadius: 5,
                    padding: "1.5px 9px 1.5px 7px",
                    marginTop: 4,
                  }}
                >
                  {b.role === 1
                    ? "Coach"
                    : b.role === 2
                      ? "Member"
                      : b.role === 3
                        ? "Admin"
                        : "Unknown"}
                </span>
              </div>
              {/* Banner */}
              {b.bannerPath && (
                <img
                  src={
                    b.bannerPath.startsWith("http")
                      ? b.bannerPath
                      : `http://localhost:8080${b.bannerPath}`
                  }
                  alt={b.title}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    marginBottom: 8,
                    height: 120,
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{ color: "#8a98bb", fontSize: 13, marginBottom: 4 }}>
                Author: {b.username || b.author || "Unknown"}
              </div>
              <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                Date:{" "}
                {b.createdAt
                  ? new Date(b.createdAt).toLocaleDateString("en-US")
                  : ""}
              </div>
              <Popconfirm
                title="Delete this blog?"
                okText="Yes"
                cancelText="No"
                icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => handleDelete(b.blogID)}
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  style={{
                    width: "100%",
                    fontWeight: 700,
                    marginTop: 7,
                    borderRadius: 7,
                    height: 36,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Remove
                </Button>
              </Popconfirm>
            </div>
          ))}
        </div>

        {/* ADD BLOG MODAL */}
        <Modal
          open={addModal}
          title="Add New Blog"
          onCancel={() => setAddModal(false)}
          onOk={handleAddOk}
          okText="Save"
          confirmLoading={addLoading}
          width={650}
          bodyStyle={{ padding: "28px 38px 10px 38px" }}
          destroyOnClose
        >
          <div>
            <label
              style={{ fontWeight: 600, marginBottom: 2, display: "block" }}
            >
              Blog Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your blog title"
              style={{ marginBottom: 14 }}
              required
            />

            <label
              style={{ fontWeight: 600, marginBottom: 2, display: "block" }}
            >
              Blog Subtitle
            </label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Your blog subtitle"
              style={{ marginBottom: 14 }}
              required
            />

            <label
              style={{ fontWeight: 600, marginBottom: 2, display: "block" }}
            >
              Upload an image for your blog banner
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              onClick={() => fileInputRef.current.click()}
              style={{
                fontWeight: 600,
                borderRadius: 7,
                marginBottom: 8,
                marginTop: 2,
                display: "block",
              }}
            >
              Upload from my device ⬆️
            </Button>
            {banner && (
              <div style={{ fontSize: 13, color: "#111", marginBottom: 6 }}>
                <strong>Selected:</strong> {banner.name}
              </div>
            )}

            <label
              style={{ fontWeight: 600, marginBottom: 2, display: "block" }}
            >
              Your story
            </label>
            <Editor
              apiKey="soignbkqf94dvep4irbnqwcl0bzoz2tpw69beym200w0e1ac"
              value={story}
              onEditorChange={(newValue) => setStory(newValue)}
              init={{
                height: 260,
                menubar: "edit format insert view tools table help",
                plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table help wordcount",
                  "format",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
              }}
            />
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
