const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_PATH = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH);

// Initialize table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    hora_inicio TEXT,
    hora_fin TEXT,
    observaciones TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
});

// Listar pedidos
app.get('/api/pedidos', (req, res) => {
  db.all('SELECT * FROM pedidos ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear pedido
app.post('/api/pedidos', (req, res) => {
  const { nombre, hora_inicio, hora_fin, observaciones } = req.body;
  const stmt = db.prepare('INSERT INTO pedidos (nombre, hora_inicio, hora_fin, observaciones) VALUES (?, ?, ?, ?)');
  stmt.run(nombre, hora_inicio, hora_fin, observaciones, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM pedidos WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// Eliminar pedido
app.delete('/api/pedidos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM pedidos WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedId: id });
  });
});

// Exportar a Excel
app.get('/api/pedidos/export', async (req, res) => {
  db.all('SELECT * FROM pedidos ORDER BY id ASC', [], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Pedidos');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Hora inicio', key: 'hora_inicio', width: 20 },
      { header: 'Hora fin', key: 'hora_fin', width: 20 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
      { header: 'Creado', key: 'created_at', width: 24 }
    ];
    rows.forEach(r => sheet.addRow(r));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="pedidos.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on port', PORT));
