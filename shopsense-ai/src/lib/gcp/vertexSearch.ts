import { GoogleAuth } from 'google-auth-library';
import { gcpConfig } from '@/lib/gcp/config';

export interface VertexSearchDocument {
  id: string;
  title: string;
  uri?: string;
  score?: number;
  summary?: string;
}

export async function queryVertexSearch(query: string, userPseudoId?: string): Promise<VertexSearchDocument[] | null> {
  if (!gcpConfig.useVertexSearch || !gcpConfig.vertexSearchServingConfig || !gcpConfig.projectId) {
    return null;
  }

  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const tokenClient = await auth.getClient();
  const accessToken = await tokenClient.getAccessToken();
  const token = typeof accessToken === 'string' ? accessToken : accessToken?.token;

  if (!token) return null;

  const endpoint = `https://discoveryengine.googleapis.com/v1/${gcpConfig.vertexSearchServingConfig}:search`;
  const body = {
    query,
    pageSize: 24,
    userPseudoId: userPseudoId || 'anonymous-user',
    contentSearchSpec: {
      summarySpec: {
        summaryResultCount: 3,
      },
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const results = Array.isArray(payload?.results) ? payload.results : [];

  return results.map((r: any, index: number) => {
    const doc = r.document || {};
    const derivedStruct = doc.derivedStructData || {};
    const title = doc.structData?.title || derivedStruct.title || `Result ${index + 1}`;

    return {
      id: doc.id || String(index + 1),
      title,
      uri: doc.structData?.uri || derivedStruct.link,
      score: r.relevanceScore,
      summary: payload?.summary?.summaryText,
    };
  });
}
