import { useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const { coinId } = useParams();
  const { currency, coinCache, setCoinCache } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Use cache if available
        if (coinCache[coinId]) {
          setCoinData(coinCache[coinId].coin);
          setHistoricalData(coinCache[coinId].history);
          return;
        }

        const options = {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": import.meta.env.VITE_COIN_API_KEY,
          },
        };

        // ✅ FAST: parallel + lightweight API
        const [coinRes, historyRes] = await Promise.all([
          fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&ids=${coinId}`,
            options
          ),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10`,
            options
          ),
        ]);

        const coinArr = await coinRes.json();
        const history = await historyRes.json();

        const coin = coinArr[0];

        setCoinData(coin);
        setHistoricalData(history);

        // ✅ Cache it
        setCoinCache((prev) => ({
          ...prev,
          [coinId]: { coin, history },
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [coinId, currency]);

  // ✅ SAFE GUARD
  if (!coinData || !historicalData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData.image} alt={coinData.name} />
        <p>
          <b>
            {coinData.name} ({coinData.symbol.toUpperCase()})
          </b>
        </p>
      </div>

      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Price</li>
          <li>
            {currency.symbol} {coinData.current_price.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>
            {currency.symbol} {coinData.market_cap.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24H High</li>
          <li>
            {currency.symbol} {coinData.high_24h.toLocaleString()}
          </li>
        </ul>
        <ul>
          <li>24H Low</li>
          <li>
            {currency.symbol} {coinData.low_24h.toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
