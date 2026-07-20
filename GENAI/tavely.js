const { tavily } = require('@tavily/core');
const readline = require('readline');

const tvly = tavily({ apiKey: process.env.TAVELY_API_KEY });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your question: ', async (question) => {
    const answer = await tvly.search(question);
    console.log(answer.results[0].content);
    rl.close();
});
