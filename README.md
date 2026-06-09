# Tonda Pizzaria - Deploy Cloudflare

## Estrutura do Projeto
- **index.html**: Site público (frontend)
- **tonda-admin.html**: Painel administrativo (protegido por PIN)
- **src/index.js**: Worker (API de pedidos)
- **wrangler.jsonc**: Configuração do Worker

## Melhorias implementadas
- Validação de formulário e feedback ao usuário
- Proteção por PIN no admin
- CORS e tratamento de erros no backend
- Pronto para integração com serviço de e-mail (exemplo no README)
- SEO e acessibilidade básica

## Como publicar no Cloudflare

### 1. Frontend (Cloudflare Pages)
1. Crie um repositório no GitHub com index.html, tonda-admin.html e demais arquivos estáticos.
2. No painel Cloudflare, acesse "Pages" e conecte seu repositório.
3. Siga o fluxo (build command: vazio, output: root).
4. O site será publicado em https://<seu-projeto>.pages.dev

### 2. Backend (Cloudflare Workers)
1. Instale o Wrangler CLI:
   npm install -g wrangler
2. Faça login:
   wrangler login
3. No terminal, dentro da pasta do projeto, rode:
   wrangler publish
4. O endpoint será https://<nome-do-worker>.<subdomínio>.workers.dev

### 3. Conectar frontend e backend
- No frontend, envie pedidos para o endpoint do Worker (exemplo: fetch('https://<nome-do-worker>.<subdomínio>.workers.dev/api/pedidos'))

### 4. (Opcional) Receber pedidos por e-mail
- Crie conta no Formspree, EmailJS ou similar.
- No frontend, envie o pedido para o serviço de e-mail ou configure o Worker para chamar o webhook do serviço.

---
Dúvidas? Consulte a documentação oficial do Cloudflare ou peça ajuda aqui!
