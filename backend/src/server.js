import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import crypto from 'crypto'
import { UserRegister } from './features/helper.js';

// Set up web app
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.IP || '127.0.0.1';

// Use middleware that allows us to access the JSON body of requests
app.use(express.json())
// Use middleware that allows for access from other domains
app.use(cors())
// Use middleware for logging errors
app.use(morgan())

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// AUTH:

app.post('/auth/register', (req, res) => {
    try {
        const { email, password, nameFirst, nameLast } = req.body;
        const result = UserRegister(email, password, nameFirst, nameLast);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})


app.post('/auth/login', (req, res) => {
    return res.json(result);
})

app.post('/auth/logout', (req, res) => {
    return res.json(result);
})

// LISTINGS

app.post('/listing/:uid/create', (req, res) => {
    const userId = parseInt(req.params.uid);
    return res.json(result);
})

app.delete('/listing/:uid/remove/:lid', (req, res) => {
    return res.json(result);
})

app.put('/listing/:uid/update/:lid', (req, res) => {
    return res.json(result);
})

app.get('/listing/newest', (req, res) => {
    return res.json(result);
})

app.get('/listing/search', (req, res) => {
    return res.json(result);
})

// BORROW

app.post('/borrow/:uid/create', (req, res) => {
    return res.json(result);
})

app.put('/borrow/:uid/update/:bid', (req, res) => {
    return res.json(result);
})

app.delete('/borrow/:uid/remove/:bid', (req, res) => {
    return res.json(result);
})


// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server started on port ${PORT} at ${HOST}`);
});


// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
