import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import torch.nn.functional as F
import logging

# Ensure the 'logs' directory exists
log_directory = "logs"
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

# Configure logging for the prediction module (log to file, not to console)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_directory, 'logs.log'))  # Log only to the file
    ]
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model(model_path):
    logging.info(f"Loading model from {model_path}...")
    model = models.resnet50(pretrained=False)  # Use the same model architecture
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, 2)  # Binary classification (output: 2 classes)
    
    # Load the saved model weights
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()  # Set the model to evaluation mode
        logging.info("Model loaded and set to evaluation mode.")
    except Exception as e:
        logging.error(f"Error loading model: {e}")
        raise
    return model

def preprocess_image(image_path, input_size=512):
    logging.info(f"Preprocessing image from {image_path}...")
    # Define the same image transformations as used during training
    transform = transforms.Compose([
        transforms.Resize((input_size, input_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Open the image, apply transforms, and return
    try:
        image = Image.open(image_path).convert('RGB')
        image = transform(image).unsqueeze(0)  # Add batch dimension (1, C, H, W)
        logging.info("Image preprocessing complete.")
    except Exception as e:
        logging.error(f"Error preprocessing image: {e}")
        raise
    return image

def predict_image(model, image_tensor, class_names=['not_working', 'working']):
    logging.info("Performing image prediction...")
    # Move image tensor to the same device as the model (CPU or GPU)
    image_tensor = image_tensor.to(device)
    
    # Perform inference (no gradients needed)
    try:
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = F.softmax(outputs, dim=1)  # Get class probabilities
            _, predicted = torch.max(outputs, 1)  # Get the predicted class
        
        predicted_class = class_names[predicted.item()]
        probability = probabilities[0][predicted.item()].item() * 100
        logging.info(f"Prediction complete: {predicted_class} with probability {probability:.2f}%")
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        raise

    return predicted_class, probability

def classify_image(image_path):
    model_path = 'model/resnet50_binary.pt'  # Ensure this path is correct
    try:
        model = load_model(model_path)
        image_tensor = preprocess_image(image_path)
        predicted_class, probability = predict_image(model, image_tensor)
        
        if predicted_class == 'working':
            logging.info(f"Classified image {image_path} as 'YES'.")
            return 'YES', image_path
        else:
            logging.info(f"Classified image {image_path} as 'NO'.")
            return 'NO', image_path
    except Exception as e:
        logging.error(f"Error during image classification: {e}")
        return 'ERROR', image_path

# Example usage:
# classify_image('1.jpg')
