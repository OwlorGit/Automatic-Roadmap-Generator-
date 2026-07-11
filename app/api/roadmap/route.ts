import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // 1. Check if the environment key is blank or missing
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "Missing API Key", 
        details: "Your GEMINI_API_KEY is not being read from .env.local. Make sure the file name has a dot at the beginning and sits in your root project directory." 
      }, { status: 500 });
    }

    const { topic } = await req.json();
    
    // 2. Initialize with confirmed key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using 1.5-flash here as it is highly stable across all free-tier accounts
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Create a beginner-friendly learning roadmap containing roughly 4-5 steps for the following topic: "${topic}".
      You must respond with a raw JSON object matching this exact structure:
      {
        "steps": [
          {
            "id": 1,
            "title": "Step Title",
            "description": "Short explanation.",
            "resources": ["YouTube: Tutorial"]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      return NextResponse.json({ error: "Empty Response", details: "The AI did not return any text layout." }, { status: 500 });
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);

  } catch (error: any) {
    // 3. Package up the actual system error and send it out!
    return NextResponse.json({ 
      error: "Gemini System Crash", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}