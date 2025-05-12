import React, { useState } from 'react';
import { POST_DOCUMENT } from './Api';
import './App.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [words, setWords] = useState(null);
  const [img, setImg] = useState({});

  const AZ_KEY = import.meta.env.VITE_AZ_KEY;
  const MODEL_ID = 'prebuilt-layout';
  const API_VERSION = '2024-11-30';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImg({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
    });
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Leitura de arquivo em base 64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        // 1) Começo da análise
        const { url, options } = POST_DOCUMENT(
          AZ_KEY,
          base64,
          MODEL_ID,
          API_VERSION,
        );
        const analyzeRes = await fetch(url, options);
        if (analyzeRes.status !== 202) {
          throw new Error(`Analyze failed: HTTP ${analyzeRes.status}`);
        }

        const operationUrl = analyzeRes.headers.get('Operation-Location');
        console.log(operationUrl);

        // 2) Pull do resultado
        let status = '';
        let analyzeResult = null;
        while (status !== 'succeeded' && status !== 'failed') {
          await new Promise((r) => setTimeout(r, 3000));
          const pollRes = await fetch(operationUrl, {
            headers: { 'Ocp-Apim-Subscription-Key': AZ_KEY },
          });
          const pollJson = await pollRes.json();
          status = pollJson.status;
          if (status === 'succeeded') {
            analyzeResult = pollJson.analyzeResult;
            console.log(analyzeResult);
          } else if (status === 'failed') {
            throw new Error('A análise do servidor falhou');
          }
        }
        setResult(analyzeResult);
        setWords(analyzeResult.pages[0].words);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <section className="container">
        <div className="upload">
          <h1 className="text-2xl font-bold mb-4">Analisar Documento</h1>
          <div>
            <label htmlFor="file-upload" className="ico">
              <i className="fa fa-cloud-upload"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="containerImg">
            {img.preview && (
              <div
                className="preview"
                style={{ backgroundImage: `url('${img.preview}')` }}
              ></div>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Análise o Documento'}
          </button>
        </div>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {result && (
          <div className="resultado">
            <h2 className="text-xl font-semibold mb-2">Resultado</h2>
            <ul className="contents">
              {words.map((e, id) => (
                <ul key={id} className="words">
                  <li>Texto: {e.content}</li>
                  <li>Convicção: {e.confidence * 100}%</li>
                </ul>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
