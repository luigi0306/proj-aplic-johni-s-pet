import fs from 'fs';
import path from 'path';
import { pool } from '../src/backend/config/db';

async function setupDatabase() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  
  try {
    console.log('Dropping and recreating public schema for a clean slate...');
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    
    console.log('Reading database/schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Applying database schema...');
    await pool.query(schemaSql);
    console.log('Schema applied successfully.');

    console.log('Reading database/seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('Applying seed data...');
    await pool.query(seedSql);
    console.log('Database seed data applied successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

setupDatabase();
