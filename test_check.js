
    // PIN protection (frontend only, not seguro para produção!)
    function doLogin() {
      const pin = [0, 1, 2, 3].map(i => document.getElementById('p' + i).value).join('');
      if (pin === PIN) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = '';
        document.getElementById('pin-error').textContent = '';
      } else {
        document.getElementById('pin-error').textContent = 'PIN incorreto.';
        [0, 1, 2, 3].forEach(i => document.getElementById('p' + i).value = '');
        document.getElementById('p0').focus();
      }
    }
    function pinInput(idx) {
      const el = document.getElementById('p' + idx);
      if (el.value.length === 1 && idx < 3) document.getElementById('p' + (idx + 1)).focus();
    }
    // ============================================================
    const PIN = "1103";
    const API_TOKEN = "tonda1103";
    const STORE_KEY = "tonda_pizzaria";
    const API_HOST = "";
    // ============================================================

    // ---- DEFAULT DATA ----
    const DEFAULT = {
      config: { nome: "Tonda Pizzaria Artesanal", whatsapp: "5511983746277", taxaEntrega: 0, tempoEstimado: "30-40 minutos", pin: PIN, cmvIdeal: 30, massaRecipe: [{insumoId:"i16",qtd:1},{insumoId:"i17",qtd:650},{insumoId:"i18",qtd:1},{insumoId:"i19",qtd:24},{insumoId:"i20",qtd:13}], massaPesoPaneto: 270 },
      insumos: [
        { id: "i1", nome: "Massa artesanal", unidade: "un", custo: 1.13, grupo: "massa" },
        { id: "i2", nome: "Mussarela Bacio", unidade: "kg", custo: 41.83, grupo: "cobertura" },
        { id: "i4", nome: "Linguiça Calabresa Reta Prieto", unidade: "kg", custo: 18.04, grupo: "cobertura" },
        { id: "i5", nome: "Frango desfiado", unidade: "kg", custo: 20.00, grupo: "cobertura" },
        { id: "i6", nome: "Requeijão Catupiry", unidade: "kg", custo: 38.95, grupo: "cobertura" },
        { id: "i7", nome: "Pepperoni Fatiado Ceratti", unidade: "kg", custo: 61.31, grupo: "cobertura" },
        { id: "i8", nome: "Presunto", unidade: "kg", custo: 24.00, grupo: "cobertura" },
        { id: "i9", nome: "Parmesão 6 Meses Fracionado Scala", unidade: "kg", custo: 89.88, grupo: "cobertura" },
        { id: "i10", nome: "Gorgonzola", unidade: "kg", custo: 52.00, grupo: "cobertura" },
        { id: "i11", nome: "Queijo Pecorino Cunha di Salerno", unidade: "kg", custo: 304.10, grupo: "cobertura" },
        { id: "i12", nome: "Tomate Pelado Italiano San Marzano", unidade: "kg", custo: 12.74, grupo: "cobertura" },
        { id: "i13", nome: "Mussarela de Búfala Cereja Yema", unidade: "kg", custo: 62.03, grupo: "cobertura" },
        { id: "i14", nome: "Caixa Oitavada Comum 35cm", unidade: "un", custo: 1.74, grupo: "cobertura" },
        { id: "i15", nome: "Água Mineral Buona Vita 6x1,5L", unidade: "cx", custo: 15.96, grupo: "cobertura" },
        { id: "i16", nome: "Farinha de trigo", unidade: "kg", custo: 5.00, grupo: "massa" },
        { id: "i17", nome: "Água", unidade: "g", custo: 0.001, grupo: "massa" },
        { id: "i18", nome: "Fermento biológico", unidade: "g", custo: 0.05, grupo: "massa" },
        { id: "i19", nome: "Sal", unidade: "g", custo: 0.002, grupo: "massa" },
        { id: "i20", nome: "Azeite de oliva", unidade: "g", custo: 0.08, grupo: "massa" },
      ],
      pizzas: [
        { id: "p1", nome: "Margherita", categoria: "Tradicionais", preco: 52, ativo: true, foto: "", complementos: [], ingredientes: [{ insumoId: "i1", quantidade: 1 }, { insumoId: "i2", quantidade: 0.25 }, { insumoId: "i12", quantidade: 0.12 }] },
        { id: "p2", nome: "Calabresa", categoria: "Tradicionais", preco: 54, ativo: true, foto: "", complementos: [], ingredientes: [{ insumoId: "i1", quantidade: 1 }, { insumoId: "i2", quantidade: 0.25 }, { insumoId: "i12", quantidade: 0.12 }, { insumoId: "i4", quantidade: 0.18 }] },
        { id: "p3", nome: "Quatro Queijos", categoria: "Premium", preco: 64, ativo: true, foto: "", complementos: [], ingredientes: [{ insumoId: "i1", quantidade: 1 }, { insumoId: "i2", quantidade: 0.20 }, { insumoId: "i6", quantidade: 0.10 }, { insumoId: "i9", quantidade: 0.05 }, { insumoId: "i10", quantidade: 0.05 }] },
        { id: "p4", nome: "Frango c/ Catupiry", categoria: "Tradicionais", preco: 58, ativo: true, foto: "", complementos: [], ingredientes: [{ insumoId: "i1", quantidade: 1 }, { insumoId: "i2", quantidade: 0.10 }, { insumoId: "i5", quantidade: 0.20 }, { insumoId: "i6", quantidade: 0.12 }] },
        { id: "p5", nome: "Pepperoni", categoria: "Premium", preco: 72, ativo: true, foto: "", complementos: [{ nome: "Extra pepperoni", preco: 8 }], ingredientes: [{ insumoId: "i1", quantidade: 1 }, { insumoId: "i2", quantidade: 0.20 }, { insumoId: "i12", quantidade: 0.10 }, { insumoId: "i7", quantidade: 0.15 }] },
      ],
      estoque: [], // [{insumoId, qtd, data, valorTotal}]
      vendas: [], // [{pizzaId, qtd, data}]
      consumo: [], // [{insumoId, qtd, data, pizzaNome}]
    };

    // ---- STORAGE ----
    function cloneDefault() { return JSON.parse(JSON.stringify(DEFAULT)) }
    function normalizeDb(data) {
      const base = cloneDefault();
      const db = data && typeof data === "object" ? data : {};
      const toArray = value => Array.isArray(value)
        ? value
        : (value && typeof value === "object" ? Object.values(value) : null);
      // Merge: base.insumos é a fonte primária; valores do KV só sobrescrevem se existirem
      let insumos = base.insumos.map(bi => {
        const saved = toArray(db.insumos)?.find(i => i.id === bi.id);
        return saved ? { ...bi, nome: saved.nome ?? bi.nome, unidade: saved.unidade ?? bi.unidade, custo: saved.custo ?? bi.custo } : bi;
      });
      // Adiciona insumos novos que existem no KV mas não no base
      toArray(db.insumos)?.forEach(si => {
        if (!insumos.some(i => i.id === si.id)) {
          insumos.push({ grupo: "cobertura", ...si });
        }
      });
      // Migra g → kg nos insumos salvos (dados legados)
      const gToKg = ["i2","i4","i5","i6","i7","i8","i9","i10","i11","i12","i13"];
      insumos.forEach(ins => {
        if (gToKg.includes(ins.id) && ins.unidade === "g") {
          ins.unidade = "kg";
          ins.custo = ins.custo * 1000;
        }
      });
      // Garante grupo nos insumos existentes; garante custo mínimo (massa i1 nunca zero)
      insumos.forEach(ins => {
        if (!ins.grupo) {
          ins.grupo = ["i16","i17","i18","i19","i20"].includes(ins.id) ? "massa" : (ins.id === "i1" ? "massa" : "cobertura");
        }
        if (ins.id === "i1" && (!ins.custo || ins.custo < 0.01)) {
          ins.custo = base.insumos.find(bi => bi.id === "i1")?.custo ?? 3.50;
        }
      });
      let estoque = toArray(db.estoque) || [];
      // Migra i3 (Molho de tomate) → i12 (Tomate Pelado)
      // Migra insumos de g → kg (divide qtd por 1000)
      const pizzas = (toArray(db.pizzas) || base.pizzas).map(p => {
        if (p.ingredientes) {
          p.ingredientes = p.ingredientes.map(ing => {
            let id = ing.insumoId === "i3" ? "i12" : ing.insumoId;
            let qtd = ing.quantidade;
            if (gToKg.includes(id) && qtd > 1) qtd = qtd / 1000;
            return { ...ing, insumoId: id, quantidade: qtd };
          });
        }
        return p;
      });
      // Migra estoque g → kg
      if (estoque.length) {
        estoque = estoque.map(e => {
          let id = e.insumoId === "i3" ? "i12" : e.insumoId;
          let qtd = e.qtd;
          if (gToKg.includes(id) && qtd > 1) qtd = qtd / 1000;
          return { ...e, insumoId: id, qtd };
        });
      }
      // Força insumos da massa (i16-i20) a usar valores do DEFAULT (nunca devem vir do KV)
      base.insumos.filter(i => ["i16","i17","i18","i19","i20"].includes(i.id)).forEach(bi => {
        const idx = insumos.findIndex(x => x.id === bi.id);
        if (idx >= 0) insumos[idx] = { ...bi };
      });
      // Migra massaRecipe IDs de mi→i e converte qtd de g → unidade nativa
      let config = { ...base.config, ...(db.config || {}) };
      if (config.massaRecipe) {
        const nativeUnit = { i16:"kg", i17:"g", i18:"g", i19:"g", i20:"g" };
        config.massaRecipe = config.massaRecipe.map(r => {
          const m = { mi1:"i16", mi2:"i17", mi3:"i18", mi4:"i19", mi5:"i20" };
          const newId = m[r.insumoId] || r.insumoId;
          let qtd = r.qtd;
          // Se veio do formato antigo (mi1-mi5 com qtd em gramas), converte
          if (m[r.insumoId] && nativeUnit[newId] === "kg" && qtd > 10) qtd = qtd / 1000;
          return { ...r, insumoId: newId, qtd };
        });
      }
      // Remove campos legados que não existem mais no DEFAULT
      const { massaInsumos: _, estoqueMassa: __, ...dbClean } = db;
      return {
        ...base,
        ...dbClean,
        config,
        insumos,
        pizzas,
        estoque,
        vendas: toArray(db.vendas) || [],
        consumo: toArray(db.consumo) || [],
      };
    }
    function load() {
      try { const d = localStorage.getItem(STORE_KEY); return normalizeDb(d ? JSON.parse(d) : null) }
      catch { return cloneDefault() }
    }
    function save(data) {
      try {
        const normalized = normalizeDb(data);
        localStorage.setItem(STORE_KEY, JSON.stringify(normalized));
        saveToServer(normalized);
        return true;
      } catch (e) {
        console.error(e);
        toast("⚠️ Não foi possível salvar. Verifique o armazenamento do navegador.");
        return false;
      }
    }
    async function saveToServer(data) {
      try {
        const resp = await fetch(`${API_HOST}/api/admin/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + API_TOKEN },
          body: JSON.stringify(data),
        });
        if (!resp.ok) {
          const text = await resp.text().catch(() => resp.statusText);
          console.warn("Erro ao salvar no servidor:", resp.status, text);
          toast("⚠️ Não foi possível salvar no servidor. Dados gravados localmente.");
          return false;
        }
        const json = await resp.json().catch(() => null);
        if (json && json.status && json.status !== "ok") {
          console.warn("Resposta inesperada ao salvar no servidor:", json);
          toast("⚠️ Não foi possível salvar no servidor. Dados gravados localmente.");
          return false;
        }
        toast("✅ Dados salvos no servidor e localmente.");
        return true;
      } catch (e) {
        console.warn("Não foi possível salvar no KV:", e);
        toast("⚠️ Não foi possível salvar no servidor. Dados gravados localmente.");
      }
    }
    async function loadServerData() {
      try {
        const resp = await fetch(`${API_HOST}/api/admin/load`);
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          DB = normalizeDb(data);
          localStorage.setItem(STORE_KEY, JSON.stringify(DB));
          if (document.getElementById('app').style.display !== 'none') renderAll();
          toast('✅ Dados do servidor carregados.');
          return true;
        }
        console.warn('Servidor retornou dados vazios; mantendo dados locais.');
        if (document.getElementById('app').style.display !== 'none') renderAll();
        return false;
      } catch (e) {
        console.warn("Não foi possível carregar dados do servidor:", e);
        toast('⚠️ Não foi possível carregar dados do servidor. Usando cache local.');
        return false;
      }
    }
    let DB = load();
    function parseNum(value) {
      if (typeof value === "number") return value;
      return parseFloat(String(value).replace(",", "."));
    }

    // ---- LOGIN ----

    function pinInput(i) {
      const el = document.getElementById("p" + i);
      // Move para o próximo input se digitou algo e não for o último
      if (el.value && i < 3) {
        document.getElementById("p" + (i + 1)).focus();
      }
      // Se apagou e está vazio, volta para o anterior
      if (!el.value && i > 0) {
        document.getElementById("p" + (i - 1)).focus();
      }
      document.getElementById("pin-error").textContent = "";
    }


    // Corrige listeners e foco inicial após DOM pronto
    window.addEventListener('DOMContentLoaded', function () {
      const pinInputs = document.querySelectorAll('.pin-digit');
      pinInputs.forEach((el, i) => {
        // Remove listeners antigos para evitar duplicidade
        el.oninput = null;
        el.onkeydown = null;
        el.addEventListener('input', function (e) {
          // Só aceita números
          el.value = el.value.replace(/[^0-9]/g, '');
          if (el.value.length > 1) el.value = el.value.slice(0, 1);
          if (el.value && i < 3) {
            document.getElementById('p' + (i + 1)).focus();
          }
          document.getElementById('pin-error').textContent = '';
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !el.value && i > 0) {
            document.getElementById('p' + (i - 1)).focus();
          }
          if (e.key === 'Enter') doLogin();
        });
      });
      // Foco inicial
      setTimeout(() => { document.getElementById('p0').focus(); }, 100);
      loadServerData();
    });

    function doLogin() {
      const pin = [0, 1, 2, 3].map(i => document.getElementById("p" + i).value).join("");
      const correctPin = (DB.config && DB.config.pin) ? DB.config.pin : PIN;
      if (pin === correctPin) {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "flex";
        renderAll();
        loadPedidosFromServer();
      } else {
        document.getElementById("pin-error").textContent = "PIN incorreto. Tente novamente.";
        [0, 1, 2, 3].forEach(i => document.getElementById("p" + i).value = "");
        document.getElementById("p0").focus();
      }
    }

    // Forçar recarga dos dados remotos e atualizar cache local
    async function reloadServerData() {
      const btn = document.getElementById('btn-reload-server');
      if (btn) btn.disabled = true;
      try {
        const ok = await loadServerData();
        if (ok) {
          toast('✅ Dados atualizados a partir do servidor.');
        } else {
          toast('⚠️ Nenhum dado novo no servidor.');
        }
      } catch (e) {
        console.warn('Erro ao recarregar dados do servidor:', e);
        toast('⚠️ Erro ao recarregar dados.');
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    // ---- TABS ----
    function showTab(id) {
      document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
      document.getElementById("tab-" + id).classList.add("active");
      const activeBtn = document.querySelector(`.nav-btn[data-tab="${id}"]`);
      if (activeBtn) activeBtn.classList.add("active");
      if (id === "dashboard") renderDashboard();
      if (id === "insumos") renderInsumos();
      if (id === "cardapio") renderPizzas();
      if (id === "config") renderConfig();
      if (id === "estoque") renderEstoque();
      if (id === "vendas") renderVendas();
      if (id === "pedidos") renderPedidos();
      if (id === "analise") renderAnalise();
      if (id === "massa") renderMassa();
    }
    function renderAll() { renderDashboard(); renderInsumos(); renderPizzas(); renderConfig(); renderMassa(); renderAnalise(); renderPedidos() }
    // ---- VENDAS ----
    function renderVendas() {
      document.getElementById('vendas-list').innerHTML = (DB.vendas || []).sort((a, b) => b.data.localeCompare(a.data)).map(v => {
        const pz = DB.pizzas.find(p => p.id === v.pizzaId);
        return `<tr>
      <td>${new Date(v.data).toLocaleDateString()}</td>
      <td>${pz ? pz.nome : '-'}</td>
      <td>${v.qtd}</td>
      <td>${pz ? fmtR((pz.preco || 0) * v.qtd) : '-'}</td>
    </tr>`;
      }).join('') || `<tr><td colspan='4' style='text-align:center;color:var(--muted);padding:24px'>Nenhuma venda registrada.</td></tr>`;
      renderAnalise();
    }

    function openVendaModal() {
      const sel = document.getElementById('venda-pizza');
      sel.innerHTML = DB.pizzas.filter(p => p.ativo).map(pz => `<option value="${pz.id}">${pz.nome}</option>`).join('');
      document.getElementById('venda-qtd').value = '';
      const today = new Date().toISOString().slice(0, 10);
      document.getElementById('venda-data').value = today;
      openModal('modal-venda');
    }

    function saveVenda() {
      const pizzaId = document.getElementById('venda-pizza').value;
      const qtd = parseInt(document.getElementById('venda-qtd').value);
      const data = document.getElementById('venda-data').value || new Date().toISOString().slice(0, 10);
      if (!pizzaId || isNaN(qtd) || qtd <= 0) {
        toast('⚠️ Preencha todos os campos corretamente.');
        return;
      }
      DB.vendas = DB.vendas || [];
      DB.vendas.push({ pizzaId, qtd, data: new Date(data).toISOString() });
      // Atualiza vendas acumuladas na pizza
      const pz = DB.pizzas.find(p => p.id === pizzaId);
      if (pz) {
        pz.vendas = (pz.vendas || 0) + qtd;
      }
      // Baixa automática de estoque
      DB.consumo = DB.consumo || [];
      if (pz && pz.ingredientes) {
        pz.ingredientes.forEach(ing => {
          DB.consumo.push({
            insumoId: ing.insumoId,
            qtd: ing.quantidade * qtd,
            data: new Date(data).toISOString(),
            pizzaNome: pz.nome
          });
        });
      }
      save(DB);
      renderVendas();
      renderEstoque();
      renderDashboard();
      closeModal('modal-venda');
      toast('✅ Venda registrada!');
    }

    // ---- PEDIDOS (dos clientes) ----
    let cachedPedidos = [];
    function renderPedidos() {
      const list = document.getElementById('pedidos-list');
      if (!list) return;
      if (!cachedPedidos.length) {
        list.innerHTML = `<tr><td colspan='8' style='text-align:center;color:var(--muted);padding:24px'>Nenhum pedido recebido. Os pedidos dos clientes aparecem aqui.</td></tr>`;
        return;
      }
      list.innerHTML = [...cachedPedidos].reverse().map(p => {
        const itens = (p.carrinho || []).map(i => `${i.qtd}x ${i.nome}`).join(', ');
        return `<tr>
          <td>${p.data ? new Date(p.data).toLocaleString() : '-'}</td>
          <td>${p.nome || '-'}</td>
          <td>${p.tel || '-'}</td>
          <td>${[p.rua, p.num, p.bairro, p.comp].filter(Boolean).join(', ') || '-'}</td>
          <td>${itens || '-'}</td>
          <td>${p.total ? 'R$ ' + p.total.toFixed(2).replace('.', ',') : '-'}</td>
          <td>${p.pagamento || '-'}</td>
          <td style="max-width:160px;white-space:normal;word-break:break-word">${p.obs || '-'}</td>
        </tr>`;
      }).join('');
    }
    async function loadPedidosFromServer() {
      try {
        const resp = await fetch(`${API_HOST}/api/admin/pedidos`, {
          headers: { "Authorization": "Bearer " + API_TOKEN },
        });
        if (!resp.ok) throw new Error(resp.statusText);
        cachedPedidos = await resp.json();
        renderPedidos();
        toast('✅ Pedidos carregados do servidor.');
      } catch (e) {
        console.warn('Não foi possível carregar pedidos:', e);
        toast('⚠️ Erro ao carregar pedidos do servidor.');
      }
    }
    // ---- CMV HELPERS ----
      const custo = (pizza.ingredientes || []).reduce((s, ing) => {
        const ins = DB.insumos.find(i => i.id === ing.insumoId);
        return s + (ins ? ins.custo * ing.quantidade : 0);
      }, 0);
      const pct = pizza.preco > 0 ? (custo / pizza.preco) * 100 : 0;
      return { custo, pct, margem: pizza.preco - custo };
    }
    function cmvClass(pct) {
      if (pct <= 30) return "badge-green";
      if (pct <= 42) return "badge-amber";
      return "badge-red";
    }
    function cmvColor(pct) {
      if (pct <= 30) return "#16A34A";
      if (pct <= 42) return "#D97706";
      return "#DC2626";
    }
    function fmtR(n) {
      if (n === 0) return "R$ 0,00";
      if (Math.abs(n) >= 0.01) return "R$ " + n.toFixed(2).replace(".", ",");
      const dec = Math.max(2, Math.min(6, Math.ceil(-Math.log10(Math.abs(n))) + 2));
      return "R$ " + n.toFixed(dec).replace(".", ",");
    }
    function fmtP(n) { return n.toFixed(1).replace(".", ",") + "%" }
    function uid() { return "x" + Math.random().toString(36).slice(2, 9) }

    // ---- DASHBOARD ----
    function renderDashboard() {
      const pizzas = DB.pizzas.filter(p => p.ativo);
      const cmvs = pizzas.map(p => ({ ...p, ...calcCmv(p) }));
      const avgCmv = cmvs.length ? cmvs.reduce((s, p) => s + p.pct, 0) / cmvs.length : 0;
      const best = cmvs.length ? cmvs.reduce((a, b) => a.pct < b.pct ? a : b) : null;
      const worst = cmvs.length ? cmvs.reduce((a, b) => a.pct > b.pct ? a : b) : null;
      const totalCats = [...new Set(DB.pizzas.map(p => p.categoria))].length;
      document.getElementById("dash-stats").innerHTML = `
    <div class="stat-card"><div class="stat-label">Pizzas no cardápio</div><div class="stat-value">${DB.pizzas.filter(p => p.ativo).length}</div><div class="stat-sub">${DB.pizzas.length} cadastradas</div></div>
    <div class="stat-card"><div class="stat-label">CMV médio</div><div class="stat-value" style="color:${cmvColor(avgCmv)}">${fmtP(avgCmv)}</div><div class="stat-sub">Meta ideal: ≤ 35%</div></div>
    <div class="stat-card"><div class="stat-label">Menor CMV 🏆</div><div class="stat-value" style="font-size:16px;margin-top:4px">${best ? best.nome : "—"}</div><div class="stat-sub">${best ? fmtP(best.pct) : "—"}</div></div>
    <div class="stat-card"><div class="stat-label">Maior CMV ⚠️</div><div class="stat-value" style="font-size:16px;margin-top:4px">${worst ? worst.nome : "—"}</div><div class="stat-sub">${worst ? fmtP(worst.pct) : "—"}</div></div>
    <div class="stat-card"><div class="stat-label">Insumos</div><div class="stat-value">${DB.insumos.length}</div><div class="stat-sub">${totalCats} categorias</div></div>
  `;
      const sorted = [...cmvs].sort((a, b) => a.pct - b.pct);
      document.getElementById("dash-cmv-list").innerHTML = sorted.map(p => {
        let ingList = p.ingredientes.map(ing => {
          const ins = DB.insumos.find(i => i.id === ing.insumoId);
          return ins ? `<div style='font-size:12px;color:var(--muted)'>${ins.nome}: <b>${ing.quantidade}</b> ${ins.unidade} <span style='color:#888'>(${fmtR(ins.custo)} / ${ins.unidade})</span></div>` : '';
        }).join("");
        return `<div class="cmv-table-row">
      <span style="font-weight:600">${p.nome}<br>${ingList}</span>
      <span>${fmtR(p.custo)}</span>
      <span>${fmtR(p.preco)}</span>
      <span style="color:var(--green)">${fmtR(p.margem)}</span>
      <span><div class="cmv-bar-wrap">
        <div class="cmv-bar-bg"><div class="cmv-bar-fill" style="width:${Math.min(p.pct, 100)}%;background:${cmvColor(p.pct)}"></div></div>
        <span class="cmv-pct" style="color:${cmvColor(p.pct)}">${fmtP(p.pct)}</span>
        <span class="badge ${cmvClass(p.pct)}">${p.pct <= 30 ? "Ótimo" : p.pct <= 42 ? "Atenção" : "Alto"}</span>
      </div></span>
    </div>`;
      }).join("") || "<div style='padding:20px;text-align:center;color:var(--muted);font-size:13px'>Nenhuma pizza com ingredientes cadastrados.</div>";
    }

    // ---- INSUMOS ----
    function renderInsumos() {
      const grupos = { cobertura: [], massa: [] };
      DB.insumos.forEach(ins => {
        const g = ins.grupo === "massa" ? "massa" : "cobertura";
        grupos[g].push(ins);
      });
      const labels = { cobertura: "🧀 Coberturas", massa: "🍞 Massa" };
      let html = "";
      ["cobertura", "massa"].forEach(g => {
        if (!grupos[g].length) return;
        html += `<tr style="background:var(--bg)"><td colspan="5" style="font-weight:700;font-size:13px;padding:8px 14px">${labels[g]}</td></tr>`;
        html += grupos[g].map(ins => {
          const usadoEm = DB.pizzas.filter(p => (p.ingredientes || []).some(i => i.insumoId === ins.id)).length;
          return `<tr>
        <td><strong>${ins.nome}</strong></td>
        <td><span class="badge badge-gray">${ins.unidade}</span></td>
        <td>${fmtR(ins.custo)}<span style="color:var(--muted);font-size:11px"> / ${ins.unidade}</span></td>
        <td>${usadoEm > 0 ? `<span class="badge badge-green">${usadoEm} pizza${usadoEm > 1 ? "s" : ""}</span>` : "<span class='badge badge-gray'>—</span>"}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="editInsumo('${ins.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="delInsumo('${ins.id}')">✕</button>
          </div>
        </td>
      </tr>`;
        }).join("");
      });
      document.getElementById("insumos-list").innerHTML = html || "<tr><td colspan='5' style='text-align:center;color:var(--muted);padding:24px'>Nenhum insumo cadastrado.</td></tr>";
    }

    // ---- PIZZAS ----
    function renderPizzas() {
      const rows = DB.pizzas.map(p => {
        const { custo, pct, margem } = calcCmv(p);
        return `<tr>
      <td><strong>${p.nome}</strong>${!p.ativo ? "<span class='badge badge-gray' style='margin-left:6px'>Inativo</span>" : ""}</td>
      <td><span class="badge badge-gray">${p.categoria}</span></td>
      <td>${fmtR(custo)}</td>
      <td>${fmtR(p.preco)}</td>
      <td><span class="badge ${cmvClass(pct)}">${fmtP(pct)}</span></td>
      <td style="color:var(--green);font-weight:600">${fmtR(margem)}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="editPizza('${p.id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="delPizza('${p.id}')">✕</button>
        </div>
      </td>
    </tr>`;
      }).join("");
      document.getElementById("pizzas-list").innerHTML = rows || "<tr><td colspan='7' style='text-align:center;color:var(--muted);padding:24px'>Nenhuma pizza cadastrada.</td></tr>";
    }

    // ---- CONFIG ----
    function renderConfig() {
      const cfg = DB.config;
      document.getElementById("cfg-nome").value = cfg.nome || "";
      document.getElementById("cfg-wp").value = cfg.whatsapp || "";
      document.getElementById("cfg-taxa").value = cfg.taxaEntrega || 0;
      document.getElementById("cfg-tempo").value = cfg.tempoEstimado || "30-40 minutos";
      document.getElementById("cfg-cmv").value = cfg.cmvIdeal || 30;
    }
    function saveConfig() {
      DB.config.nome = document.getElementById("cfg-nome").value.trim();
      DB.config.whatsapp = document.getElementById("cfg-wp").value.trim();
      DB.config.taxaEntrega = parseNum(document.getElementById("cfg-taxa").value) || 0;
      DB.config.tempoEstimado = document.getElementById("cfg-tempo").value.trim();
      DB.config.cmvIdeal = parseNum(document.getElementById("cfg-cmv").value) || 30;
      const newPin = document.getElementById("cfg-pin").value.trim();
      if (newPin.length === 4 && /^[0-9]{4}$/.test(newPin)) DB.config.pin = newPin;
      if (save(DB)) toast("✅ Configurações salvas!");
    }

    function exportBackup() {
      const backup = {
        meta: {
          createdAt: new Date().toISOString(),
          source: "tonda-admin"
        },
        data: DB
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const filename = `tonda_backup_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("✅ Backup exportado!");
    }
    function downloadCSV(filename, header, rows) {
      const csv = [header.join(","), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("✅ CSV exportado!");
    }
    function exportCSV(type) {
      if (type === "insumos") {
        downloadCSV("insumos.csv", ["Nome", "Unidade", "Custo", "Grupo"], DB.insumos.map(i => [i.nome, i.unidade, i.custo, i.grupo]));
      } else if (type === "vendas") {
        downloadCSV("vendas.csv", ["Data", "Pizza", "Qtd", "Valor"], (DB.vendas || []).map(v => {
          const p = DB.pizzas.find(x => x.id === v.pizzaId);
          return [new Date(v.data).toLocaleDateString(), p ? p.nome : "", v.qtd, p ? "R$" + (p.preco * v.qtd).toFixed(2).replace(".", ",") : ""];
        }));
      } else if (type === "estoque") {
        downloadCSV("estoque.csv", ["Data", "Insumo", "Qtd", "Unidade", "Valor total", "Preço unit."], (DB.estoque || []).map(e => {
          const ins = DB.insumos.find(i => i.id === e.insumoId);
          return [new Date(e.data).toLocaleDateString(), ins ? ins.nome : "", e.qtd, ins ? ins.unidade : "", "R$" + e.valorTotal.toFixed(2).replace(".", ","), ins ? "R$" + (e.valorTotal / e.qtd).toFixed(2).replace(".", ",") : ""];
        }));
      }
    }
    function handleBackupFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const parsed = JSON.parse(e.target.result);
          const imported = parsed && parsed.data ? parsed.data : parsed;
          if (!imported || typeof imported !== "object") throw new Error("Arquivo inválido");
          applyImportedBackup(imported);
        } catch (err) {
          alert("Arquivo de backup inválido. Verifique o JSON e tente novamente.");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    }

    function applyImportedBackup(data) {
      DB = normalizeDb(data);
      save(DB);
      renderAll();
      toast("✅ Backup importado!");
    }

    // ---- INSUMO MODAL ----
    function openInsumoModal(id) {
      document.getElementById("insumo-edit-id").value = "";
      document.getElementById("insumo-modal-title").textContent = "Novo insumo";
      document.getElementById("ins-nome").value = "";
      document.getElementById("ins-un").value = "kg";
      document.getElementById("ins-custo").value = "";
      openModal("modal-insumo");
    }
    function editInsumo(id) {
      const ins = DB.insumos.find(i => i.id === id); if (!ins) return;
      document.getElementById("insumo-edit-id").value = id;
      document.getElementById("insumo-modal-title").textContent = "Editar insumo";
      document.getElementById("ins-nome").value = ins.nome;
      document.getElementById("ins-un").value = ins.unidade;
      document.getElementById("ins-custo").value = ins.custo;
      openModal("modal-insumo");
    }
    function saveInsumo() {
      const nome = document.getElementById("ins-nome").value.trim();
      const un = document.getElementById("ins-un").value;
      const custo = parseNum(document.getElementById("ins-custo").value);
      if (!nome || isNaN(custo)) { toast("⚠️ Preencha todos os campos."); return }
      const editId = document.getElementById("insumo-edit-id").value;
      if (editId) {
        const ins = DB.insumos.find(i => i.id === editId);
        if (ins) { ins.nome = nome; ins.unidade = un; ins.custo = custo }
      } else {
        DB.insumos.push({ id: uid(), nome, unidade: un, custo });
      }
      if (save(DB)) {
        renderInsumos(); renderPizzas(); renderDashboard();
        closeModal("modal-insumo"); toast("✅ Insumo salvo!");
      }
    }
    function delInsumo(id) {
      if (!confirm("Remover este insumo?")) return;
      DB.insumos = DB.insumos.filter(i => i.id !== id);
      DB.pizzas.forEach(p => { p.ingredientes = p.ingredientes.filter(i => i.insumoId !== id) });
      save(DB); renderInsumos(); renderDashboard(); toast("Insumo removido.");
    }

    // ---- PIZZA MODAL ----
    let ingRowCount = 0;
    function openPizzaModal() {
      document.getElementById("pizza-edit-id").value = "";
      document.getElementById("pizza-modal-title").textContent = "Nova pizza";
      document.getElementById("pz-nome").value = "";
      document.getElementById("pz-cat").value = "Tradicionais";
      document.getElementById("pz-preco").value = "";
      document.getElementById("pz-foto").value = "";
      document.getElementById("pz-ativo").checked = true;
      document.getElementById("ing-rows").innerHTML = "";
      document.getElementById("comp-container").innerHTML = "";
      ingRowCount = 0;
      compCount = 0;
      updateCmvPreview();
      openModal("modal-pizza");
    }
    function editPizza(id) {
      const p = DB.pizzas.find(x => x.id === id); if (!p) return;
      document.getElementById("pizza-edit-id").value = id;
      document.getElementById("pizza-modal-title").textContent = "Editar pizza";
      document.getElementById("pz-nome").value = p.nome;
      document.getElementById("pz-cat").value = p.categoria;
      document.getElementById("pz-preco").value = p.preco;
      document.getElementById("pz-foto").value = p.foto || "";
      document.getElementById("pz-ativo").checked = p.ativo;
      document.getElementById("ing-rows").innerHTML = "";
      ingRowCount = 0;
      (p.ingredientes || []).forEach(ing => addIngRow(ing));
      document.getElementById("comp-container").innerHTML = "";
      compCount = 0;
      (p.complementos || []).forEach(c => addComp(c));
      updateCmvPreview();
      openModal("modal-pizza");
    }
    function addIngRow(data) {
      const rowId = ingRowCount++;
      const opts = DB.insumos.filter(ins => ins.grupo === "cobertura" || ins.id === "i1").map(ins => `<option value="${ins.id}" ${data && data.insumoId === ins.id ? "selected" : ""}>${ins.nome} (${ins.unidade})</option>`).join("");
      const row = document.createElement("div");
      row.className = "ing-row";
      row.id = "ing-row-" + rowId;
      row.innerHTML = `
    <select onchange="updateCmvPreview()">${opts || "<option>Cadastre insumos primeiro</option>"}</select>
    <input type="number" step="any" min="0" value="${data ? data.quantidade : ""}" placeholder="0" oninput="updateCmvPreview()">
    <span style="font-size:12px;color:var(--muted);align-self:center" id="ing-un-${rowId}"></span>
    <span style="font-size:11px;color:#888;align-self:center" id="ing-preco-${rowId}"></span>
    <button class="ing-del" onclick="document.getElementById('ing-row-${rowId}').remove();updateCmvPreview()">✕</button>
  `;
      document.getElementById("ing-rows").appendChild(row);
      // Exibe unidade e preço do insumo
      const sel = row.querySelector("select");
      const unSpan = row.querySelector(`#ing-un-${rowId}`);
      const precoSpan = row.querySelector(`#ing-preco-${rowId}`);
      function updateInfo() {
        const ins = DB.insumos.find(i => i.id === sel.value);
        if (ins) {
          unSpan.textContent = ins.unidade;
          precoSpan.textContent = fmtR(ins.custo) + " / " + ins.unidade;
        } else {
          unSpan.textContent = '';
          precoSpan.textContent = '';
        }
      }
      function updateUnitSpan() {
        const ins = DB.insumos.find(i => i.id === sel.value);
        if (!ins) { unSpan.textContent = ''; return }
        const qty = parseFloat(row.querySelector('input[type="number"]').value);
        const hint = ins.unidade === "kg" && qty > 0 ? ` ≈ ${qty * 1000}g` : '';
        unSpan.textContent = ins.unidade + hint;
      }
      row.querySelector('input[type="number"]').addEventListener('input', function() {
        updateUnitSpan();
        updateCmvPreview();
      });
      sel.addEventListener('change', function() { updateInfo(); updateUnitSpan(); updateCmvPreview() });
      updateInfo();
      updateCmvPreview();
    }
    // ---- ESTOQUE ----
    function renderEstoque() {
      // Saldo atual de cada insumo
      const saldo = {};
      DB.insumos.forEach(ins => saldo[ins.id] = 0);
      (DB.estoque || []).forEach(e => {
        saldo[e.insumoId] = (saldo[e.insumoId] || 0) + parseFloat(e.qtd);
      });
      // Baixa por consumo registrado
      (DB.consumo || []).forEach(c => {
        saldo[c.insumoId] = (saldo[c.insumoId] || 0) - parseFloat(c.qtd);
      });
      // Render tabela de estoque
      document.getElementById('estoque-list').innerHTML = DB.insumos.map(ins => {
        const sal = saldo[ins.id] || 0;
        const ult = (DB.estoque || []).filter(e => e.insumoId === ins.id).sort((a, b) => b.data.localeCompare(a.data))[0];
        const cor = sal < 0 ? "var(--red)" : (sal < 1 ? "#D97706" : "inherit");
        return `<tr>
      <td><b>${ins.nome}</b></td>
      <td style="color:${cor};font-weight:${sal < 0 ? "700" : "400"}">${sal.toFixed(3)}</td>
      <td>${ins.unidade}</td>
      <td>${ult ? new Date(ult.data).toLocaleDateString() : '-'}</td>
    </tr>`;
      }).join('') || `<tr><td colspan='4' style='text-align:center;color:var(--muted);padding:24px'>Nenhum insumo cadastrado.</td></tr>`;
      // Popula filtro de insumo
      const filtroSel = document.getElementById('filtro-insumo');
      const currentFilter = filtroSel.value;
      filtroSel.innerHTML = '<option value="">Todos os insumos</option>' + DB.insumos.map(i => `<option value="${i.id}">${i.nome}</option>`).join('');
      filtroSel.value = currentFilter;
      // Render histórico de compras filtrado
      let compras = (DB.estoque || []).sort((a, b) => b.data.localeCompare(a.data));
      if (currentFilter) compras = compras.filter(e => e.insumoId === currentFilter);
      document.getElementById('compras-list').innerHTML = compras.map(e => {
        const ins = DB.insumos.find(i => i.id === e.insumoId);
        return `<tr>
      <td>${new Date(e.data).toLocaleDateString()}</td>
      <td>${ins ? ins.nome : '-'}</td>
      <td>${e.qtd}</td>
      <td>${ins ? ins.unidade : '-'}</td>
      <td>${fmtR(e.valorTotal)}</td>
      <td style="font-size:12px;color:var(--muted)">${ins ? fmtR(e.valorTotal / e.qtd) + '/' + ins.unidade : '-'}</td>
    </tr>`;
      }).join('') || `<tr><td colspan='6' style='text-align:center;color:var(--muted);padding:24px'>Nenhuma compra registrada.</td></tr>`;
    }

    function openCompraModal() {
      const sel = document.getElementById('compra-insumo');
      sel.innerHTML = DB.insumos.map(ins => `<option value="${ins.id}">${ins.nome} (${ins.unidade})</option>`).join('');
      document.getElementById('compra-qtd').value = '';
      document.getElementById('compra-valor').value = '';
      calcCompraValor();
      openModal('modal-compra');
    }

    function calcCompraValor() {
      const insumoId = document.getElementById('compra-insumo').value;
      const qtd = parseNum(document.getElementById('compra-qtd').value) || 0;
      const ins = DB.insumos.find(i => i.id === insumoId);
      const refEl = document.getElementById('compra-custo-ref');
      if (ins) {
        refEl.textContent = `Custo atual: ${fmtR(ins.custo)}/${ins.unidade}`;
        if (qtd > 0) {
          document.getElementById('compra-valor').value = (ins.custo * qtd).toFixed(2);
        }
      } else {
        refEl.textContent = 'Custo atual: —';
      }
    }

    function saveCompra() {
      const insumoId = document.getElementById('compra-insumo').value;
      const qtd = parseNum(document.getElementById('compra-qtd').value);
      const valorTotal = parseNum(document.getElementById('compra-valor').value);
      if (!insumoId || isNaN(qtd) || qtd <= 0 || isNaN(valorTotal) || valorTotal <= 0) {
        toast('⚠️ Preencha todos os campos corretamente.');
        return;
      }
      DB.estoque = DB.estoque || [];
      DB.estoque.push({ insumoId, qtd, valorTotal, data: new Date().toISOString() });
      // Atualiza custo do insumo (média ponderada)
      const ins = DB.insumos.find(i => i.id === insumoId);
      if (ins) {
        // Média ponderada
        const totalAnt = (DB.estoque || []).filter(e => e.insumoId === insumoId).reduce((s, e) => s + parseFloat(e.qtd), 0) - qtd;
        const valorAnt = totalAnt * ins.custo;
        const novoTotal = totalAnt + qtd;
        if (novoTotal > 0) {
          ins.custo = (valorAnt + valorTotal) / novoTotal;
        } else {
          ins.custo = valorTotal / qtd;
        }
      }
      if (save(DB)) {
        renderEstoque();
        renderInsumos();
        renderPizzas();
        renderDashboard();
        closeModal('modal-compra');
        toast('✅ Compra registrada!');
      }
    }
    function getIngRows() {
      const rows = [];
      document.querySelectorAll("#ing-rows .ing-row").forEach(row => {
        const sel = row.querySelector("select");
        const inp = row.querySelector("input");
        if (sel && inp && sel.value && inp.value) {
          rows.push({ insumoId: sel.value, quantidade: parseNum(inp.value) || 0 });
        }
      });
      return rows;
    }
    // ---- MASSA ----
    let massaRowCount = 0;
    function renderMassa() {
      const recipe = DB.config.massaRecipe || [{ insumoId: "i16", qtd: 1 }, { insumoId: "i17", qtd: 650 }, { insumoId: "i18", qtd: 1 }, { insumoId: "i19", qtd: 24 }, { insumoId: "i20", qtd: 13 }];
      document.getElementById("massa-peso-paneto").value = DB.config.massaPesoPaneto || 270;
      document.getElementById("massa-rows").innerHTML = "";
      massaRowCount = 0;
      recipe.forEach(r => addMassaRow(r));
      calcMassa();
    }
    function addMassaRow(data) {
      const rowId = massaRowCount++;
      const opts = DB.insumos.filter(ins => ins.grupo === "massa" && ins.id !== "i1").map(ins => `<option value="${ins.id}" ${data && data.insumoId === ins.id ? "selected" : ""}>${ins.nome} (${ins.unidade})</option>`).join("");
      const row = document.createElement("div");
      row.className = "ing-row";
      row.id = "massa-row-" + rowId;
      row.innerHTML = `
        <select onchange="updateMassaRow('${rowId}')">${opts || "<option>Cadastre insumos</option>"}</select>
        <input type="number" step="any" min="0" value="${data ? data.qtd : ""}" placeholder="qtd" oninput="updateMassaRow('${rowId}')">
        <span style="font-size:12px;color:var(--muted);align-self:center" id="massa-un-${rowId}"></span>
        <span style="font-size:11px;color:#888;align-self:center" id="massa-preco-${rowId}"></span>
        <button class="ing-del" onclick="document.getElementById('massa-row-${rowId}').remove();calcMassa()">✕</button>
      `;
      document.getElementById("massa-rows").appendChild(row);
      updateMassaRow(rowId);
      calcMassa();
    }
    function updateMassaRow(rowId) {
      const row = document.getElementById("massa-row-" + rowId);
      if (!row) return;
      const sel = row.querySelector("select");
      const inp = row.querySelector("input");
      const mi = DB.insumos.find(i => i.id === sel.value);
      const precoSpan = document.getElementById("massa-preco-" + rowId);
      const unSpan = document.getElementById("massa-un-" + rowId);
      if (mi && inp.value) {
        precoSpan.textContent = fmtR(mi.custo * parseNum(inp.value));
        unSpan.textContent = mi.unidade;
      } else {
        precoSpan.textContent = "";
        unSpan.textContent = "";
      }
      calcMassa();
    }
    function getMassaRows() {
      const rows = [];
      document.querySelectorAll("#massa-rows .ing-row").forEach(row => {
        const sel = row.querySelector("select");
        const inp = row.querySelector("input");
        if (sel && inp && sel.value && inp.value) {
          rows.push({ insumoId: sel.value, qtd: parseNum(inp.value) || 0 });
        }
      });
      return rows;
    }
    function toGrama(qtd, unidade) {
      if (unidade === "kg") return qtd * 1000;
      if (unidade === "g") return qtd;
      return qtd;
    }
    function calcMassa() {
      const rows = getMassaRows();
      const pesoPaneto = parseInt(document.getElementById("massa-peso-paneto").value) || 270;
      const pesoTotalG = rows.reduce((s, r) => {
        const mi = DB.insumos.find(i => i.id === r.insumoId);
        return s + (mi ? toGrama(r.qtd, mi.unidade) : 0);
      }, 0);
      const rend = Math.floor(pesoTotalG / pesoPaneto) || 1;
      const custoTotal = rows.reduce((s, r) => {
        const mi = DB.insumos.find(i => i.id === r.insumoId);
        return s + (mi ? mi.custo * r.qtd : 0);
      }, 0);
      const custoBola = custoTotal / rend;
      document.getElementById("massa-peso-total").textContent = pesoTotalG + " g";
      document.getElementById("massa-rend").textContent = rend + " bola" + (rend > 1 ? "s" : "");
      document.getElementById("massa-custo-total").textContent = fmtR(custoTotal);
      document.getElementById("massa-custo").textContent = fmtR(custoBola);
      const massaIns = DB.insumos.find(i => i.id === "i1");
      document.getElementById("massa-atual").textContent = massaIns ? fmtR(massaIns.custo) : "—";
    }
    function saveMassa() {
      const rows = getMassaRows();
      if (rows.length === 0) { toast("⚠️ Adicione pelo menos um ingrediente."); return }
      const pesoPaneto = parseInt(document.getElementById("massa-peso-paneto").value) || 270;
      const pesoTotalG = rows.reduce((s, r) => {
        const mi = DB.insumos.find(i => i.id === r.insumoId);
        return s + (mi ? toGrama(r.qtd, mi.unidade) : 0);
      }, 0);
      const rend = Math.floor(pesoTotalG / pesoPaneto) || 1;
      DB.config.massaRecipe = rows;
      DB.config.massaPesoPaneto = pesoPaneto;
      const custoTotal = rows.reduce((s, r) => {
        const mi = DB.insumos.find(i => i.id === r.insumoId);
        return s + (mi ? mi.custo * r.qtd : 0);
      }, 0);
      const custoBola = custoTotal / rend;
      const massaIns = DB.insumos.find(i => i.id === "i1");
      if (massaIns) {
        massaIns.custo = custoBola;
        massaIns.unidade = "un";
      }
      if (save(DB)) {
        toast("✅ Massa atualizada! " + pesoTotalG + "g · " + rend + " bolas · " + fmtR(custoBola) + "/bola");
        renderMassa();
        renderPizzas();
        renderDashboard();
      }
    }
    function updateCmvPreview() {
      const ings = getIngRows();
      const preco = parseNum(document.getElementById("pz-preco").value) || 0;
      const custo = ings.reduce((s, ing) => {
        const ins = DB.insumos.find(i => i.id === ing.insumoId);
        return s + (ins ? ins.custo * ing.quantidade : 0);
      }, 0);
      const pct = preco > 0 ? (custo / preco) * 100 : 0;
      const margem = preco - custo;
      const cat = document.getElementById("pz-cat").value;
      const isPremium = cat === "Premium";
      const cmvMin = isPremium ? 0.28 : 0.25;
      const cmvMax = 0.32;
      const precoMin = custo > 0 ? custo / cmvMax : 0;
      const precoMax = custo > 0 ? custo / cmvMin : 0;
      document.getElementById("pv-faixa-label").textContent = `💡 Faixa ideal (${(cmvMin * 100).toFixed(0)}%-${(cmvMax * 100).toFixed(0)}%)`;
      document.getElementById("pv-custo").textContent = fmtR(custo);
      document.getElementById("pv-preco").textContent = fmtR(preco);
      document.getElementById("pv-margem").textContent = fmtR(margem);
      document.getElementById("pv-sugerido").textContent = custo > 0 ? `${fmtR(precoMin)} — ${fmtR(precoMax)}` : "—";
      const cmvEl = document.getElementById("pv-cmv");
      cmvEl.textContent = preco > 0 ? fmtP(pct) : "— %";
      cmvEl.style.color = preco > 0 ? cmvColor(pct) : "var(--muted)";
    }
    function savePizza() {
      const nome = document.getElementById("pz-nome").value.trim();
      const cat = document.getElementById("pz-cat").value;
      const preco = parseNum(document.getElementById("pz-preco").value);
      const foto = document.getElementById("pz-foto").value.trim();
      const ativo = document.getElementById("pz-ativo").checked;
      if (!nome || isNaN(preco) || preco <= 0) { toast("⚠️ Informe nome e preço."); return }
      const ingredientes = getIngRows();
      const complementos = getComps();
      const editId = document.getElementById("pizza-edit-id").value;
      if (editId) {
        const p = DB.pizzas.find(x => x.id === editId);
        if (p) { p.nome = nome; p.categoria = cat; p.preco = preco; p.foto = foto; p.ativo = ativo; p.ingredientes = ingredientes; p.complementos = complementos }
      } else {
        DB.pizzas.push({ id: uid(), nome, categoria: cat, preco, foto, ativo, ingredientes, complementos });
      }
      if (save(DB)) {
        renderPizzas(); renderDashboard();
        closeModal("modal-pizza"); toast("✅ Pizza salva!");
      }
    }
    function delPizza(id) {
      if (!confirm("Remover esta pizza?")) return;
      DB.pizzas = DB.pizzas.filter(p => p.id !== id);
      save(DB); renderPizzas(); renderDashboard(); toast("Pizza removida.");
    }

    // ---- COMPLEMENTOS ----
    let compCount = 0;
    function addComp(data) {
      const id = compCount++;
      const div = document.createElement("div");
      div.id = "comp-row-" + id;
      div.style.cssText = "display:flex;gap:4px;align-items:center";
      div.innerHTML = `
        <input type="text" placeholder="Nome" value="${data ? data.nome : ""}" style="flex:1;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px">
        <input type="number" step="0.50" min="0" placeholder="R$" value="${data ? data.preco : ""}" style="width:70px;padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-size:12px">
        <button class="ing-del" onclick="this.parentElement.remove()">✕</button>
      `;
      document.getElementById("comp-container").appendChild(div);
    }
    function getComps() {
      const arr = [];
      document.querySelectorAll("#comp-container > div").forEach(row => {
        const inp = row.querySelectorAll("input");
        const nome = inp[0].value.trim();
        const preco = parseFloat(inp[1].value) || 0;
        if (nome && preco > 0) arr.push({ nome, preco });
      });
      return arr;
    }

    // ---- ANÁLISE DE VENDAS ----
    function renderAnalise() {
      const vendas = DB.vendas || [];
      const pizzas = DB.pizzas;
      // Stats gerais
      const totalVendas = vendas.length;
      const faturamento = vendas.reduce((s, v) => {
        const p = pizzas.find(x => x.id === v.pizzaId);
        return s + (p ? p.preco * v.qtd : 0);
      }, 0);
      const totalPizzas = vendas.reduce((s, v) => s + v.qtd, 0);
      const ticket = totalVendas > 0 ? faturamento / totalVendas : 0;
      document.getElementById("analise-stats").innerHTML = `
        <div class="stat-card"><div class="stat-label">Total de pedidos</div><div class="stat-value">${totalVendas}</div></div>
        <div class="stat-card"><div class="stat-label">Pizzas vendidas</div><div class="stat-value">${totalPizzas}</div></div>
        <div class="stat-card"><div class="stat-label">Faturamento total</div><div class="stat-value" style="color:var(--green)">${fmtR(faturamento)}</div></div>
        <div class="stat-card"><div class="stat-label">Ticket médio</div><div class="stat-value">${fmtR(ticket)}</div></div>
      `;
      // Ranking por pizza
      const rank = {};
      vendas.forEach(v => {
        if (!rank[v.pizzaId]) rank[v.pizzaId] = { qtd: 0, fat: 0 };
        const p = pizzas.find(x => x.id === v.pizzaId);
        rank[v.pizzaId].qtd += v.qtd;
        rank[v.pizzaId].fat += p ? p.preco * v.qtd : 0;
      });
      const ranked = Object.entries(rank).sort((a, b) => b[1].qtd - a[1].qtd);
      document.getElementById("analise-rank").innerHTML = ranked.length ? ranked.map(([id, r], i) => {
        const p = pizzas.find(x => x.id === id);
        if (!p) return "";
        const cmv = calcCmv(p);
        const custoTotal = cmv.custo * r.qtd;
        const lucro = r.fat - custoTotal;
        return `<tr>
          <td>${i + 1}</td>
          <td><b>${p.nome}</b></td>
          <td>${r.qtd}</td>
          <td>${fmtR(r.fat)}</td>
          <td>${fmtR(custoTotal)}</td>
          <td style="color:var(--green)">${fmtR(lucro)}</td>
          <td><span class="badge ${cmvClass(cmv.pct)}">${fmtP(cmv.pct)}</span></td>
        </tr>`;
      }).join("") : "<tr><td colspan='7' style='text-align:center;color:var(--muted);padding:24px'>Nenhuma venda registrada.</td></tr>";
      // Faturamento por período
      const periodos = {};
      vendas.forEach(v => {
        const mes = v.data.slice(0, 7);
        if (!periodos[mes]) periodos[mes] = { pedidos: 0, fat: 0 };
        periodos[mes].pedidos++;
        const p = pizzas.find(x => x.id === v.pizzaId);
        periodos[mes].fat += p ? p.preco * v.qtd : 0;
      });
      const sortedMeses = Object.entries(periodos).sort((a, b) => a[0].localeCompare(b[0]));
      document.getElementById("analise-periodos").innerHTML = sortedMeses.length ? sortedMeses.map(([mes, d]) => {
        const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
        const [ano, m] = mes.split("-");
        const label = `${meses[parseInt(m) - 1]}/${ano}`;
        return `<tr>
          <td>${label}</td>
          <td>${d.pedidos}</td>
          <td>${fmtR(d.fat)}</td>
          <td>${fmtR(d.fat / d.pedidos)}</td>
        </tr>`;
      }).join("") : "<tr><td colspan='4' style='text-align:center;color:var(--muted);padding:24px'>Nenhuma venda registrada.</td></tr>";
      // CMV real vs teórico
      renderCmvReal();
    }
    function renderCmvReal() {
      const vendas = DB.vendas || [];
      const pizzas = DB.pizzas;
      const consumo = DB.consumo || [];
      const compras = DB.estoque || [];
      // CMV teórico = custo das receitas * qtd vendida
      const cmvTeorico = vendas.reduce((s, v) => {
        const p = pizzas.find(x => x.id === v.pizzaId);
        if (!p || !p.ingredientes) return s;
        const custoPizza = p.ingredientes.reduce((s2, ing) => {
          const ins = DB.insumos.find(i => i.id === ing.insumoId);
          return s2 + (ins ? ins.custo * ing.quantidade : 0);
        }, 0);
        return s + custoPizza * v.qtd;
      }, 0);
      // CMV real = total compras - (saldo atual * custo médio)
      const saldo = {};
      DB.insumos.forEach(ins => saldo[ins.id] = 0);
      compras.forEach(e => saldo[e.insumoId] = (saldo[e.insumoId] || 0) + parseFloat(e.qtd));
      consumo.forEach(c => saldo[c.insumoId] = (saldo[c.insumoId] || 0) - parseFloat(c.qtd));
      const valorEstoqueAtual = Object.entries(saldo).reduce((s, [id, qtd]) => {
        const ins = DB.insumos.find(i => i.id === id);
        return s + (ins && qtd > 0 ? ins.custo * qtd : 0);
      }, 0);
      const totalCompras = compras.reduce((s, e) => s + parseFloat(e.valorTotal), 0);
      const cmvReal = totalCompras - valorEstoqueAtual;
      const diff = cmvReal - cmvTeorico;
      const diffPct = cmvTeorico > 0 ? (diff / cmvTeorico) * 100 : 0;
      const status = diff <= 0 ? "✅ Ok" : (diffPct <= 10 ? "⚠️ Pequena diferença" : "🔴 Atenção");
      const statusClass = diff <= 0 ? "badge-green" : (diffPct <= 10 ? "badge-amber" : "badge-red");
      document.getElementById("cmv-real-list").innerHTML = `
        <div class="cmv-table-row">
          <span>Total</span>
          <span style="font-weight:600">${fmtR(cmvTeorico)}</span>
          <span style="font-weight:600">${fmtR(cmvReal)}</span>
          <span style="color:${diff <= 0 ? "var(--green)" : "var(--red)"}">${diff >= 0 ? "+" : ""}${fmtR(diff)}</span>
          <span><span class="badge ${statusClass}">${status}</span></span>
        </div>
      `;
    }
    function openModal(id) { document.getElementById(id).classList.add("open") }
    function closeModal(id) { document.getElementById(id).classList.remove("open") }
    document.querySelectorAll(".modal-overlay").forEach(el => {
      el.addEventListener("click", e => { if (e.target === el) el.classList.remove("open") });
    });

    // ---- TOAST ----
    function toast(msg) {
      const el = document.getElementById("toast");
      el.textContent = msg; el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 2800);
    }
  