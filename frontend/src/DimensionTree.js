import React, { useEffect, useState } from 'react';
import './DimensionTree.css'
import axios from 'axios';

export default function DimensionTree({ factId, selectedMeasures, selectedAttributes, onChangeMeas, onChangeDim }) {
  const [dimensions, setDimensions] = useState([]);
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    if (!factId) return;
    
    axios.get(`http://localhost:3001/api/measures?id=${factId}`)
      .then((response) => {
        setMeasures(response.data);

        axios.get(`http://localhost:3001/api/dimensions?id=${factId}`)
        .then((response) => {
          setDimensions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching dimensions:', error);
        });

      })
      .catch((error) => {
        console.error('Error fetching measures:', error);
      });

      onChangeDim([]);
      onChangeMeas([]);
    
  }, [factId]);

  const toggleAttr = (dimNaz, dimSQLNaz, cinjSQLKljuc, dimSQLKljuc, atribIme, atribSQLIme) => {
    const key = `${dimSQLNaz}.${atribSQLIme}`;
    const isSelected = selectedAttributes.some(a => `${a.dimSQLNaz}.${a.atribSQLIme}` === key);
    if (isSelected) {
      onChangeDim(selectedAttributes.filter(a => `${a.dimSQLNaz}.${a.atribSQLIme}` !== key));
    } else {
      onChangeDim([...selectedAttributes, { dimNaz, dimSQLNaz, cinjSQLKljuc, dimSQLKljuc, atribIme, atribSQLIme }]);
    }
    console.log(selectedAttributes);
  };

  const toggleMeas = (ime, SQLIme, agrFun, agrAtribIme) => {
    const key = `${agrFun}.${SQLIme}`;
    const isSelected = selectedMeasures.some(m => `${m.agrFun}.${m.SQLIme}` === key);
    if (isSelected) {
      onChangeMeas(selectedMeasures.filter(m => `${m.agrFun}.${m.SQLIme}` !== key));
    } else {
      onChangeMeas([...selectedMeasures, { ime, SQLIme, agrFun, agrAtribIme }]);
    }
    console.log(selectedMeasures);
  };

  return (
    <div className="dimension-tree">
      <details className="measures-section">
        <summary className="section-title">Measures:</summary>
        {measures.map(meas => {
          const isChecked = selectedMeasures.some(
            m => m.SQLIme === meas.imeSQLAtrib && m.agrFun === meas.nazAgrFun
          );
          return (
            <label key={`${meas.nazAgrFun}.${meas.imeSQLAtrib}`} className="checkbox-label">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  toggleMeas(meas.imeAtrib, meas.imeSQLAtrib, meas.nazAgrFun, meas.imeAgrAtrib)
                }
              />
              <span className="checkbox-text">{meas.imeAgrAtrib}</span>
            </label>
          );
        })}
      </details>
      <details className="dimensions-section">
        <summary className="section-title">Dimension Attributes:</summary>
        {dimensions.map(dim => (
          <details key={dim.nazSQLTablica} className="dimension-group">
            <summary className="dimension-name">{dim.nazTablica}</summary>
            <div className="dimension-attributes">
              {dim.atributi.map(atrib => {
                const isChecked = selectedAttributes.some(
                  a => a.dimSQLNaz === dim.nazSQLTablica && a.atribSQLIme === atrib.imeSQLAtrib
                );
                return (
                  <label key={`${dim.nazSQLTablica}.${atrib.imeSQLAtrib}`} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        toggleAttr(dim.nazTablica, dim.nazSQLTablica, dim.cinjSQLKljuc, dim.dimSQLKljuc, atrib.imeAtrib, atrib.imeSQLAtrib)
                      }
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">{atrib.imeAtrib}</span>
                  </label>
                );
              })}
            </div>
          </details>
        ))}
      </details>
    </div>
  );
}
