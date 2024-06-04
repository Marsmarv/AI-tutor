import os
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

api_key = os.getenv('GROQ_API_KEY')

client = Groq(
    api_key=api_key,
)

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question')
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": question,
                }
            ],
            model="llama3-8b-8192",
        )
        response_content = chat_completion.choices[0].message.content
        return jsonify({"answer": response_content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001)
