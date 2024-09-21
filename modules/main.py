import os
import sys
import time
import logging

from database.database import save_data_to_database
from make_save_images_dir import create_directories
from barcode.detect_barcode_from_image import detect_barcode_from_image_path
from database.load_database import connect_to_db
from process_images import process_file

import psycopg2

# Configure logging
logging.basicConfig(
    level=logging.ERROR,  # You can change to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/logs.log"),  # Log to a file
        logging.StreamHandler(sys.stdout)  # Log to the console
    ]
)

# Main function
if __name__ == "__main__":
    logging.info("Starting the application.")

    conn = connect_to_db(retries=10, delay=5)

    camera_directory_path = r'images\camera'
    barcode_directory_path= r'images\barcode'
    
    base_dir = r"C:\Users\siddh\OneDrive\Desktop\New_folder\desktop_app\Frontend\public\GTV_IMAGE_TESTING"

    

    cropped_images_directory, camera_image_directory, processed_image_directory, tv_image_directory = create_directories(base_dir)

    if conn:
        #When needed then only connect database 
        logging.info("Successfully connected to the database.")
        logging.info('Starting processing...')
        conn.close()
        while True:

            try:
                # sort the files on first come first server basis

                files = os.listdir(camera_directory_path)
                if files != None:
                    time.sleep(4)
                if not files:
                    logging.warning(f"No files found in the directory: {barcode_directory_path}\n Retrying after 5 seconds")
                    
                for file_name in files:
                    barcode_image_path = os.path.join(barcode_directory_path, file_name)
                    camera_image_path = os.path.join(camera_directory_path, file_name)
                    
                    # print(f"Camera Image path : {camera_image_path}")
                    # print(f"Barcode image path : {barcode_image_path}")
                    
                    process_file(barcode_image_path, camera_image_path, camera_image_directory, processed_image_directory, tv_image_directory, cropped_images_directory)
                    time.sleep(3)
                time.sleep(5)
            except FileNotFoundError:
                logging.error(f"The directory {barcode_directory_path} does not exist.")
                break
            except Exception as e:
                logging.exception(f"An error occurred while monitoring the directory: {e}")
                break
    else:
        logging.error("Unable to establish a database connection after multiple attempts.")
