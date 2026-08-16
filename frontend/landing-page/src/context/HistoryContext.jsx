import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../components/config";

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const refreshHistory = useCallback(() => {
    fetch(`${API_BASE_URL}/scripts`)
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