// src/Pages/adminCoachProfile/AdminCoachProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Select,
} from "antd";
import axios from "../../../configs/axios"; // assumes baseURL="/api"
import AppLayout from "../../../components/layout/AppLayout";

const { Option } = Select;

export default function AdminCoachProfile() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [coaches, setCoaches] = useState([]); // { id, name }
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form] = Form.useForm();

  // Load profiles and coach users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, uRes] = await Promise.all([
        axios.get("/coach"), // GET /api/coach
        axios.get("/users"), // GET /api/users
      ]);

      // Flatten coachProfile.user.userID → coachID, userId, etc.
      const flat = pRes.data.map((cp) => ({
        coachID: cp.coachID,
        userId: cp.user?.userID ?? null,
        biography: cp.biography,
        expertise: cp.expertise,
        yearsOfExperience: cp.yearsOfExperience,
      }));
      setProfiles(flat);
      setFilteredProfiles(flat);

      // Build coach lookup list (role === 2)
      const coachUsers = uRes.data
        .filter((u) => u.role === 2)
        .map((u) => ({ id: u.userID, name: u.username }));
      setCoaches(coachUsers);
    } catch (e) {
      message.error("Load failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Coach ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Username",
      dataIndex: "userId",
      key: "username",
      render: (uid) => {
        const user = coaches.find((c) => c.id === uid);
        return user ? user.name : "—";
      },
    },
    {
      title: "Biography",
      dataIndex: "biography",
      key: "biography",
    },
    {
      title: "Expertise",
      dataIndex: "expertise",
      key: "expertise",
    },
    {
      title: "Years of Exp.",
      dataIndex: "yearsOfExperience",
      key: "yearsOfExperience",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space size="middle">
          <Button type="primary" onClick={() => openForm(rec)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this profile?"
            onConfirm={() => handleDelete(rec.coachID)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger ghost>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Open modal for add or edit
  const openForm = (rec = null) => {
    setEditingProfile(rec);
    if (rec) {
      form.setFieldsValue({
        coachID: rec.coachID,
        userId: rec.userId,
        biography: rec.biography,
        expertise: rec.expertise,
        yearsOfExperience: rec.yearsOfExperience,
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    try {
      const vals = await form.validateFields();

      const payload = {
        user: { userID: vals.userId },
        biography: vals.biography,
        expertise: vals.expertise,
        yearsOfExperience: vals.yearsOfExperience,
      };

      if (editingProfile) {
        await axios.put(`/coach/${editingProfile.coachID}`, payload);
        message.success("Coach profile updated.");
      } else {
        await axios.post("/coach", payload);
        message.success("Coach profile created.");
      }

      await fetchData();
      setModalVisible(false);
    } catch (e) {
      message.error("Save failed: " + e.message);
    }
  };

  // Delete profile
  const handleDelete = async (coachID) => {
    try {
      await axios.delete(`/coach/${coachID}`);
      message.success("Coach profile deleted.");
      await fetchData();
    } catch (e) {
      message.error("Delete failed: " + e.message);
    }
  };

  // Search by coach ID
  const onSearch = (term) => {
    const t = term.trim();
    setFilteredProfiles(
      t === ""
        ? profiles
        : profiles.filter((p) => p.userId?.toString().includes(t))
    );
  };

  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input.Search
          placeholder="Coach ID"
          style={{ width: 300 }}
          onSearch={onSearch}
          allowClear
        />
        <Button type="primary" onClick={() => openForm()}>
          Add Coach Profile
        </Button>
      </div>

      <Table
        rowKey="coachID"
        dataSource={filteredProfiles}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProfile ? "Edit Coach Profile" : "New Coach Profile"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="Coach User"
            rules={[{ required: true, message: "Please select a coach user." }]}
          >
            <Select
              placeholder="Select a coach"
              showSearch
              optionFilterProp="children"
            >
              {coaches.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="biography"
            label="Biography"
            rules={[{ required: true, message: "Please enter biography." }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="expertise"
            label="Expertise"
            rules={[{ required: true, message: "Please enter expertise." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="yearsOfExperience"
            label="Years of Experience"
            rules={[
              { required: true, message: "Please enter years of experience." },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}
