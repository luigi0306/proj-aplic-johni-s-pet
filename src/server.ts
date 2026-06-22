import app from './app';
import { pool } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Verify db connection before starting the server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Failed to connect to the database on startup. Exiting...', err);
    process.exit(1);
  } else {
    console.log('Database connection verified on startup.');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running and listening on port ${PORT}`);
    });
  }
});
