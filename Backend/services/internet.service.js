import { tavily } from "@tavily/core"

const tvly = tavily({ apiKey: process.env.TAVELY_API_KEY });

export async function internetSearch(question) {
    const answer = await tvly.search(query = question, include_images = true);
    // console.log("Tavely reply", answer.results);

    return JSON.stringify(answer)
}
