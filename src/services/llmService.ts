import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function getActionableSteps(noteContent: string): Promise<any> {
    const prompt = `Extract actionable steps from the following doctor's note in strict JSON format (no markdown):
    {
      "checklist": [{"description": ""}],
      "plan": [{
        "description": "",
        "schedule": {
          "startDate": "2025-02-13T10:00:00.000Z", // Use ISO 8601 format
          "repeatDays": 0,
          "occurrences": 0
        }
      }]
    }
    If no specific schedule date is mentioned in the note, set "startDate" to the current date. Otherwise, use the provided date from the note content.
    
    Note: ${noteContent}`;
    

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    return parseLLMResponse(response);
  } catch (error) {
    console.error("Error extracting actionable steps:", error);
    return null;
  }
}

function parseLLMResponse(response: string): any {
  // Remove unexpected characters, whitespace, or code blocks
  const cleaned = response.replace(/^[^\[{]*|[^\]}]*$/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ JSON Parse Error:", error);
    console.error("LLM Response:", response);
    return null;
  }
}
