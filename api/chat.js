export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SYSTEM_PROMPT = `Você é um assistente especialista em mercado imobiliário de temporada, com foco no empreendimento UP LIFE STYLE em Poços de Caldas (MG). Studios no centro de Poços de Caldas, projetados para locação por temporada via Airbnb. Instagram: @uplifestylepc. Vendas: (35) 3722-2457. Entrega: Agosto 2026. Localização: Rua Rio Grande do Norte. A pé: Thermas 5min, Praça dos Macacos 3min, Igreja Matriz 1min. Área útil 32,29m². Entregue com ar condicionado, armários planejados, banheiro completo, check-in virtual via APP. Áreas comuns: Academia e Coworking. Preço: a partir de R$ 400.000 à vista. Valor de mercado R$ 500.000. Rentabilidade prevista 1% ao mês = 12% a.a. EasyPay: entrada 15%, parcelas a partir de R$ 3.458,33. Com 5 diárias já iguala aluguel convencional. Diária média R$ 300/noite. Retorno moderado: ~R$ 3.400/mês líquido. Poupança ~6% a.a., CDI ~10,5% a.a., UP Life Style 12% a.a. + R$100k valorização. Responda sempre em português brasileiro, de forma natural e amigável.`;

  try {
    const { messages } = req.body;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages }),
    });
    const data = await response.json();
    const reply = data.content?.find(b => b.type === "text")?.text || "Desculpe, tente novamente.";
    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "Erro interno." });
  }
}
