import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";

function AdminMembership() {
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [editingPlanID, setEditingPlanID] = useState(null);

  const columns = [
    {
      title: "Id",
      dataIndex: "planID",
      key: "planID",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this membership?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(record.planID)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/membership");
      setDataSource(response.data);
    } catch (error) {
      console.error("Fetch membership failed:", error);
      message.error("Failed to load memberships!");
      setDataSource([]);
    }
  };

  const onEdit = (record) => {
    setEditingPlanID(record.planID);
    setOpen(true);
    form.setFieldsValue(record);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/membership/${id}`);
      message.success("Deleted successfully!");
      fetchMemberships();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Delete failed!");
    }
  };

  const onAddOrUpdate = async (values) => {
    try {
      if (editingPlanID) {
        await axios.put(
          `http://localhost:8080/api/membership/${editingPlanID}`,
          values
        );
        message.success("Membership updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/membership", values);
        message.success("Membership added successfully!");
      }
      form.resetFields();
      setOpen(false);
      setEditingPlanID(null);
      fetchMemberships();
    } catch (error) {
      console.error(
        "Error with Axios request:",
        error.response ? error.response.data : error.message
      );
      message.error("Operation failed!");
    }
  };

  const searchMembershipById = async (membershipId) => {
    const trimmedMembershipId = membershipId.trim();
    if (!trimmedMembershipId) {
      // Nếu input rỗng thì load lại tất cả membership
      fetchMemberships();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/membership/${trimmedMembershipId}`
      );
      setDataSource([response.data]);
    } catch (error) {
      console.error("Search membership failed:", error);
      message.error("Membership not found!");
      setDataSource([]);
    }
  };

  return (
    <AppLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Input.Search
            placeholder="Enter membership ID"
            allowClear
            style={{ width: 300 }}
            onSearch={searchMembershipById}
          />

          <Button type="primary" onClick={() => setOpen(true)}>
            Add membership
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 6 }}
          rowKey="planID"
        />

        <Modal
          title={editingPlanID ? "Edit Membership" : "Add Membership"}
          open={open}
          onCancel={() => {
            setOpen(false);
            form.resetFields();
            setEditingPlanID(null);
          }}
          onOk={() => form.submit()}
        >
          <Form layout="vertical" onFinish={onAddOrUpdate} form={form}>
            <Form.Item
              label="Plan ID"
              name="planID"
              rules={[
                { required: true, message: "Please input membership plan ID!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input membership name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input membership description!",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input membership price!" },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Duration"
              name="duration"
              rules={[
                {
                  required: true,
                  message: "Please input membership duration!",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

export default AdminMembership;
