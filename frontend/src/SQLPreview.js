import React from 'react';
import './SQLPreview.css'

export default function SQLPreview({ sqlString }) {

  return (
    <div className="sql-preview">
      <pre>{sqlString}</pre>
    </div>
  );
}
