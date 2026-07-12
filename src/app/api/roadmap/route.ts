import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({
    totalDuration: "1 Week",
    nodes: [
      // ==========================================
      // LEVEL 0: FOUNDATION (Column 1)
      // ==========================================
      {
        id: 1,
        level: 0,
        dependsOn: [],
        title: "1. Environmental Diagnostics",
        description: "Verify compiler pipelines, wipe directory cache files, and calibrate workspace settings.",
        duration: "1-2 hours",
        category: "foundation",
        resources: ["Article: Setting Up Local Dev Clusters"],
        prerequisites: []
      },
      {
        id: 2,
        level: 0,
        dependsOn: [],
        title: "2. Architecture Blueprinting",
        description: "Map out systemic boundaries, operational requirements, and global component layouts.",
        duration: "2 hours",
        category: "foundation",
        resources: ["YouTube: System Architecture Design Patterns"],
        prerequisites: []
      },

      // ==========================================
      // LEVEL 1: CORE ENGINE (Column 2)
      // ==========================================
      {
        id: 3,
        level: 1,
        dependsOn: [1],
        title: "3. Interface State Hydration",
        description: "Bind real-time parameters to the view tree and handle asynchronous render updates smoothly.",
        duration: "3-4 hours",
        category: "core",
        resources: ["Practice: React Lifecycle Sandbox Exercises"],
        prerequisites: ["Environmental Diagnostics"]
      },
      {
        id: 4,
        level: 1,
        dependsOn: [2],
        title: "4. Schema Layout Generators",
        description: "Inject dynamic structures into the data layer and organize relational map collections.",
        duration: "4 hours",
        category: "core",
        resources: ["Video: Advanced Mapping Operations & Objects"],
        prerequisites: ["Architecture Blueprinting"]
      },
      {
        id: 5,
        level: 1,
        dependsOn: [1],
        title: "5. Route Interceptor Guards",
        description: "Secure data pipelines by isolating local execution threads from background runtime hooks.",
        duration: "2-3 hours",
        category: "core",
        resources: ["Article: Securing Client-Server Proxies"],
        prerequisites: ["Environmental Diagnostics"]
      },

      // ==========================================
      // LEVEL 2: ADVANCED & OPTIMIZATION (Column 3)
      // ==========================================
      {
        id: 6,
        level: 2,
        dependsOn: [3, 4],
        title: "6. Compilation Tuning",
        description: "Audit chunk payloads, leverage modern minifiers, and trim overhead bundle footprints.",
        duration: "5-6 hours",
        category: "advanced",
        resources: ["YouTube: Speeding Up Next.js & Turbopack"],
        prerequisites: ["Interface State Hydration", "Schema Layout Generators"]
      },
      {
        id: 7,
        level: 2,
        dependsOn: [5],
        title: "7. Resilient Failover Pipelines",
        description: "Incorporate robust exception handling routines to keep structural states intact.",
        duration: "4 hours",
        category: "advanced",
        resources: ["Practice: Writing Secure Fallback Strategies"],
        prerequisites: ["Route Interceptor Guards"]
      },

      // ==========================================
      // LEVEL 3: PRACTICAL APPLICATIONS (Column 4)
      // ==========================================
      {
        id: 8,
        level: 3,
        dependsOn: [6, 7],
        title: "8. Automated Sandbox Suite",
        description: "Build mock automation test routines that safely exercise complex layouts without token costs.",
        duration: "8 hours",
        category: "project",
        resources: ["Course: End-to-End Simulation Frameworks"],
        prerequisites: ["Compilation Tuning", "Resilient Failover Pipelines"]
      },
      {
        id: 9,
        level: 3,
        dependsOn: [6],
        title: "9. Live Multi-Cluster Deployment",
        description: "Ship pristine operational configurations straight into staging containers.",
        duration: "6 hours",
        category: "project",
        resources: ["Project Checklist: Cloud Deployment Metrics"],
        prerequisites: ["Compilation Tuning"]
      }
    ]
  });
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
//       Create a comprehensive roadmap for the topic: "${topic}".
//       Return a raw JSON object with this exact structure:
//       {
//         "totalDuration": "A short summary such as 3 Weeks Total",
//         "nodes": [
//           {
//             "id": 1,
//             "level": 0,
//             "dependsOn": [],
//             "title": "Step name",
//             "description": "Short explanation of why this step matters",
//             "duration": "3-4 hours",
//             "category": "foundation",
//             "resources": ["YouTube: Specific Guide Tutorial", "Article: In-depth Documentation Walkthrough"],
//             "prerequisites": ["Basic Concepts"]
//           }
//         ]
//       }

//       Rules:
//       - Use a numeric level for each node so the UI can place cards by depth.
//       - Make each later step's level greater than or equal to the level of its prerequisites.
//       - Use dependsOn as an array of parent node ids.
//       - Start with beginner-friendly foundation steps at lower levels.
//       - Make the roadmap progress logically from basics to more advanced work.
//       - Keep the response valid JSON only, with no markdown fences.
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();
//     console.log("Gemini roadmap response:", responseText);

//     if (!responseText) {
//       return NextResponse.json({ error: "Empty Response", details: "The AI did not return any text layout." }, { status: 500 });
//     }

//     const data = JSON.parse(responseText);
//     const normalizedNodes = (data.nodes || []).map((node: any, index: number) => ({
//       ...node,
//       id: typeof node.id === "number" ? node.id : index + 1,
//       level: typeof node.level === "number" ? node.level : 0,
//       dependsOn: Array.isArray(node.dependsOn) ? node.dependsOn : [],
//     }));

//     return NextResponse.json({
//       ...data,
//       nodes: normalizedNodes,
//     });

//   } catch (error: any) {
//     // 3. Package up the actual system error and send it out!
//     return NextResponse.json({ 
//       error: "Gemini System Crash", 
//       details: error.message || String(error) 
//     }, { status: 500 });
//   }
// }