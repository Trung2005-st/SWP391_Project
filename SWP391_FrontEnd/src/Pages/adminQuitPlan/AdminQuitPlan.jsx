import {
  Button,
  DatePicker,
  Form,
  Input,
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
import dayjs from "dayjs";

function AdminQuitPlan() {
  const [dataSource, setDataSource] = useState([]);
  const [plans, setPlans] = useState([]); // Danh sách membership plans
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [editingPlanID, setEditingPlanID] = useState(null);

  const columns = [
    {
      title: "Id",
      dataIndex: "quitID",
      key: "quitID",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => text?.split("T")[0], // Hiển thị ngày yyyy-mm-dd nếu cần
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => text?.split("T")[0],
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
    },
    {
      title: "Membership Plan",
      dataIndex: ["membershipPlan", "planName"],
      key: "membershipPlan",
      render: (value, record) => {
        console.log("User record:", record);
        return record.membershipPlan?.name || "No Plan";
      },
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
            title="Are you sure you want to delete this quit plan?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDelete(record.quitID)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPlans();
    fetchQuitPlans();
  }, []);

  // Lấy danh sách quit plans
  const fetchQuitPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/quitPlan");
      setDataSource(response.data);
    } catch (error) {
      console.error("Fetch quit plans failed:", error);
      message.error("Failed to load quit plans!");
      setDataSource([]);
    }
  };

  // Lấy danh sách membership plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/membership");
      setPlans(res.data);
    } catch (err) {
      console.log(err.message);
      message.error("Failed to load membership plans!");
    }
  };

  // Khi bấm Edit
  const onEdit = (record) => {
    setEditingPlanID(record.quitID);
    setOpen(true);
    form.setFieldsValue({
      reason: record.reason,
      stage: record.stage,
      endDate: dayjs(record.endDate),
      planID: record.plan?.planID, // Truy cập đúng trường theo entity
    });
  };

  // Xóa quit plan
  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/quitPlan/${id}`);
      message.success("Deleted successfully!");
      fetchQuitPlans();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Delete failed!");
    }
  };

  const onAddOrUpdate = async (values) => {
    try {
      // 1. VALIDATE DỮ LIỆU TRƯỚC KHI GỬI
      if (!values.planID) {
        message.error("Vui lòng chọn gói membership!");
        return;
      }

      if (!values.endDate) {
        message.error("Vui lòng chọn ngày kết thúc!");
        return;
      }

      if (!values.reason || values.reason.trim() === "") {
        message.error("Vui lòng nhập lý do!");
        return;
      }

      // 2. CHUẨN BỊ DỮ LIỆU THEO ĐÚNG FORMAT BACKEND YÊU CẦU
      const requestData = {
        plan: {
          planID: values.planID, // Gửi cả object plan nếu backend yêu cầu
        },
        endDate: values.endDate.format("YYYY-MM-DD"), // Format ngày chuẩn
        startDate: new Date().toISOString().split("T")[0], // Ngày hiện tại
        reason: values.reason.trim(),
        stage: values.stage || "PENDING", // Giá trị mặc định nếu không nhập
        user: {
          userID: 1, // Tạm hardcode, thực tế lấy từ auth context
        },
      };

      console.log("Dữ liệu chuẩn bị gửi:", requestData); // Log kiểm tra

      // 3. XỬ LÝ GỬI REQUEST (CREATE/UPDATE)
      let response;
      if (editingPlanID) {
        // Cập nhật bản ghi exist
        response = await axios.put(
          `http://localhost:8080/api/quitPlan/${editingPlanID}`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Cập nhật kế hoạch thành công!");
      } else {
        // Tạo mới
        response = await axios.post(
          "http://localhost:8080/api/quitPlan",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Thêm kế hoạch mới thành công!");
      }

      console.log("Phản hồi từ server:", response.data); // Log kết quả

      // 4. RESET FORM VÀ CẬP NHẬT LẠI DANH SÁCH
      form.resetFields();
      setOpen(false);
      setEditingPlanID(null);
      fetchQuitPlans(); // Load lại danh sách
    } catch (error) {
      // 5. XỬ LÝ LỖI CHI TIẾT
      console.error("Chi tiết lỗi:", {
        config: error.config,
        response: error.response,
        message: error.message,
      });

      let errorMessage = "Có lỗi xảy ra!";

      if (error.response) {
        // Lỗi từ phía server
        if (error.response.status === 400) {
          errorMessage =
            "Dữ liệu không hợp lệ: " +
            (error.response.data.message || "Vui lòng kiểm tra lại");
        } else if (error.response.status === 404) {
          errorMessage = "Không tìm thấy tài nguyên";
        } else if (error.response.status === 500) {
          errorMessage =
            "Lỗi server: " +
            (error.response.data.message || "Vui lòng thử lại sau");
        }
      } else if (error.request) {
        // Request được gửi nhưng không nhận được phản hồi
        errorMessage = "Không nhận được phản hồi từ server";
      } else {
        // Lỗi khi thiết lập request
        errorMessage = "Lỗi khi gửi yêu cầu: " + error.message;
      }

      message.error(errorMessage);
    }
  };

  // Tìm quit plan theo ID
  const searchQuitPlanById = async (quitPlanId) => {
    const trimmedQuitPlanId = quitPlanId.trim();
    if (!trimmedQuitPlanId) {
      fetchQuitPlans();
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/quitPlan/${trimmedQuitPlanId}`
      );
      setDataSource([response.data]);
    } catch (error) {
      console.error("Search quit plan failed:", error);
      message.error("Quit plan not found!");
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
            placeholder="Enter quit ID"
            allowClear
            style={{ width: 300 }}
            onSearch={searchQuitPlanById}
          />

          <Button type="primary" onClick={() => setOpen(true)}>
            Add quit plan
          </Button>
        </div>

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 6 }}
          rowKey="quitID"
        />

        <Modal
          title={editingPlanID ? "Edit Quit Plan" : "Add Quit Plan"}
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
              label="Membership Plan"
              name="planID" // Chỉ dùng tên trường đơn giản
              rules={[{ required: true, message: "Please select a plan!" }]}
            >
              <Select>
                {plans.map((plan) => (
                  <Select.Option key={plan.planID} value={plan.planID}>
                    {plan.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[
                { required: true, message: "Please input quit end date!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Please input quit reason!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Stage"
              name="stage"
              rules={[{ required: true, message: "Please input quit stage!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

export default AdminQuitPlan;
