
# AI Tutor

This repository contains implementations of an AI tutor using both Python and Node.js. The AI tutor uses the Groq API to provide answers to user questions.

## Project Structure
```plaintext
ai-tutor/
├── node/
│   ├── cli.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── python/
│   ├── cli.py
│   ├── server.py
│   ├── requirements.txt
│   └── .env
└── README.md
└── .gitignore
```

## Prerequisites

- Node.js (for the Node.js implementation)
- Python 3 (for the Python implementation)

## Getting Started

### Node.js Implementation

1. **Navigate to the Node.js project directory**:
   ```bash
   cd node 
   ```
2. **Install the required packages**:
   ```bash
   npm install
   ```
3. **Create a `.env` file**:
   ```plaintext
   GROQ_API_KEY=your_actual_api_key_here
   ```
4. **Run the Node.js server**:
   ```bash
   npm start
   ```
5. **Use the Node.js CLI**:
   ```bash
   node cli.js
   ```

   ### Python Implementation

1. **Navigate to the Python project directory**:
   ```bash
   cd python 
   ```
2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate 
   ```
3. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a `.env` file**:
   ```plaintext
   GROQ_API_KEY=your_actual_api_key_here
   ```
5. **Run the Python server**:
   ```bash
   python server.py
   ```
6. **Use the Python CLI**:
   ```bash
   python cli.py
   ```

## Setting Up Environment Variables

Both implementations use an environment variable for the Groq API key. Set the environment variable as follows:

### Node.js

1. **Create a `.env` file in the `node` directory**:
   ```plaintext
   GROQ_API_KEY=your_actual_api_key_here
   ```
2. **Install `dotenv`**:
   ```bash
   npm install dotenv
   ```
3. **Run the Node.js CLI**:
   ```bash
   node cli.js
   ```
### Python

1. **Create a `.env` file in the `python` directory**:
   ```plaintext
   GROQ_API_KEY=your_actual_api_key_here
   ```
2. **Install `python-dotenv`**:
   ```bash
   pip install python-dotenv
   ```
3. **Ensure your scripts load the environment variables**:
   ```bash
   from dotenv import load_dotenv
   load_dotenv()
   ```

4. **Run the Python CLI**:
   ```bash
   python cli.py
   ```
## Pushing to GitHub

Add the `.env` file to `.gitignore` to ensure it is not pushed to the repository:

  ```plaintext
  # .gitignore
  node/node_modules/
  python/venv/
  node/.env
  python/.env
  ```

## Usage

To interact with the AI tutor, you can use either the Node.js or Python CLI. Simply type your questions in the terminal and receive answers from the AI tutor. Type `exit` to quit the CLI.

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests for any improvements.

## License

This project is licensed under the MIT License.