import { OPENAI_API_KEY } from "@/constant/env";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || "",
});

interface IClauseParams {
  createPrompt: () => void;
  initSystemPrompt: () => void;
  modelId: string;
}

export class ClauseGPT {
  private openaiClient: any; // Replace `any` with the appropriate type for `openai`
  private modelId: string;
  private systemPrompt: string;

  constructor() {
    this.openaiClient = openai;
    this.modelId = "gpt-4o-mini";
    this.systemPrompt = this.initSystemPrompt();
  }

  initSystemPrompt() {
    const systemPrompt = `Prompt:

You are an AI assistant specializing in analyzing legal text. Your task is to process a long unstructured string of legal clauses and identify potential issues or areas requiring review. Based on the analysis, return a JavaScript array of objects where each object contains the following structure:

status: An enum with two possible values:

"Missing": If the clause is incomplete or lacks critical details.
"Needs Review": If the clause has potential flaws, ambiguities, or requires further clarification.
title: A concise title summarizing the identified issue.

description: A detailed explanation of why the clause is marked as "Missing" or "Needs Review" and suggestions for improvement or areas to focus on.

The input will be a single unstructured string containing multiple clauses. Parse and analyze the text independently to identify issues.
Example Input:The agreement shall be governed by the laws of [Jurisdiction]. 
The party agrees to provide services within 30 days. 
Payment must be made promptly after service completion. 
If any party breaches the agreement, remedies shall apply.
output should be an array of objects in this format
Example JSON Output:[
  {
    "status": "Missing",
    "title": "Jurisdiction Not Specified",
    "description": "The governing law clause lacks a specific jurisdiction. Specify the jurisdiction to ensure clarity and enforceability."
  },
  {
    "status": "Needs Review",
    "title": "Ambiguous Service Delivery Timeline",
    "description": "The clause does not clarify what constitutes 'services' or the conditions for delay. Add more details about the services and exceptions to avoid disputes."
  },
  {
    "status": "Needs Review",
    "title": "Unclear Payment Terms",
    "description": "The clause does not specify the timeframe or method for payment. Provide clear details to avoid misunderstandings."
  },
  {
    "status": "Needs Review",
    "title": "Remedies for Breach Not Defined",
    "description": "The clause mentions remedies but does not define what they are. Include specific remedies to ensure enforceability."
  }
]
Analyze the input string and generate a structured output in the above format. Only return the structured JavaScript array of objects, nothing else.`;

    return systemPrompt;
  }

  extractJSONFromMessage(message: string) {
    const regex = /```json([\s\S]+?)```/; // Regular expression to match JSON within code blocks
    const match = message.match(regex); // Match the JSON code block
    if (match && match[1]) {
      try {
        const jsonStr = match[1].trim(); // Extract the JSON string and trim any leading/trailing whitespace
        const jsonObj = JSON.parse(jsonStr); // Parse the JSON string into a JavaScript object
        return jsonObj; // Return the parsed JSON object
      } catch (error) {
        console.error("Error parsing JSON:", error); // Log any parsing errors
        return null; // Return null if there's an error parsing the JSON
      }
    } else {
      console.error("No JSON code block found in the message."); // Log if no JSON code block is found
      return null; // Return null if no JSON code block is found
    }
  }

  async analyzeClause(data: string) {
    const response = await this.openaiClient.chat.completions.create({
      model: this.modelId,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: data },
      ],
    });

    const responseStr = response.choices[0].message.content;
    return JSON.parse(responseStr);
  }
}
