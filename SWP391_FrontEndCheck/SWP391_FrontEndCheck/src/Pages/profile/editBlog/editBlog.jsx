import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { notification } from "antd";
import styles from "../../community/styleCreateBlog.module.css";
import FullPageLayout from "../../../components/layout/UserLayOut";
import { ROUTES } from "../../../configs/routes";

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [story, setStory] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPath, setBannerPath] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/blogs/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setSubtitle(data.subtitle);
        setStory(data.story); // hoặc data.content nếu backend trả về như vậy
        setBannerPath(data.bannerPath);
      })
      .catch(() => {
        notification.error({
          message: "Error",
          description: "Failed to fetch blog data.",
        });
      });
  }, [id, token]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setBanner(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !subtitle.trim() ||
      !story.trim() ||
      story === "<p></p>"
    ) {
      alert("Please fill in all fields.");
      return;
    }

    let newBannerPath = bannerPath;

    if (banner) {
      const formData = new FormData();
      formData.append("file", banner);

      try {
        const uploadRes = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (uploadRes.ok) {
          newBannerPath = await uploadRes.text();
          setBannerPath(newBannerPath); // cập nhật ảnh preview
        } else {
          alert("Banner upload failed.");
          return;
        }
      } catch (err) {
        alert("Banner upload error.");
        return;
      }
    }

    try {
      const res = await fetch(`http://localhost:8080/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          subtitle,
          story,
          bannerPath: newBannerPath,
        }),
      });

      if (res.ok) {
        notification.success({
          message: "Success",
          description: "Blog updated successfully.",
        });
        navigate(ROUTES.BLOG_MANAGER);
      } else {
        throw new Error();
      }
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to update blog.",
      });
    }
  };

  return (
    <FullPageLayout>
      <div className={styles.card}>
        <div className={styles.greenHeader}>
          <h2 className={styles.greenTitle}>Edit Your Story</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Enter your blog title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />

          <label className={styles.label}>Enter your blog subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={styles.input}
            required
          />

          <label className={styles.label}>
            Upload an image for your blog banner
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenFile}
            accept="image/*"
          />
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current.click()}
          >
            Upload from my device ⬆️
          </button>

          {banner ? (
            <div className={styles.preview}>
              <strong>Selected:</strong> {banner.name}
              <div style={{ marginTop: 10 }}>
                <img
                  src={URL.createObjectURL(banner)}
                  alt="New Banner Preview"
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ) : (
            bannerPath && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={`http://localhost:8080${bannerPath}`}
                  alt="Current Banner"
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )
          )}

          <label className={styles.label}>Your story</label>
          <Editor
            apiKey="soignbkqf94dvep4irbnqwcl0bzoz2tpw69beym200w0e1ac"
            value={story}
            onEditorChange={(newValue) => setStory(newValue)}
            init={{
              height: 300,
              menubar: "edit format insert view tools table help",
              plugins: [
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic underline | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
            }}
          />

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.BLOG_SERVICE)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </FullPageLayout>
  );
}
