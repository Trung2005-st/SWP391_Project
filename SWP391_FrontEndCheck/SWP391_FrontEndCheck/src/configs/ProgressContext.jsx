import React, { createContext, useState, useEffect } from "react";
import api from "./axios";
// Định nghĩa ProgressContext với giá trị mặc định để IDE không bị lỗi
export const ProgressContext = createContext({
  userId: null,
  setUserId: () => {},
  quitDate: "",
  setQuitDate: () => {},
  finishTimeline: "",
  setFinishTimeline: () => {},
  cigarettesPerDay: "",
  setCigarettesPerDay: () => {},
  packCost: "",
  setPackCost: () => {},
  cigarettesPerPack: "",
  setCigarettesPerPack: () => {},
  selectedReasons: [],
  setSelectedReasons: () => {},
  selectedTriggers: [],
  setSelectedTriggers: () => {},
  selectedStrategies: [],
  setSelectedStrategies: () => {},
});

export function ProgressProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem("userId");
    return saved ? parseInt(saved) : null;
  });
  const [quitDate, setQuitDate] = useState("today");
  const [finishTimeline, setFinishTimeline] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [packCost, setPackCost] = useState("");
  const [cigarettesPerPack, setCigarettesPerPack] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState({
    nonSmokingDays: 0,
    cigarettesAvoided: 0,
    totalSaving: 0,
    finishTimeline: 0,
  });

  useEffect(() => {
    if (!userId) return;
    api
      .get("/user-plan/general") // endpoint GET plan hiện tại
      .then((res) => {
        // giả sử res.data = { quitDate, finishTimeline }
        // bạn có thể map nó thành object planDefinitions như trước
        // hoặc chỉ giữ raw data
        setPlan({
          quitDate: res.data.quitDate,
          finishTimeline: res.data.finishTimeline,
          // nếu bạn có thêm weeklySteps, phải fetch về
        });
      })
      .catch(() => {
        // nếu 404 hoặc lỗi khác, coi như chưa có plan
        setPlan(null);
      });
  }, [userId]);

  console.log("📦 ProgressProvider render, userId =", userId);

  return (
    <ProgressContext.Provider
      value={{
        userId,
        setUserId,
        quitDate,
        setQuitDate,
        finishTimeline,
        setFinishTimeline,
        cigarettesPerDay,
        setCigarettesPerDay,
        packCost,
        setPackCost,
        cigarettesPerPack,
        setCigarettesPerPack,
        selectedReasons,
        setSelectedReasons,
        selectedTriggers,
        setSelectedTriggers,
        selectedStrategies,
        setSelectedStrategies,
        stats,
        setStats,
        plan,
        setPlan,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
