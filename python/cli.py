import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GROQ_API_KEY')
api_url = 'https://api.groq.com/openai/v1/chat/completions'

def ask_question(question):
    try:
        response = requests.post(api_url, json={
            'messages': [
                {
                    'role': 'user',
                    'content': question
                }
            ],
            'model': 'llama3-8b-8192'
        }, headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f'Error occurred: {e}')
        return 'Sorry, an error occurred.'

def main():
    print("AI Tutor CLI")
    while True:
        question = input('You: ')
        if question.lower() == 'exit':
            break
        answer = ask_question(question)
        print(f'AI: {answer}')

if __name__ == '__main__':
    main()
