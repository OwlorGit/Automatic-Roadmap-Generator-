import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // Artificial 200ms delay to simulate the API network loading
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Return hardcoded mock data that matches new dark mode structure perfectly
    return NextResponse.json({
      totalDuration: "3 Weeks",
      nodes: [
        {
          id: 1,
          title: "1. Mocking Foundation Track",
          description: "This is fake data to test dark mode styling safely without wasting API quota.",
          duration: "2 hours",
          category: "foundation",
          resources: ["Video: How to mock APIs", "Article: Local testing"],
          prerequisites: []
        },
        {
          id: 2,
          title: "2. Core Interface Layout",
          description: "Look at how cleanly this card positions on the whiteboard grid lines.",
          duration: "4 hours",
          category: "core",
          resources: ["Practice: CSS Grid layouts"],
          prerequisites: ["1. Mocking Foundation Track"]
        },
        {
          id: 3,
          title: "2. Core Interface Layout",
          description: "Look at how cleanly this card positions on the whiteboard grid lines.",
          duration: "4 hours",
          category: "advanced",
          resources: ["Practice: CSS Grid layouts"],
          prerequisites: ["1. Mocking Foundation Track"]
        },
        {
          id: 4,
          title: "4. Core Interface Layout",
          description: "Look at how cleanly this card positions on the whiteboard grid lines.",
          duration: "4 hours",
          category: "project",
          resources: ["Practice: CSS Grid layouts"],
          prerequisites: ["1. Mocking Foundation Track"]
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Mock failure" }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     // 1. Check if the environment key is blank or missing
//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json({ 
//         error: "Missing API Key", 
//         details: "Your GEMINI_API_KEY is not being read from .env.local. Make sure the file name has a dot at the beginning and sits in your root project directory." 
//       }, { status: 500 });
//     }

//     const { topic } = await req.json();
    
//     // 2. Initialize with confirmed key
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
//     // Using 1.5-flash here as it is highly stable across all free-tier accounts
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-3.5-flash",
//       generationConfig: {
//         responseMimeType: "application/json",
//       }
//     });

//     const prompt = `
//       Create a comprehensive roadmap with a begineer, intermediate and advanced level for the following topic: "${topic}".
//       You must respond with a raw JSON object matching this exact structure:
//       {
//         "totalDuration": "e.g., 4 Weeks Total,
//         "nodes": [
//           {
//             "id": 1,
//             "title": "Step Name",
//             "description": "Short explanation of this step.",
//             "duration" "e.g., 3-4 hours",
//             "category": "Choose exactly one: foundation, core, advanced, or project",
//             "resources": ["YouTube: Specific Guide Tutorial", "Article: In-depth Documentation Walkthrough"],
//             "prerequisites": ["Basic Concepts"]
//           }
//         ]
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     if (!responseText) {
//       return NextResponse.json({ error: "Empty Response", details: "The AI did not return any text layout." }, { status: 500 });
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json(data);

//   } catch (error: any) {
//     // 3. Package up the actual system error and send it out!
//     return NextResponse.json({ 
//       error: "Gemini System Crash", 
//       details: error.message || String(error) 
//     }, { status: 500 });
//   }
// }