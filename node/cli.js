const axios = require('axios');
const readlineSync = require('readline-sync');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GROQ_API_KEY; 
const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';  
async function askQuestion(question) {
    try {
        const response = await axios.post(apiUrl, {
            messages: [
                {
                    role: 'user',
                    content: question
                }
            ],
            model: 'llama3-8b-8192' 
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        return 'Sorry, an error occurred.';
    }
}

async function main() {
    console.log("AI Tutor CLI");
    while (true) {
        const question = readlineSync.question('You: ');
        if (question.toLowerCase() === 'exit') {
            break;
        }
        const answer = await askQuestion(question);
        console.log(`AI: ${answer}`);
    }
}

main();
