import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);
  const [coinCache, setCoinCache] = useState({});
  const [currency, setCurrency] = useState({
    name: "inr",
    symbol: "₹",
  });

  const fetchAllCoin = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": import.meta.env.VITE_COIN_API_KEY,
          },
        }
      );

      const data = await res.json();
      if (Array.isArray(data)) setAllCoin(data);
      else setAllCoin([]);
    } catch (err) {
      console.error(err);
      setAllCoin([]);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency]);

  return (
    <CoinContext.Provider
      value={{ allCoin, currency, setCurrency, coinCache, setCoinCache }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
