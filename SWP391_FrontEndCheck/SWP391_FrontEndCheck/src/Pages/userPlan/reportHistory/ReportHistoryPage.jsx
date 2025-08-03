import React, { useContext, useEffect, useState } from "react";
import { Table, message } from "antd";
import { ProgressContext } from "../../../configs/ProgressContext";
import FullPageLayout from "../../../components/layout/UserLayOut";
import styles from "../../userPlan/styleAfterProgress.module.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ReportHistoryPage() {
  const { userId } = useContext(ProgressContext);
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Lấy lịch sử báo cáo
    axios
      .get(`http://localhost:8080/api/progress/report-history?userId=${userId}`)
      .then((res) => setReports(res.data))
      .catch(() => message.error("Failed to load report history"));

    // Lấy dữ liệu biểu đồ
    axios
      .get(
        `http://localhost:8080/api/progress/cigarette-history?userId=${userId}`
      )
      .then((res) => setChartData(res.data))
      .catch(() => message.error("Failed to load chart data"));
  }, [userId]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Cigarettes Smoked",
      dataIndex: "smokedCigars",
      key: "smokedCigars",
    },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Feeling", dataIndex: "feeling", key: "feeling" },
  ];

  return (
    <FullPageLayout>
      <div className={styles.card}>
        <h2 style={{ marginBottom: 16 }}>📈 Smoking Trend Chart</h2>

        {/* Biểu đồ đường */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="smokedCigars"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Bảng dữ liệu */}
        <h2 style={{ margin: "32px 0 16px" }}>📅 Daily Report History</h2>
        <Table
          dataSource={reports}
          columns={columns}
          rowKey="reportId"
          pagination={{ pageSize: 7 }}
          bordered
        />
      </div>
    </FullPageLayout>
  );
}
