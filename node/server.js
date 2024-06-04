const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

app.post('/ask', async (req, res) => {
    const question = req.body.question;
    const apiKey = process.env.GROQ_API_KEY;

    try {
        console.log(`Sending request to Groq API with question: ${question}`);
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
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

        console.log('Response from Groq API:', response.data);
        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`AI tutor app listening at http://localhost:${port}`);
});
