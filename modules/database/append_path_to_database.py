import logging

from update_data_to_database import update_database
from get_records import get_current_record_details

# append paths to the existing paths in the database

def create_new_path(path, next_path):
    path=path.strip('"{}')
    path = path + ';' + next_path
    return str(path)

def append_paths(
        barcode_number,
        gtv_image,
        barcode_image,
        camera_image,
        processed_image):
    try:
        # get the existing records in the database
        records=get_current_record_details(barcode_number)
        
        # append new paths 
        # gtv_image = records[0] 
        gtv_image=create_new_path(records[0], gtv_image)
        barcode_image = create_new_path(records[1], barcode_image)
        camera_image = create_new_path(records[2], camera_image)
        processed_image= create_new_path(records[3], processed_image)

        logging.info("Successfully fetched existing records")
        return gtv_image, barcode_image, camera_image, processed_image
    
    except Exception as e:
        logging.error("Failed to fetch existing records")

# update existing paths in the database
def update_paths(record_id, 
                timestamp, 
                barcode_status,
                barcode_number, 
                cropped_barcode_image_path, 
                gtv_read, 
                gtv_image, 
                image_from_camera, 
                processed_image, 
                overall_status):

    try:
        # append the new paths to the existing paths 
        gtv_image, barcode_number, image_from_camera, processed_image=append_paths(
                                                                            barcode_number,
                                                                            gtv_image,
                                                                            cropped_barcode_image_path,
                                                                            image_from_camera,
                                                                            processed_image)
        
    except Exception as e:
        logging.error(f'{e}')
        return
    
    # if records fetched update the current record in the database
    try:
        logging.info('Updating Database')
        update_database(
            record_id, 
                timestamp, 
                barcode_status,
                barcode_number, 
                cropped_barcode_image_path, 
                gtv_read, 
                gtv_image, 
                image_from_camera, 
                processed_image, 
                overall_status
                )
        return 1
    
    # if updating records has failed
    except:
        return 0


barcode_number = ['1001963424']
records=append_paths(barcode_number,'IMAGE','IMAGE', 'IMAGE', 'IMAGE')
for i in records:
    print(i)