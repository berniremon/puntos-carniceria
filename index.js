const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/enviar-puntos', async (req, res) => {
  const { telefono, mensaje, instanceId, token } = req.body;
  if (!telefono || !mensaje || !instanceId || !token) {
    return res.status(400).json({ ok: false, error: 'Faltan datos' });
  }
  try {
    const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: telefono, message: mensaje })
    });
    const data = await response.json();
    res.json({ ok: true, data });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', servicio: 'Berni Remon Puntos' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
