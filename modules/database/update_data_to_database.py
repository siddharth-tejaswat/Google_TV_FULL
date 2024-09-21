import logging
import json 

from load_database import connect_to_db

def update_database(barcode_number, 
                    barcode_image, 
                    gtv_image, 
                    image_from_camera, 
                    processed_image ):

    conn = connect_to_db()
    
    logging.info('Updating Database')
    if conn:
        try:
            with conn.cursor() as cur:
                sql = """
                    UPDATE public."Sarthak_MVP"
                    SET 
                        "BARCODE_IMAGE" = %s,
                        "GTV_IMAGE" = %s,
                        "IMAGE_FROM_CAMERA" = %s,
                        "PROCESSED_IMAGE" = %s
                    WHERE "BARCODE_NUMBER" = %s
                """
                cur.execute(sql, (   
                    barcode_image,
                    gtv_image, 
                    image_from_camera, 
                    processed_image, 
                    barcode_number
                        # The condition to update where the barcode number matches
                ))
                
                conn.commit()
                logging.info(f"Record updated successfully for barcode: {barcode_number}")
                conn.close()
                return 1
        
        except Exception as e:
            conn.rollback()
            logging.error(f"Failed to update data in database: {e}")
            conn.close()
            return 0
