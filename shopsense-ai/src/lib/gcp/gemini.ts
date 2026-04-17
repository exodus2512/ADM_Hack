import { GoogleGenAI, type ContentListUnion } from '@google/genai';
import { gcpConfig } from '@/lib/gcp/config';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  const project = gcpConfig.projectId;
  const location = gcpConfig.location;

  if (gcpConfig.useVertexAi && project && location) {
    aiClient = new GoogleGenAI({ vertexai: true, project, location });
    return aiClient;
  }

  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  }

  return null;
}

export async function generateGeminiText(prompt: string, systemInstruction?: string): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  const response = await client.models.generateContent({
    model: gcpConfig.geminiModel,
    contents: prompt,
    config: {
      ...(systemInstruction ? { systemInstruction } : {}),
      temperature: 0.4,
    },
  });

  return response.text ?? null;
}

export async function generateGeminiVisionText(
  textPrompt: string,
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) return null;

  const contents: ContentListUnion = [
    {
      role: 'user',
      parts: [
        { text: textPrompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
      ],
    },
  ];

  const response = await client.models.generateContent({
    model: gcpConfig.geminiVisionModel,
    contents,
    config: { temperature: 0.2 },
  });

  return response.text ?? null;
}
