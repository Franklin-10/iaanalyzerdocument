const AZ_ENDPOINT = import.meta.env.VITE_AZ_ENDPOINT;

export function POST_DOCUMENT(AZ_KEY, base64, MODEL_ID, API_VERSION) {
  return {
    url: `${AZ_ENDPOINT}/documentintelligence/documentModels/${MODEL_ID}:analyze?api-version=${API_VERSION}`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': AZ_KEY,
      },
      body: JSON.stringify({ base64Source: base64 }),
    },
  };
}
