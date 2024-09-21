import logging
import os

from database.load_database import connect_to_db

def check_database(barcode_number):
    conn = connect_to_db(retries=5, delay=5)

    if conn:
        try:
            with conn.cursor() as cur:
                sql = """SELECT "GTV_READ", "BARCODE_NUMBER"
                         FROM public."Sarthak_MVP"
                         WHERE "BARCODE_NUMBER" = %s"""
                
                # print("TYPE OF BARCODE IN PROCESS_PY FUNCTION", type(barcode_number))
                barcode_number=str(barcode_number[0])
                array_literal = f'{{{barcode_number}}}'
                print(f"Comparing {type(array_literal)}")
                # Execute the query with a tuple
                cur.execute(sql, (array_literal,))
                
                result = cur.fetchone()
                print(result)

                
                if result:
                    logging.info(f"Barcode {barcode_number} exists in the database.")
                    if result[0] == '{YES}':
                        return 'YES'
                    else:
                        return 'NO'
                    
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




# barcode_number = ['1001963424']
# check_database(barcode_number)
