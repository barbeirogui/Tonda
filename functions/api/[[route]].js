export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const TOKEN = env.API_TOKEN || "";
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY;

  function isAuthorized(req) {
    const auth = req.headers.get("Authorization");
    return auth === `Bearer ${TOKEN}`;
  }

  function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  async function sb(path, options = {}) {
    const fullUrl = `${SUPABASE_URL}/rest/v1${path}`;
    const resp = await fetch(fullUrl, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Supabase ${resp.status}: ${text}`);
    }
    return resp;
  }

  function extractTel(pedido) {
    return (pedido.tel || pedido.telefone || "").replace(/\D/g, "");
  }

  // ─────────────────── Admin: salvar dados (config, insumos, pizzas...) ──────
  if (url.pathname === "/api/admin/save" && request.method === "POST") {
    if (!isAuthorized(request)) return json({ status: "erro", erro: "Não autorizado" }, 401);
    try {
      const text = await request.text();
      if (text.length > 5 * 1024 * 1024) return json({ status: "erro", erro: "Payload muito grande" }, 413);
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") return json({ status: "erro", erro: "JSON inválido" }, 400);
      await sb("/dados", {
        method: "POST",
        body: JSON.stringify({ id: "tonda_pizzaria", data }),
        headers: { Prefer: "resolution=merge-duplicates" },
      });
      return json({ status: "ok" });
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Admin: carregar dados ─────────────────────────────────
  if (url.pathname === "/api/admin/load" && request.method === "GET") {
    try {
      const resp = await sb("/dados?id=eq.tonda_pizzaria&select=data");
      const rows = await resp.json();
      return json(rows.length > 0 ? rows[0].data : null);
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Admin: listar pedidos ─────────────────────────────────
  if (url.pathname === "/api/admin/pedidos" && request.method === "GET") {
    if (!isAuthorized(request)) return json({ status: "erro", erro: "Não autorizado" }, 401);
    try {
      const resp = await sb("/pedidos?select=dados&order=id.desc");
      const rows = await resp.json();
      return json(rows.map(r => r.dados));
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Admin: salvar array de pedidos (migração) ────────────
  if (url.pathname === "/api/admin/pedidos/salvar" && request.method === "POST") {
    if (!isAuthorized(request)) return json({ status: "erro", erro: "Não autorizado" }, 401);
    try {
      const pedidos = await request.json();
      if (!Array.isArray(pedidos)) return json({ status: "erro", erro: "Formato inválido, esperado array" }, 400);
      const rows = pedidos.map(p => ({
        tracking_id: p.trackingId,
        tel: extractTel(p),
        dados: p,
      }));
      await sb("/pedidos", {
        method: "POST",
        body: JSON.stringify(rows),
        headers: { Prefer: "resolution=merge-duplicates" },
      });
      return json({ status: "ok" });
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Admin: deletar pedido ─────────────────────────────────
  if (url.pathname === "/api/admin/pedido/delete" && request.method === "POST") {
    if (!isAuthorized(request)) return json({ status: "erro", erro: "Não autorizado" }, 401);
    try {
      const { trackingId } = await request.json();
      if (!trackingId) return json({ status: "erro", erro: "trackingId é obrigatório" }, 400);
      const resp = await sb(`/pedidos?tracking_id=eq.${encodeURIComponent(trackingId)}`, { method: "DELETE" });
      if (resp.status === 204) return json({ status: "ok" });
      return json({ status: "erro", erro: "Pedido não encontrado" }, 404);
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Admin: atualizar status do pedido ─────────────────────
  if (url.pathname === "/api/admin/pedido/status" && request.method === "POST") {
    if (!isAuthorized(request)) return json({ status: "erro", erro: "Não autorizado" }, 401);
    try {
      const { trackingId, status } = await request.json();
      if (!trackingId || !status) return json({ status: "erro", erro: "trackingId e status são obrigatórios" }, 400);

      const resp = await sb(`/pedidos?tracking_id=eq.${encodeURIComponent(trackingId)}&select=dados`);
      const rows = await resp.json();
      if (rows.length === 0) return json({ status: "erro", erro: "Pedido não encontrado" }, 404);

      const pedido = rows[0].dados;
      pedido.status = status;
      pedido.statusHistory = pedido.statusHistory || [];
      pedido.statusHistory.push({ status, timestamp: new Date().toISOString() });

      const tel = extractTel(pedido);
      await sb(`/pedidos?tracking_id=eq.${encodeURIComponent(trackingId)}`, {
        method: "PATCH",
        body: JSON.stringify({ dados: pedido, tel }),
      });
      return json({ status: "ok", pedido });
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Cliente: consultar status do pedido ───────────────────
  if (url.pathname === "/api/pedido/status" && request.method === "GET") {
    try {
      const tel = url.searchParams.get("tel");
      if (!tel) return json({ status: "erro", erro: "Telefone é obrigatório" }, 400);

      const normalizedTel = tel.replace(/\D/g, "");
      const suffix = normalizedTel.slice(-8);

      const resp = await sb("/pedidos?select=dados&order=id.desc");
      const rows = await resp.json();
      const meusPedidos = rows
        .filter(r => {
          const pTel = extractTel(r.dados);
          return pTel.includes(suffix);
        })
        .map(p => ({
          trackingId: p.dados.trackingId,
          status: p.dados.status,
          statusHistory: p.dados.statusHistory || [],
          data: p.dados.data,
          dataAgendada: p.dados.dataAgendada,
          agendado: p.dados.agendado || false,
          total: p.dados.total,
          carrinho: (p.dados.carrinho || []).map(i => ({ nome: i.nome, qtd: i.qtd, tipo: i.tipo, sabores: i.sabores })),
          nome: p.dados.nome,
        }));

      return json(meusPedidos);
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  // ─────────────────── Cliente: criar novo pedido ────────────────────────────
  if (url.pathname === "/api/pedidos" && request.method === "POST") {
    try {
      const text = await request.text();
      if (text.length > 1024 * 1024) return json({ status: "erro", erro: "Payload muito grande" }, 413);
      const pedido = JSON.parse(text);
      if (!pedido || typeof pedido !== "object") return json({ status: "erro", erro: "JSON inválido" }, 400);

      if (!pedido.data) pedido.data = new Date().toISOString();
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
      pedido.trackingId = `TD-${code}`;
      pedido.status = pedido.agendado ? "Agendado" : "Recebido";
      pedido.statusHistory = [{ status: pedido.status, timestamp: pedido.data }];

      const tel = extractTel(pedido);
      await sb("/pedidos", {
        method: "POST",
        body: JSON.stringify({
          tracking_id: pedido.trackingId,
          tel,
          dados: pedido,
        }),
        headers: { Prefer: "return=representation" },
      });

      return json({ status: "ok", trackingId: pedido.trackingId, recebido: pedido });
    } catch (e) {
      if (e instanceof SyntaxError) return json({ status: "erro", erro: "JSON inválido" }, 400);
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  return json({ status: "erro", erro: "Rota não encontrada" }, 404);
}
