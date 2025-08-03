import { useEffect, useState } from 'react';

const fetchUserSearchHistory = async (userId) => {
  try {
    const response = await fetch('http://localhost:4000/searchHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      const searchHistory = await response.json();
      return searchHistory;
    } else {
      console.error('Failed to fetch search history');
      return [];
    }
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

const UserSearchHistory = ({ userId }) => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserSearchHistory(userId).then(data => setSearchHistory(data));
    }
  }, [userId]);

  return (
    <div>
      <h2>Your Search History</h2>
      <ul>
        {searchHistory.map((entry, index) => (
          <li key={index}>{entry.city} - {new Date(entry.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchHistory;
