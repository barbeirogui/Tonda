const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

async function main() {
  const SQL = await initSqlJs();
  const kvDir = ".wrangler/state/v3/kv/miniflare-KVNamespaceObject";
  const files = fs.readdirSync(kvDir);
  const sqliteFile = files.find(
    (f) => f.endsWith(".sqlite") && f !== "metadata.sqlite"
  );
  if (!sqliteFile) {
    console.log("Nenhum SQLite KV encontrado");
    return;
  }
  const filePath = path.join(kvDir, sqliteFile);
  console.log("Lendo:", filePath);
  console.log("Tamanho:", fs.statSync(filePath).size);
  
  const buf = fs.readFileSync(filePath);
  console.log("Lido", buf.length, "bytes");
  
  const db = new SQL.Database(buf);
  
  try {
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", JSON.stringify(tables));
    
    if (tables.length === 0) {
      console.log("Nenhuma tabela encontrada. Banco vazio ou apenas metadados.");
    }
    
    for (const t of tables) {
      const name = t.values[0][0];
      console.log("\nTabela:", name);
      const count = db.exec(`SELECT COUNT(*) as cnt FROM "${name}"`);
      console.log("Registros:", JSON.stringify(count));
      const data = db.exec(`SELECT * FROM "${name}" LIMIT 5`);
      console.log("Dados:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Erro SQL:", e.message);
  }
  
  db.close();
}
main().catch(console.error);
