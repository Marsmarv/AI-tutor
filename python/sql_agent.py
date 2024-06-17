import os
import sqlite3
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GROQ_API_KEY')

def connect_db(db_path):
    conn = sqlite3.connect(db_path)
    return conn

def execute_query(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return results

def list_columns(conn, table_name):
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [info[1] for info in cursor.fetchall()]
    cursor.close()
    return columns

def validate_sql_query(query, columns):
    for column in columns:
        if column in query:
            return query
    raise ValueError("The generated SQL query contains non-existent columns.")

def question_to_sql(question, columns):
    prompt = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Convert the following natural language question into a SQL query using the columns: {', '.join(columns)}.\n\nQuestion: {question}"}
        ],
        "max_tokens": 150,
        "temperature": 0.5
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=prompt
    )
    response_data = response.json()
    if 'choices' in response_data:
        sql_query = response_data['choices'][0]['message']['content']
        sql_query = sql_query.split('```sql')[1].split('```')[0].strip()
        sql_query = validate_sql_query(sql_query, columns)
        return sql_query
    else:
        raise ValueError("Unexpected response format from Groq API")

def result_to_answer(results):
    prompt = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Convert the following SQL query result into a natural language answer:\n\nResults: {results}"}
        ],
        "max_tokens": 150,
        "temperature": 0.5
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions", 
        headers=headers,
        json=prompt
    )
    response_data = response.json()
    if 'choices' in response_data:
        answer = response_data['choices'][0]['message']['content']
        answer = answer.replace("Here is the natural language answer:\n\n", "").strip()
        return answer
    else:
        raise ValueError("Unexpected response format from Groq API")

def main():
    db_path = 'northwind.db' 
    conn = connect_db(db_path)

    columns = list_columns(conn, 'Customers')

    print("AI SQL Agent is ready. Type 'exit' to quit.")
    while True:
        question = input("You: ")
        if question.lower() == 'exit':
            break

        try:
            sql_query = question_to_sql(question, columns)
            results = execute_query(conn, sql_query)
            answer = result_to_answer(results)
            print(f"AI: {answer}")
        except Exception as e:
            print(f"Error: {str(e)}")

    conn.close()

if __name__ == '__main__':
    main()
