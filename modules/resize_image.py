from PIL import Image
import shutil
import os

def resize_and_save_image(input_image_path, output_directory):
    
    with Image.open(input_image_path) as img:
        
        resized_img = img.resize((1024, 1024), Image.LANCZOS)
        
        
        os.makedirs(output_directory, exist_ok=True)
        
        filename = os.path.basename(input_image_path)
        
        output_image_path = os.path.join(output_directory, filename)
        
        temp_path = os.path.join(output_directory, "temp_" + filename)
        resized_img.save(temp_path)
        
        # Move the image to the final output path
        shutil.move(temp_path, output_image_path)
        
        return output_image_path