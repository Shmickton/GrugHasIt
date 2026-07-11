import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import crypto from 'crypto'
import { authenticateListing, removeListing, saveListing } from './features/helper';

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
    return res.json(result);
})


app.post('/auth/login', (req, res) => {
    return res.json(result);
})

app.post('/auth/logout', (req, res) => {
    return res.json(result);
})

// LISTINGS

app.post('/listing/:uid/create', (req, res) => {
    const userId = req.params.uid;
    const title = req.body.title;
    const desc = req.body.desc;
    const cost = req.body.cost;
    result = saveListing(userId, title, desc, cost);
    return res.json(result);
})

app.delete('/listing/:uid/remove/:lid', (req, res) => {
    const userId = req.params.uid;
    const listingId = req.params.lid;
    authenticateListing(userId, listingId);
    removeListing(listingId);
    return res.json(result);
})

app.put('/listing/:uid/update/:lid', (req, res) => {
    const userId = req.params.uid;
    const listingId = req.params.lid;
    const title = req.body.title;
    const desc = req.body.desc;
    const cost = req.body.cost;
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
