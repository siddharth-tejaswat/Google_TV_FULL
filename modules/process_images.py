import os
import time
from datetime import datetime 
import shutil
import logging

from database.database import save_data_to_database
from barcode.detect_barcode_from_image import detect_barcode_from_image_path
from predict import classify_image
from resize_image import resize_and_save_image

from get_status import check_database
from database.append_path_to_database import update_paths

# to get current time
def get_date_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


# Function to process a single file and insert into the database
def process_file(barcode_image_path, camera_image_path, camera_image_directory, processed_image_directory, tv_image_directory, cropped_images_directory):
    try:
        logging.info(f"Processing file: {camera_image_path}")
        
        # Prepare data
        try:
            record_id = camera_image_path
            timestamp = get_date_timestamp()
            logging.info(f"Timestamp for processing: {timestamp}")

            gtv_read, gtv_image = classify_image(camera_image_path)
            logging.info(f"GTV Read: {gtv_read}, GTV Image Path: {gtv_image}")

            barcode_status, barcode_number, cropped_barcode_image_path = detect_barcode_from_image_path(barcode_image_path, cropped_images_directory)
            logging.info(f"Barcode Detection - Status: {barcode_status}, Number: {barcode_number}")

            image_from_camera = os.path.join(camera_image_path, os.path.basename(camera_image_directory))  # camera image 
            processed_image = resize_and_save_image(camera_image_path, processed_image_directory)
            gtv_image = resize_and_save_image(camera_image_path, tv_image_directory)
            overall_status = "Processed"

            barcode_exist = check_database(barcode_number)
            
            if barcode_exist:
                
                if barcode_exist=='YES':
                    gtv_read='YES'

                update_paths(record_id, 
                timestamp, 
                barcode_status,
                barcode_number, 
                cropped_barcode_image_path, 
                gtv_read, 
                gtv_image, 
                image_from_camera, 
                processed_image, 
                overall_status)



        # Pass all prepared variables to the save_data_to_database function
            else:
                for i in range(0,3):
                    data_saved=save_data_to_database( 
                                        record_id, 
                                        timestamp, 
                                        barcode_status,
                                        barcode_number, 
                                        cropped_barcode_image_path, 
                                        gtv_read, 
                                        gtv_image, 
                                        image_from_camera, 
                                        processed_image, 
                                        overall_status)
                    if data_saved == 1:    
                        logging.info("Data saved to database successfully.")
                        break

                    else:
                        logging.error(f'Database transaction failed')

            # shutil.move(camera_image_path, os.path.join(camera_image_directory, os.path.basename(camera_image_path)))
            logging.info(f"Moved {camera_image_path} to {camera_image_directory}")
            logging.info("\n\n\n")
            
        except Exception as e:
            logging.error('Error while processing image')
            overall_status = "Not Processed"

    except Exception as e:
        logging.error(f"Failed to process file {camera_image_path}: {e}")
        logging.info("\n\n\n")
