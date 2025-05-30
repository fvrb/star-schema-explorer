const express = require('express');
const router = express.Router();
const {
    sql,
    getPool
} = require('../db');

router.get('/facts', async (req, res) => {
    const pool = await getPool();
    const result = await pool.request().query(`
        SELECT sifTablica, nazTablica, nazSQLTablica 
        FROM tablica 
        WHERE sifTipTablica = 1
    `);
    res.json(trimData(result.recordset));
});

router.get('/measures', async (req, res) => {
    const {
        id
    } = req.query;

    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT tabAtribut.sifTablica, tabAtribut.imeSQLAtrib, tabAtribut.imeAtrib, nazAgrFun, tabAtributAgrFun.imeAtrib as imeAgrAtrib
            FROM tabAtribut, agrFun, tabAtributAgrFun                                          
            WHERE tabAtribut.sifTablica = @id
            AND tabAtribut.sifTablica  = tabAtributAgrFun.sifTablica 
            AND tabAtribut.rbrAtrib  = tabAtributAgrFun.rbrAtrib 
            AND tabAtributAgrFun.sifAgrFun = agrFun.sifAgrFun 
            AND tabAtribut.sifTipAtrib = 1
            ORDER BY tabAtribut.rbrAtrib
        `);
    res.json(trimData(result.recordset));

});

router.get('/dimensions', async (req, res) => {
    const {
        id
    } = req.query;

    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT   dimTablica.nazTablica
            , dimTablica.nazSQLTablica  AS nazSqlDimTablica
            , cinjTablica.nazSQLTablica AS nazSqlCinjTablica
            , cinjTabAtribut.imeSQLAtrib AS imeSqlCinjAtrib
            , dimTabAtribut.imeSqlAtrib AS imeSqlDimAtrib
            , tabAtribut.*
            FROM tabAtribut, dimCinj
            , tablica dimTablica, tablica cinjTablica 
            , tabAtribut cinjTabAtribut, tabAtribut dimTabAtribut
            WHERE dimCinj.sifDimTablica  = dimTablica.sifTablica
            AND dimCinj.sifCinjTablica = cinjTablica.sifTablica
            
            AND dimCinj.sifCinjTablica = cinjTabAtribut.sifTablica
            AND dimCinj.rbrCinj = cinjTabAtribut.rbrAtrib
            
            AND dimCinj.sifDimTablica = dimTabAtribut.sifTablica
            AND dimCinj.rbrDim = dimTabAtribut.rbrAtrib
        
            AND tabAtribut.sifTablica  = dimCinj.sifDimTablica
            AND sifCinjTablica = @id
            AND tabAtribut.sifTipAtrib = 2
            ORDER BY dimTablica.nazTablica, rbrAtrib
        `);

    const rows = trimData(result.recordset);

    const grouped = {};

    rows.forEach(row => {
        if(!grouped[row.sifTablica]) {
            grouped[row.sifTablica] = {
                sifTablica: row.sifTablica,
                nazTablica: row.nazTablica,
                nazSQLTablica: row.nazSqlDimTablica,
                cinjSQLKljuc: row.imeSqlCinjAtrib,
                dimSQLKljuc: row.imeSqlDimAtrib,
                atributi: []
            }
        }
        grouped[row.sifTablica].atributi.push({
            imeAtrib: row.imeAtrib,
            imeSQLAtrib: row.imeSQLAtrib
        });
    });

    res.json(Object.values(grouped));

});

router.post('/query', async (req, res) => {
    const {
        sqlQuery
    } = req.body;

    const pool = await getPool();
    const result = await pool.request().query(sqlQuery);
    res.json(trimData(result.recordset));
});

function trimData(rows) {
    const newData = rows.map(row => {
        newRow = {};
        for (key in row) {
            const value = row[key];

            if (typeof value == 'string') {
                newRow[key] = value.trim();
            } else if (Array.isArray(value)) {
                newRow[key] = value.map(x => typeof x === 'string' ? x.trim() : x);
            } else {
                newRow[key] = value;
            }
        }
        return newRow;
    });
    return newData;
}

module.exports = router;