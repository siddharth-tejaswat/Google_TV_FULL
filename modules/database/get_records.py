import logging
from load_database import connect_to_db


def get_current_record_details(barcode_number):
    conn = connect_to_db(retries=5, delay=5)

    if conn:
        try:
            with conn.cursor() as cur:
                sql = """SELECT "GTV_IMAGE", "BARCODE_IMAGE", "IMAGE_FROM_CAMERA", "PROCESSED_IMAGE"
                         FROM public."Sarthak_MVP"
                         WHERE "BARCODE_NUMBER" = %s"""
                
                # Log the query and barcode number being compared
                # logging.info(f"Executing query: {sql}")
                # logging.info(f"Comparing BARCODE_NUMBER to: {barcode_number}")
                barcode_number=str(barcode_number[0])
                array_literal = f'{{{barcode_number}}}'
                # Execute the query with a tuple
                cur.execute(sql, (array_literal,))
                result = cur.fetchone()

                if result:
                    logging.info(f"Barcode {barcode_number} exists in the database.")
                    return result  # Return the record details
                else:
                    logging.info(f"Barcode {barcode_number} does not exist in the database.")
                    return None
        except Exception as e:
            logging.error(f"Database query failed: {e}")
            conn.rollback()
            return None
        finally:
            conn.close()  # Ensure the connection is closed
    else:
        return None


# # Example

# if __name__ == "__main__":
#     barcode_number = '1001963424'  # This should be passed as a string
#     result=get_current_record_details(barcode_number)
#     print('Tv image ',result[0])
#     print('Barcode Image ',result[1])
#     print('Camera Image ',result[2])
#     print('Processed Image ',result[3])
