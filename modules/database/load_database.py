import os
import psycopg2
import time
import logging

# Ensure the 'logs' directory exists
log_directory = "logs"
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # You can change to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_directory, "logs.log")),  # Log to the 'logs/logs.log' file
        logging.StreamHandler()  # Log to the console
    ]
)

def connect_to_db(retries=10, delay=2):
    for attempt in range(retries):
        try:
            conn = psycopg2.connect(
                dbname="postgres",
                user="postgres",
                password="admin",
                host="127.0.0.1",
                port="5432"
            )
            logging.info("Database connection established.")
            return conn
        except Exception as e:
            logging.error(f"Attempt {attempt + 1}: Unable to connect to the database: {e}")
            if attempt < retries - 1:
                logging.info(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                logging.error("Max retries reached. Exiting.")
                return None
