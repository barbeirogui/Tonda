export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const TOKEN = env.API_TOKEN || "";

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

  if (url.pathname === "/api/admin/save" && request.method === "POST") {
    if (!isAuthorized(request)) {
      return json({ status: "erro", erro: "Não autorizado" }, 401);
    }
    try {
      const text = await request.text();
      if (text.length > 5 * 1024 * 1024) {
        return json({ status: "erro", erro: "Payload muito grande" }, 413);
      }
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") {
        return json({ status: "erro", erro: "JSON inválido" }, 400);
      }
      await env.TONDA_DB.put("tonda_pizzaria", JSON.stringify(data));
      return json({ status: "ok" });
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  if (url.pathname === "/api/admin/load" && request.method === "GET") {
    try {
      const raw = await env.TONDA_DB.get("tonda_pizzaria");
      return json(raw ? JSON.parse(raw) : null);
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  if (url.pathname === "/api/admin/pedidos" && request.method === "GET") {
    if (!isAuthorized(request)) {
      return json({ status: "erro", erro: "Não autorizado" }, 401);
    }
    try {
      const raw = await env.TONDA_DB.get("tonda_pizzaria_pedidos");
      return json(raw ? JSON.parse(raw) : []);
    } catch (e) {
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  if (url.pathname === "/api/pedidos" && request.method === "POST") {
    try {
      const text = await request.text();
      if (text.length > 1024 * 1024) {
        return json({ status: "erro", erro: "Payload muito grande" }, 413);
      }
      const pedido = JSON.parse(text);
      if (!pedido || typeof pedido !== "object") {
        return json({ status: "erro", erro: "JSON inválido" }, 400);
      }
      if (!pedido.data) pedido.data = new Date().toISOString();
      const raw = await env.TONDA_DB.get("tonda_pizzaria_pedidos");
      const pedidos = raw ? JSON.parse(raw) : [];
      pedidos.push(pedido);
      await env.TONDA_DB.put("tonda_pizzaria_pedidos", JSON.stringify(pedidos));
      return json({ status: "ok", recebido: pedido });
    } catch (e) {
      if (e instanceof SyntaxError) {
        return json({ status: "erro", erro: "JSON inválido" }, 400);
      }
      return json({ status: "erro", erro: e.message }, 500);
    }
  }

  return json({ status: "erro", erro: "Rota não encontrada" }, 404);
}
