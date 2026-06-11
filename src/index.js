export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // Salvar dados no KV
        if (url.pathname === "/api/admin/save" && request.method === "POST") {
            try {
                const data = await request.json();
                await env.TONDA_DB.put("tonda_pizzaria", JSON.stringify(data));
                return new Response(JSON.stringify({ status: "ok" }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            } catch (e) {
                return new Response(JSON.stringify({ status: "erro", erro: e.message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
        }

        // Carregar dados do KV
        if (url.pathname === "/api/admin/load" && request.method === "GET") {
            try {
                const raw = await env.TONDA_DB.get("tonda_pizzaria");
                const data = raw ? JSON.parse(raw) : null;
                return new Response(JSON.stringify(data), {
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            } catch (e) {
                return new Response(JSON.stringify({ status: "erro", erro: e.message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
        }

        // Endpoint para pedidos
        if (url.pathname === "/api/pedidos" && request.method === "POST") {
            try {
                const pedido = await request.json();
                return new Response(JSON.stringify({ status: "ok", recebido: pedido }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            } catch (e) {
                return new Response(JSON.stringify({ status: "erro", erro: e.message }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
        }

        return new Response("Not found", { status: 404 });
    },
};
