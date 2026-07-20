import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from 'langchain'
import { ChatMistralAI } from '@langchain/mistralai'
import 'dotenv/config'
import { internetSearch } from "./internet.service.js";
import * as z from 'zod'

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(
    internetSearch,
    {
        name: "searchInternet",
        description: "Use this tool to get latest information form the internet. Useful for when you need to answer questions about current events or find information that is not in your training data.",
        schema: z.string().describe("The search query to look up on the internet")
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [searchInternetTool]
})

export async function generateResponse(messages, imageFilePath = null) {
    if (imageFilePath) {
        const fs = await import('fs');
        const path = await import('path');
        const ext = path.extname(imageFilePath).toLowerCase();
        const isImg = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        
        if (isImg) {
            const imageBuffer = fs.readFileSync(imageFilePath);
            const base64Image = imageBuffer.toString('base64');
            const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
            const mimeType = mimeMap[ext] || 'image/jpeg';

            // Build the conversation history for context
            const historyMessages = messages.slice(0, -1).map((msg) => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            }).filter(Boolean)

            // Build the latest message with image
            const latestUserText = messages[messages.length - 1]?.content || "What is in this image?"
            const multimodalMessage = new HumanMessage({
                content: [
                    { type: "text", text: latestUserText },
                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                ]
            })

            const response = await geminiModel.invoke([...historyMessages, multimodalMessage])
            return response.text
        } else {
            // It is a text-based document or file. Read contents and prepend to the prompt.
            try {
                const fileContent = fs.readFileSync(imageFilePath, 'utf8');
                const fileName = path.basename(imageFilePath);
                
                // Get the latest user message text
                const latestUserText = messages[messages.length - 1]?.content || "";
                
                // Construct a new prompt with the file content injected
                const promptWithFile = `[Attached File: ${fileName}]\n=== FILE CONTENT START ===\n${fileContent}\n=== FILE CONTENT END ===\n\nUser Question: ${latestUserText}`;

                const mappedMessages = messages.map((msg, index) => {
                    if (index === messages.length - 1) {
                        return new HumanMessage(promptWithFile);
                    }
                    if (msg.role == "user") {
                        return new HumanMessage(msg.content)
                    } else if (msg.role == "ai") {
                        return new AIMessage(msg.content)
                    }
                }).filter(Boolean);

                const response = await agent.invoke({
                    messages: mappedMessages
                });
                return response.messages[response.messages.length - 1].text;
            } catch (err) {
                console.error("Could not read attached file as text, sending without attachment content:", err);
            }
        }
    }

    // Text-only: use the Mistral agent with internet search
    const response = await agent.invoke({
        messages: messages.map((msg) => {
            if (msg.role == "user") {
                return new HumanMessage(msg.content)
            } else if (msg.role == "ai") {
                return new AIMessage(msg.content)
            }
        })
    })

    return response.messages[response.messages.length - 1].text
}

export async function generateChatTitle(message) {

    const response = await mistralModel.invoke([
        new SystemMessage("You are a helpful assistant that generates consise and descriptive titles for chat conversation based on a single user message. The title should be no more than 4 words and should not include any special characters or punctuation."),
        new HumanMessage(message)
    ]);

    return response.text
}
