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
      Create a comprehensive roadmap with a begineer, intermediate and advanced level for the following topic: "${topic}".
      You must respond with a raw JSON object matching this exact structure:
      {
        "totalDuration": "e.g., 4 Weeks Total,
        "nodes": [
          {
            "id": 1,
            "title": "Step Name",
            "description": "Short explanation of this step.",
            "duration" "e.g., 3-4 hours",
            "category": "Choose exactly one: foundation, core, advanced, or project",
            "resources": ["YouTube: Specific Guide Tutorial", "Article: In-depth Documentation Walkthrough"],
            "prerequisites": ["Basic Concepts"]
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