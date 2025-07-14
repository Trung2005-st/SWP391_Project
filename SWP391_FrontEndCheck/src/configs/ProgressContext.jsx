import React, { createContext, useState } from "react";

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [quitDate, setQuitDate] = useState("today");
  const [finishTimeline, setFinishTimeline] = useState("1");
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [packCost, setPackCost] = useState("");
  const [cigarettesPerPack, setCigarettesPerPack] = useState("");
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  return (
    <ProgressContext.Provider
      value={{
        quitDate,
        setQuitDate,
        finishTimeline,
        setFinishTimeline,
        cigarettesPerDay,
        setCigarettesPerDay,
        setCigarettesPerPack,
        packCost,
        setPackCost,
        cigarettesPerPack,
        selectedReasons,
        setSelectedReasons,
        selectedTriggers,
        setSelectedTriggers,
        selectedStrategies,
        setSelectedStrategies,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
