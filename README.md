##  Geminify - Turning History Text into Learnable Resources

This repository provides a toolchain for converting history text into a more interactive and engaging format suitable for learning.  It leverages the power of Google's Gemini AI to:

**1. Extract and Organize Concepts:**

- Processes text files containing historical information.
- Identifies key concepts and sub-concepts. 
- Creates a structured hierarchy of topics and sub-topics.
- Outputs this organization as JSON data for future use.

**2. Generate Multiple Choice Questions (MCQs):**

- Uses Gemini AI to generate MCQs based on the provided text. 
-  Categorizes each MCQ by its corresponding topic.
- Provides the correct answer with a brief explanation.

**3.  Automate OCR from PDFs:**

- A bash script `pdf_to_text.sh` automates the process of converting PDF files into images and then running OCR on those images. 
- This effectively turns PDFs into plain text for processing.

**Workflow:**

1. **PDF to Text:** Convert historical PDFs to text using the `pdf_to_text.sh` script. 
2. **Text to JSON:** Process the text files through the `run.sh` script which utilizes the `conv-history.js` script and Gemini AI to structure the information into JSON format. 
3. **Evaluation:** Use the `answer_evals.js` script to check the accuracy of the generated MCQs by comparing them to manually curated answer keys.
