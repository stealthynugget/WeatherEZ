import React, { useEffect, useState } from 'react';
import './SearchHistory.css';

const SearchHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      const response = await fetch('http://localhost:4000/searchHistory/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setHistory(data.searchHistory);
      } else {
        console.error("Failed to fetch search history:", data.message);
      }
    };

    fetchSearchHistory();
  }, [userId]);

  return (
    <div className="history-container">
      <h2>Search History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <span className="city">{item.city}</span>
            <span className="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
