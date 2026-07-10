import express, { json, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

// Set up web app
const app = express()
const port = process.env.PORT || 3000
const HOST = process.env.IP || '127.0.0.1';

// Use middleware that allows us to access the JSON body of requests
app.use(json())
// Use middleware that allows for access from other domains
app.use(cors())
// Use middleware for logging errors
app.use(morgan())

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================


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
