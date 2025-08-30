import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
// Importer les données depuis les fichiers JSON
import trainsData from '../data/trains-data.json' with { type: 'json' }
import stationsData from '../data/stations-data.json' with { type: 'json' }


const app = express()
const PORT = process.env.PORT || 5001
let seatsNumber = 22 
let updatePrice = 96

// --- RPS Middleware (doit être AVANT routes/static) ---
const rpsWindow = new Array(10).fill(0) // 10 "tranches" de 100ms = 1s
let rpsIndex = 0

setInterval(() => {
  rpsIndex = (rpsIndex + 1) % rpsWindow.length
  rpsWindow[rpsIndex] = 0
}, 100)

app.use((req, res, next) => {
  rpsWindow[rpsIndex]++
  next()
})

app.use((_, res, next) => {
  res.set('Timing-Allow-Origin', '*')
  next()
})

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(compression())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- Static assets avec CORS et COEP ---
app.use(
  '/static',
  (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    res.set('Cross-Origin-Opener-Policy', 'same-origin')
    res.set('Cross-Origin-Embedder-Policy', 'require-corp')
    next()
  },
  express.static(path.join(__dirname, 'static'), {
    extensions: ['js', 'css', 'jpg'],
    maxAge: 0
  })
)

// --- API server ---
app.get('/api/server', (_, res) => {
  res.set('Cache-Control', 'no-store')
  const rps = rpsWindow.reduce((a, b) => a + b, 0)
  res.json({
    memory: process.memoryUsage().rss,
    load: +os.loadavg()[0].toFixed(2),
    rps
  })
})

// --- API payload ---
app.get('/api/payload', (_, res) => {
  const block = 'x'.repeat(1_024)
  const big = Array(1_024).fill(block)
  res.json({ data: big, ts: Date.now() })
})

// Simulation update number of seats 
app.get('/api/seats', (_, res) => {
  setTimeout(() => {
    seatsNumber = seatsNumber - 1;

    if (seatsNumber < 0) {
      seatsNumber = 22;
    }
    
    res.json({ seats: seatsNumber });
  }, 200);
});

// Simulation update price 
app.get('/api/price', (_, res) => {
  setTimeout(() => {
    updatePrice = Math.max(updatePrice + 5, 96); 
    res.json({ price: updatePrice });
  }, 200);
})

// Simulation update liste of trains 
app.get('/api/trains', (_, res) => {
  setTimeout(() => {
    res.json(trainsData);
  }, 200);
})

// Simulation update liste of stations 
app.get('/api/stations', (_, res) => {
  setTimeout(() => {
    res.json(stationsData);
  }, 200);
})

app.listen(PORT, () => console.log(`backend on :${PORT}`))