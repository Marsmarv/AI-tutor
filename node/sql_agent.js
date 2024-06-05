const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GROQ_API_KEY;

const connectDb = (dbPath) => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });
  return db;
};

const executeQuery = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const listColumns = (db, tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          console.error(`No columns found for table: ${tableName}`);
        }
        const columns = rows.map((info) => info.name);
        resolve(columns);
      }
    });
  });
};

const validateSqlQuery = (query, columns) => {
  for (const column of columns) {
    if (query.includes(column)) {
      return query;
    }
  }
  throw new Error('The generated SQL query contains non-existent columns.');
};

const questionToSql = async (question, columns) => {
  const prompt = {
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Convert the following natural language question into a SQL query using the columns: ${columns.join(', ')} in the Customers table.\n\nQuestion: ${question}` },
    ],
    max_tokens: 150,
    temperature: 0.5,
  };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', prompt, { headers });
    if (response.data.choices) {
      let sqlQuery = response.data.choices[0].message.content;
      sqlQuery = sqlQuery.split('```sql')[1].split('```')[0].trim();
      sqlQuery = validateSqlQuery(sqlQuery, columns);
      return sqlQuery;
    } else {
      throw new Error('Unexpected response format from Groq API');
    }
  } catch (error) {
    throw new Error(`Error: ${error.response ? error.response.data.error.message : error.message}`);
  }
};

const cleanUpResponse = (response) => {
  let cleanedResponse = response.replace('Here is the natural language answer:\n\n', '').trim();
  cleanedResponse = cleanedResponse.replace('Here is the list of employees from the company:\n\n', '').trim();
  return cleanedResponse;
};

const resultToAnswer = async (results) => {
  const prompt = {
    model: 'llama3-8b-8192',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Convert the following SQL query result into a natural language answer:\n\nResults: ${JSON.stringify(results)}` },
    ],
    max_tokens: 150,
    temperature: 0.5,
  };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', prompt, { headers });
    if (response.data.choices) {
      let answer = response.data.choices[0].message.content;
      answer = cleanUpResponse(answer);
      return answer;
    } else {
      throw new Error('Unexpected response format from Groq API');
    }
  } catch (error) {
    throw new Error(`Error: ${error.response ? error.response.data.error.message : error.message}`);
  }
};

const main = async () => {
  const dbPath = path.join(__dirname, 'northwind.db'); 
  const db = connectDb(dbPath);

  const columns = await listColumns(db, 'Customers');

  console.log('AI SQL Agent is ready. Type "exit" to quit.');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.on('line', async (question) => {
    if (question.toLowerCase() === 'exit') {
      readline.close();
      db.close();
      return;
    }

    try {
      const sqlQuery = await questionToSql(question, columns);
      const results = await executeQuery(db, sqlQuery);
      const answer = await resultToAnswer(results);
      console.log(`AI: ${answer}`);
    } catch (error) {
      console.error(error.message);
    }
  });
};

main();
