import React, { useState } from 'react';
import './QueryResult.css'
import { DataGrid } from '@mui/x-data-grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

export default function QueryResult({ sqlString }) {
  const [result, setResult] = useState([]);
  const [err, setErr] = useState(false);

  const handleRunQuery = () => {
    axios.post(`http://localhost:3001/api/query`, {sqlQuery: sqlString})
    .then(response => {
      setResult(response.data);
      setErr(false);
    })
    .catch((error) => {
      console.error('Error fetching result:', error);
      setErr(true);
    });
  };

  const columns = result.length > 0
    ? Object.keys(result[0]).map(key => ({
        field: key,
        headerName: key,
        flex: 1,
    })) : [];

  const rows = result.map((row, index) => ({
    id: index,
    ...row
  }));

  return (
    <div className="query-result">
      <div className="query-result-header">
        <button
          onClick={handleRunQuery}
        >
          <PlayArrowIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Run Query
        </button>
        <p className="errText">{err && "Error running a query!"}</p>
      </div>
      <div className="query-result-grid">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection={false}
      />
      </div>
    </div>
    
  );
}
