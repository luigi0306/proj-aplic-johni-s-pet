import fs from 'fs';
import path from 'path';
import { pool } from '../src/config/db';

async function setupDatabase() {
  const sqlFilePath = path.join(__dirname, '..', 'BANCO PET SHOP.sql');
  
  try {
    console.log('Reading BANCO PET SHOP.sql...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Applying database schema to PostgreSQL...');
    await pool.query(sqlContent);
    
    console.log('Database schema applied successfully!');
  } catch (error) {
    console.error('Error applying database schema:', error);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

setupDatabase();
