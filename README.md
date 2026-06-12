# Tonda Pizzaria

Site de pedidos + painel admin para pizzaria.

**Stack:** Cloudflare Pages + Supabase (PostgreSQL)

## Estrutura

- `index.html` — site público (cardápio, carrinho, checkout, meia a meio, agendamento, tracking)
- `tonda-admin.html` — painel admin (insumos, cardápio, pedidos com status, configurações)
- `functions/api/[[route]].js` — API (Cloudflare Functions)
- `wrangler.jsonc` — configuração Cloudflare

## Setup local

```bash
npm install
npx wrangler pages dev .
```

## Deploy

```bash
npx wrangler pages deploy .
```

## Variáveis de ambiente

No `wrangler.jsonc` (vai pro git):

| Chave | Valor |
|---|---|
| `API_TOKEN` | Token de autenticação da API |
| `SUPABASE_URL` | URL do projeto Supabase |

Secret (configurar uma vez via `wrangler secret put`):

| Chave | Valor |
|---|---|
| `SUPABASE_SERVICE_KEY` | Service role key do Supabase |

```bash
npx wrangler secret put SUPABASE_SERVICE_KEY
```

## Admin

- PIN padrão: `1234`
- URL: `/tonda-admin.html`
- API token: `tonda1103` (definido em `wrangler.jsonc`)
- WhatsApp: botão 📲 ao lado do telefone de cada pedido — abre wa.me com mensagem de status pré-preenchida

## Funcionalidades

- **Meia a Meio:** selecionar 2 sabores, cobra o valor do mais caro
- **Agendamento:** checkbox com data/hora no checkout
- **Acompanhamento:** cliente busca por telefone, barra de progresso por step
- **Status:** fundo colorido + texto branco, fluxo: Recebido → Preparando → Saiu pra entrega → Entregue
- **Estoque/CMV:** controle de insumos e custos no admin
