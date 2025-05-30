import React, { useState, useEffect } from 'react';
import './App.css'
import FactTableSelector from './FactTableSelector';
import DimensionTree from './DimensionTree';
import SQLPreview from './SQLPreview';
import QueryResult from './QueryResult';

export default function App() {
  const [selectedFact, setSelectedFact] = useState(null);
  const [selectedDimAttrs, setSelectedDimAttrs] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    const dimTables = {};
    selectedDimAttrs.forEach(attr => {
      dimTables[attr.dimSQLNaz] = {
        dimNaz: attr.dimNaz,
        cinjSQLKljuc: attr.cinjSQLKljuc,
        dimSQLKljuc: attr.dimSQLKljuc
      }
    });

    const dimParts = selectedDimAttrs.map(attr => `${attr.dimSQLNaz}.${attr.atribSQLIme} AS "${attr.atribIme}"`);
    const measParts = selectedMeasures.map(meas => `${meas.agrFun}(${selectedFact.nazSQLTablica}.${meas.SQLIme}) AS "${meas.agrAtribIme}"`);

    let sqlString = `SELECT ` 

    if (dimParts.length !== 0 && measParts.length !== 0)
      sqlString += `${dimParts.join(", ")}, ${measParts.join(", ")}`;
    else if (dimParts.length !== 0)
      sqlString += `${dimParts.join(", ")}`;
    else if (measParts.length !== 0)
      sqlString += `${measParts.join(", ")}`;
    

    sqlString += `\nFROM `;
    if (selectedFact)
      sqlString += `${selectedFact.nazSQLTablica}`;
    if (Object.keys(dimTables).length !== 0)
      sqlString += `, ${Object.keys(dimTables).join(", ")}`;

    sqlString += `\nWHERE `;

    const whereParts = Object.keys(dimTables).map(k => `${selectedFact?.nazSQLTablica}.${dimTables[k].cinjSQLKljuc} = ${k}.${dimTables[k].dimSQLKljuc}`);

    sqlString += `${whereParts.join("\n\tAND ")}`;

    sqlString += `\nGROUP BY `;
    const groupParts = selectedDimAttrs.map(attr => `${attr.dimSQLNaz}.${attr.atribSQLIme}`);
    sqlString += `${groupParts.join(", ")}`;

    setSql(sqlString);
    console.log(dimTables);
  }, [selectedFact, selectedDimAttrs, selectedMeasures])
  

  return (
    <div className="app-grid">
      
      <div className="top-left">
        <FactTableSelector
          selectedFactId={selectedFact?.sifTablica}
          onSelect={setSelectedFact}
        />
      </div>

      <div className="bottom-left">
        <DimensionTree
          factId={selectedFact?.sifTablica}
          selectedMeasures={selectedMeasures}
          selectedAttributes={selectedDimAttrs}
          onChangeMeas={setSelectedMeasures}
          onChangeDim={setSelectedDimAttrs}
        />
      </div>
    
      <div className="top-right">
        <SQLPreview
          sqlString={sql}
        />
      </div>

      <div className="bottom-right">
        <QueryResult sqlString={sql} />
      </div>
    </div>
  );
}
