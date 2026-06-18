-- Tabela para dados do admin (JSON blob compatível com estrutura atual)
CREATE TABLE IF NOT EXISTS dados (
  id text PRIMARY KEY DEFAULT 'tonda_pizzaria',
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Tabela para pedidos (relacional, com suporte a status/tracking)
CREATE TABLE IF NOT EXISTS pedidos (
  id serial PRIMARY KEY,
  tracking_id text UNIQUE NOT NULL,
  tel text,
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Índices para busca
CREATE INDEX IF NOT EXISTS idx_pedidos_tracking_id ON pedidos(tracking_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_tel ON pedidos(tel);

-- RLS (segurança via service_role)
ALTER TABLE dados ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Primeiro dropar se existir, depois criar
DROP POLICY IF EXISTS service_role_all_dados ON dados;
DROP POLICY IF EXISTS service_role_all_pedidos ON pedidos;

CREATE POLICY service_role_all_dados ON dados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY service_role_all_pedidos ON pedidos FOR ALL USING (true) WITH CHECK (true);
