// Worker principal da pizzaria Tonda
// Cloudflare Workers Free: sem banco integrado, sem assets binding externo
// Sugestão: pedidos podem ser enviados por e-mail via serviço externo (não incluso aqui)

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS para permitir requisições do frontend
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // Endpoint para pedidos
        if (url.pathname === "/api/pedidos" && request.method === "POST") {
            try {
                const pedido = await request.json();
                // Aqui você pode integrar com e-mail, webhook, etc.
                return new Response(JSON.stringify({ status: "ok", recebido: pedido }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            } catch (e) {
                return new Response(JSON.stringify({ status: "erro", erro: e.message }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });
            }
        }

        // Para servir arquivos estáticos, use Cloudflare Pages OU Workers Sites (não assets binding)
        // Aqui, retorna 404 para qualquer outra rota
        return new Response("Not found", { status: 404 });
    },
};
