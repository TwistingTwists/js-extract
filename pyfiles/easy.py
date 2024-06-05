import easyocr
import os
from rich import print
from rich.panel import Panel

def ocr_image(image_path):
    """Reads an image, performs OCR, and saves the results to a text file."""

    reader = easyocr.Reader(['en'])  # Initialize EasyOCR reader with English language
    try:
        print(Panel(f"[bold blue]Processing image:[/] {image_path}", expand=False))
        result = reader.readtext(image_path)

        # Extract the filename without the extension
        filename = os.path.splitext(image_path)[0]

        # Save the results to a text file with the same name as the image
        with open(f"{filename}.txt", "w", encoding="utf-8") as f:
            print(Panel(f"[bold green]Saving results to:[/] {filename}.txt", expand=False))
            for bbox, text, confidence in result:
                f.write(f"{text} - Confidence: {confidence:.2f}\n")
        
        print(Panel(f"[bold green]OCR completed for:[/] {image_path}", expand=False))

    except Exception as e:
        print(Panel(f"[bold red]Error processing image:[/] {image_path}\n[red]{e}[/]", expand=False))


# # Specify the directory containing the images
# image_directory = "path/to/your/image/directory"

# # Iterate through the images in the directory
# print(Panel(f"[bold blue]Starting OCR process for directory:[/] {image_directory}", expand=False))
# for filename in os.listdir(image_directory):
#     if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
#         image_path = os.path.join(image_directory, filename)
#         ocr_image(image_path)




# Specify the root directory
root_directory = "/home/abhishek/Downloads/files_with_txt_2_/files_with_txt/pdf/images"

# Iterate through all subfolders and process images
print(Panel(f"[bold blue]Starting OCR process for directory:[/] {root_directory}", expand=False))
for root, _, files in os.walk(root_directory):
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(root, filename)
            ocr_image(image_path)
print(Panel(f"[bold green]OCR process completed![/]", expand=False))
