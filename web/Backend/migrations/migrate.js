// migrations/migrate.js
const fs = require("fs");
const path = require("path");
const pool = require("../config/db"); // Path to your database configuration

async function runMigrations() {
  try {
    // Define the path to your SQL migration file
    const schemaPath = path.join(__dirname, "../schemas/create_tables.sql");

    // Read the SQL file
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Execute the SQL commands
    await pool.query(schema);
    console.log("Database migration completed successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    // Close the database connection
    pool.end();
  }
}

// Run the migration
runMigrations();
