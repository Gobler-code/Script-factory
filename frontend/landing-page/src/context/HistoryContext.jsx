import { createContext, useContext, useEffect, useState, useCallback } from "react";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const refreshHistory = useCallback(() => {
    fetch("http://127.0.0.1:8000/scripts")
      .then((res) => (res.ok ? res.json() : []))
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <HistoryContext.Provider value={{ history, refreshHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}