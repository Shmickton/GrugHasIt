import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import crypto from 'crypto'
import { authenticateListing, getListings, removeListing, saveListing, updateListing, UserLogin, UserLogout, UserRegister } from './features/helper.js';

// Set up web app
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.IP || '127.0.0.1';

app.use(morgan())
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // allow both, since dev testing bounces between them
  credentials: true,
}))

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// AUTH:

app.post('/auth/register', (req, res) => {
    try {
        const { email, password, UserName } = req.body;
        const result = UserRegister(email, password, UserName);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.post('/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const result = UserLogin(email, password);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.post('/auth/logout', (req, res) => {
    try {
        const result = UserLogout();
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

// LISTINGS

app.post('/listing/:uid/create', (req, res) => {
    try {
        const userId = parseInt(req.params.uid, 10);
        const { title, desc, cost } = req.body;
        const result = saveListing(userId, title, desc, cost);
        return res.json({ listingId: result });
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.delete('/listing/:uid/remove/:lid', (req, res) => {
    try {
        const userId = parseInt(req.params.uid, 10);
        const listingId = parseInt(req.params.lid, 10);
        authenticateListing(userId, listingId);
        const result = removeListing(listingId);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.put('/listing/:uid/update/:lid', (req, res) => {
    try {
        const userId = parseInt(req.params.uid, 10);
        const listingId = parseInt(req.params.lid, 10);
        const { title, desc, cost } = req.body;
        authenticateListing(userId, listingId);
        const result = updateListing(listingId, title, desc, cost);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.get('/listing/newest', (req, res) => {
    try {
        const listings = getListings();
        const last = listings.length > 0 ? listings[listings.length - 1] : null;
        return res.json(last);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
})

app.get('/listing/search', (req, res) => {
    try {
        const listings = getListings();
        const query = (req.query.q ?? '').toString().trim().toLowerCase();
        const results = query
            ? listings.filter(listing => listing.title.toLowerCase().includes(query))
            : listings;
        return res.json(results);
    } catch (error) {
        return res.status(400).json({ error: error.error ?? 'UNKNOWN_ERROR', message: error.message });
    }
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