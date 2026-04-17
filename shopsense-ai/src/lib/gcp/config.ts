const env = process.env;

export const gcpConfig = {
  projectId: env.GCP_PROJECT_ID ?? 'admhack',
  location: env.GCP_LOCATION ?? 'us-central1',
  geminiModel: env.GEMINI_MODEL ?? 'gemini-1.5-pro',
  geminiVisionModel: env.GEMINI_VISION_MODEL ?? 'gemini-1.5-pro',
  useVertexAi: env.GEMINI_USE_VERTEX_AI === 'true',
  useFirebaseAuth: env.FIREBASE_AUTH_ENABLED === 'true',
  useVertexSearch: env.VERTEX_SEARCH_ENABLED === 'true',
  vertexSearchServingConfig: env.VERTEX_SEARCH_SERVING_CONFIG ?? '',
  firebaseStorageBucket: env.FIREBASE_STORAGE_BUCKET ?? '',
};

export function hasGoogleCredentials(): boolean {
  return Boolean(env.GOOGLE_APPLICATION_CREDENTIALS_JSON || env.GOOGLE_APPLICATION_CREDENTIALS);
}

export function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('GCP server utilities must only run on the server.');
  }
}
