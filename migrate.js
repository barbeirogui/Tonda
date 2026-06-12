const SUPABASE_URL = "https://orgbcemfgxhwzmgohwhg.supabase.co";
const API_TOKEN = "tonda1103";
const OLD_API = "https://01f4379a.tondapizzaria.pages.dev";

async function getSupabaseKey() {
  if (process.env.SUPABASE_SERVICE_KEY) return process.env.SUPABASE_SERVICE_KEY;
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const key = await new Promise((r) => rl.question("Cole a SUPABASE_SERVICE_KEY: ", r));
  rl.close();
  return key.trim();
}

async function main() {
  const SUPABASE_KEY = await getSupabaseKey();
  if (!SUPABASE_KEY || SUPABASE_KEY.length < 20) {
    console.error("SUPABASE_SERVICE_KEY inválida");
    process.exit(1);
  }

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };

  // ─── DADOS ───
  console.log("Lendo dados do deployment antigo...");
  const r1 = await fetch(`${OLD_API}/api/admin/load`);
  const dados = await r1.json();

  if (dados && typeof dados === "object" && Object.keys(dados).length > 0) {
    console.log("Chaves:", Object.keys(dados).join(", "));
    console.log("Salvando no Supabase...");
    const r = await fetch(`${SUPABASE_URL}/rest/v1/dados`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ id: "tonda_pizzaria", data: dados }),
    });
    if (!r.ok) throw new Error(`Erro dados: ${r.status} ${await r.text()}`);
    console.log("Dados salvos!");
  } else {
    console.log("Nenhum dado encontrado.");
  }

  // ─── PEDIDOS ───
  console.log("\nLendo pedidos do deployment antigo...");
  const r2 = await fetch(`${OLD_API}/api/admin/pedidos`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  const pedidos = await r2.json();

  if (Array.isArray(pedidos) && pedidos.length > 0) {
    console.log(`${pedidos.length} pedidos encontrados.`);
    const rows = pedidos.map((p) => ({
      tracking_id: p.trackingId,
      tel: (p.tel || "").replace(/\D/g, ""),
      dados: p,
    }));
    console.log("Salvando no Supabase...");
    const r = await fetch(`${SUPABASE_URL}/rest/v1/pedidos`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(rows),
    });
    if (!r.ok) throw new Error(`Erro pedidos: ${r.status} ${await r.text()}`);
    console.log(`${pedidos.length} pedidos migrados!`);
  } else {
    console.log("Nenhum pedido.");
  }

  console.log("\n Migração concluída!");
}

main().catch((err) => {
  console.error("Falha:", err);
  process.exit(1);
});
