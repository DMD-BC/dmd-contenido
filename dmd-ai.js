// Cliente de IA real de DMD (Groq) para Contenido IA, Canva IA y POS.
// Llama al backend que YA existe en el builder (crear.dmdmx.dev) —
// la llave de Groq vive solo en las variables de entorno de Vercel del
// builder, NUNCA en este archivo ni en el frontend.
// Uso: window.DMD_AI.generateText(prompt, kind) -> Promise<objeto|null>
// Devuelve null si la IA no responde: el llamador DEBE usar su texto
// local como respaldo (la herramienta nunca se rompe).
(function () {
  var API_URL = 'https://crear.dmdmx.dev/api/generate';

  function generateText(prompt, kind) {
    var body = { mode: 'text', prompt: String(prompt || '').slice(0, 1000) };
    if (kind) body.kind = String(kind);
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 55000);
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (json) {
        if (!json || !json.success || !json.data) return null;
        return json.data;
      })
      .catch(function () {
        clearTimeout(timer);
        return null;
      });
  }

  window.DMD_AI = { generateText: generateText, apiUrl: API_URL };
})();
