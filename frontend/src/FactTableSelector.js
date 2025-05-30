import React, { useEffect, useState } from 'react';
import './FactTableSelector.css'
import axios from 'axios';

export default function FactTableSelector({ selectedFactId, onSelect }) {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:3001/api/facts')
      .then((response) => {
        setFacts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching fact tables:', error);
      });
  }, []);

  return (
    <div className="fact-table-selector">
      <h2>Select a Fact Table:</h2>
      <div>
        {facts.map(f => (
          <label key={f.sifTablica} className="fact-radio-label">
            <input
              type="radio"
              name="fact"
              value={f.sifTablica}
              checked={selectedFactId === f.sifTablica}
              onChange={() => onSelect(f)}
            />
            <span>{f.nazTablica}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
