import React, { createContext, useContext, useState, useEffect } from "react";

export interface EconomyState {
  tokens: number;
  gameCoins: number;
  gems: number;
  ves: number;
  sves: number;
  spins: number;
}

interface EconomyContextType {
  state: EconomyState;
  deductTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  addGameCoins: (amount: number) => void;
  deductGameCoins: (amount: number) => boolean;
  addReward: (type: keyof EconomyState, amount: number) => void;
  deductReward: (type: keyof EconomyState, amount: number) => boolean;
}

const defaultState: EconomyState = {
  tokens: 100, // Initial balance for testing
  gameCoins: 0,
  gems: 0,
  ves: 0,
  sves: 0,
  spins: 1, // Start with 1 spin for testing
};

const EconomyContext = createContext<EconomyContextType | undefined>(undefined);

export const EconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EconomyState>(() => {
    const saved = localStorage.getItem("veloop_economy");
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem("veloop_economy", JSON.stringify(state));
  }, [state]);

  const deductTokens = (amount: number): boolean => {
    if (state.tokens >= amount) {
      setState((prev) => ({ ...prev, tokens: prev.tokens - amount }));
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    setState((prev) => ({ ...prev, tokens: prev.tokens + amount }));
  };

  const addGameCoins = (amount: number) => {
    setState((prev) => ({ ...prev, gameCoins: prev.gameCoins + amount }));
  };

  const deductGameCoins = (amount: number): boolean => {
    if (state.gameCoins >= amount) {
      setState((prev) => ({ ...prev, gameCoins: prev.gameCoins - amount }));
      return true;
    }
    return false;
  };

  const addReward = (type: keyof EconomyState, amount: number) => {
    setState((prev) => ({ ...prev, [type]: prev[type] + amount }));
  };

  const deductReward = (type: keyof EconomyState, amount: number): boolean => {
    if (state[type] >= amount) {
      setState((prev) => ({ ...prev, [type]: prev[type] - amount }));
      return true;
    }
    return false;
  };

  return (
    <EconomyContext.Provider
      value={{
        state,
        deductTokens,
        addTokens,
        addGameCoins,
        deductGameCoins,
        addReward,
        deductReward,
      }}
    >
      {children}
    </EconomyContext.Provider>
  );
};

export const useEconomy = () => {
  const context = useContext(EconomyContext);
  if (context === undefined) {
    throw new Error("useEconomy must be used within an EconomyProvider");
  }
  return context;
};
