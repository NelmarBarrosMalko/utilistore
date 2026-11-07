/* UtiliStore - Dashboard do cliente
   Dados demonstrativos e funcionalidades executadas no navegador. */

// Dados demonstrativos
const cliente = JSON.parse(
  localStorage.getItem("utilistoreCliente") || '{"nome":"Cliente"}'
);

const STATUS = {
  pago: "Pago",
  preparacao: "Em preparação",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const pedidos = [
  { id: "#UT-10482", produto: "Fone Bluetooth Pro", data: "28/09/2026", valor: 189.9, status: "enviado" },
  { id: "#UT-10455", produto: "Mochila Executiva 25L", data: "24/09/2026", valor: 129, status: "preparacao" },
  { id: "#UT-10431", produto: "Carregador Turbo 65W", data: "20/09/2026", valor: 89.9, status: "pago" },
  { id: "#UT-10397", produto: "Garrafa Térmica 1L", data: "12/09/2026", valor: 64.5, status: "entregue" },
  { id: "#UT-10360", produto: "Luminária de Mesa LED", data: "05/09/2026", valor: 99, status: "cancelado" },
  { id: "#UT-10318", produto: "Mouse Sem Fio Ergonômico", data: "29/08/2026", valor: 74.9, status: "entregue" },
];

const produtos = [
  { id: 1, nome: "Fone de Ouvido Bluetooth com Cancelamento de Ruído", preco: 189.9, antigo: 299.9, nota: 4.8, aval: 1243, icone: "bx-headphone", cor: ["#112058", "#35509c"] },
  { id: 2, nome: "Smartwatch Fitness com GPS", preco: 249, antigo: 399, nota: 4.6, aval: 876, icone: "bx-watch", cor: ["#1c3080", "#4a6cd0"] },
  { id: 3, nome: "Mochila Executiva Impermeável 25L", preco: 129, antigo: null, nota: 4.7, aval: 532, icone: "bx-briefcase", cor: ["#1b2f70", "#5a73c4"] },
  { id: 4, nome: "Carregador Turbo USB-C 65W", preco: 89.9, antigo: 119.9, nota: 4.9, aval: 2105, icone: "bx-plug", cor: ["#0e1a4a", "#2b4496"] },
  { id: 5, nome: "Luminária de Mesa LED Dobrável", preco: 99, antigo: 149, nota: 4.5, aval: 310, icone: "bx-bulb", cor: ["#25398a", "#6b86d6"] },
  { id: 6, nome: "Garrafa Térmica Inox 1 Litro", preco: 64.5, antigo: null, nota: 4.8, aval: 987, icone: "bx-water", cor: ["#112058", "#4562b8"] },
  { id: 7, nome: "Mouse Sem Fio Ergonômico", preco: 74.9, antigo: 99.9, nota: 4.4, aval: 654, icone: "bx-mouse", cor: ["#1c3080", "#3c5bb0"] },
  { id: 8, nome: "Caixa de Som Portátil à Prova d'Água", preco: 159.9, antigo: 229.9, nota: 4.7, aval: 1520, icone: "bx-speaker", cor: ["#162668", "#5271c9"] },
];

const notificacoes = [
  { icone: "bx-package", titulo: "Pedido #UT-10482 enviado", sub: "Chega em até 3 dias úteis", nova: true },
  { icone: "bx-purchase-tag", titulo: "Cupom de 10% disponível", sub: "Válido até domingo", nova: true },
  { icone: "bx-check-circle", titulo: "Pedido #UT-10397 entregue", sub: "Avalie sua compra", nova: false },
];

// Estado da página
const $ = (id) => document.getElementById(id);
const favoritos = new Set([3]);
let carrinho = 0;
let filtroStatus = "todos";
let busca = "";
let toastTimer;

const moeda = (valor) => valor.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function toast(mensagem) {
  document.querySelector(".toast")?.remove();
  const elemento = document.createElement("div");
  elemento.className = "toast";
  elemento.textContent = mensagem;
  document.body.appendChild(elemento);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elemento.remove(), 2200);
}

// Cards de resumo
function renderStats() {
  const emAndamento = pedidos.filter((p) =>
    ["pago", "preparacao", "enviado"].includes(p.status)
  ).length;
  const entregues = pedidos.filter((p) => p.status === "entregue").length;
  const cards = [
    ["bx-shopping-bag", pedidos.length, "Pedidos realizados", "Nos últimos 60 dias", "todos"],
    ["bx-time-five", emAndamento, "Em andamento", "Aguardando entrega", "preparacao"],
    ["bx-package", entregues, "Pedidos entregues", "Compras concluídas", "entregue"],
    ["bx-heart", favoritos.size, "Favoritos", "Produtos salvos", null],
  ];

  $("stats").innerHTML = cards.map(([icone, total, titulo, info], i) => `
    <button class="stat" data-i="${i}">
      <span class="stat-icon"><i class="bx ${icone}"></i></span>
      <span><strong>${total}</strong><span>${titulo}</span><small>${info}</small></span>
    </button>
  `).join("");
}

// Filtros e lista de pedidos
function renderFilters() {
  const opcoes = [["todos", "Todos"], ...Object.entries(STATUS)];
  $("orderFilters").innerHTML = opcoes.map(([chave, nome]) => `
    <button class="chip ${chave === filtroStatus ? "active" : ""}" data-k="${chave}">${nome}</button>
  `).join("");
}

function renderOrders() {
  const lista = pedidos.filter((p) =>
    filtroStatus === "todos" || p.status === filtroStatus
  );

  $("ordersEmpty").hidden = lista.length > 0;
  $("ordersBody").innerHTML = lista.map((p) => `
    <tr>
      <td class="order-id" data-label="Pedido">${p.id}</td>
      <td data-label="Produto">${p.produto}</td>
      <td data-label="Data">${p.data}</td>
      <td data-label="Valor">${moeda(p.valor)}</td>
      <td data-label="Status"><span class="status ${p.status}">${STATUS[p.status]}</span></td>
      <td class="action"><button class="btn-outline" data-id="${p.id}">Ver detalhes</button></td>
    </tr>
  `).join("");
}

function abrirPedido(id) {
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return;

  $("orderModalBody").innerHTML = `
    <dt>Pedido</dt><dd>${pedido.id}</dd>
    <dt>Produto</dt><dd>${pedido.produto}</dd>
    <dt>Data</dt><dd>${pedido.data}</dd>
    <dt>Valor</dt><dd>${moeda(pedido.valor)}</dd>
    <dt>Status</dt><dd><span class="status ${pedido.status}">${STATUS[pedido.status]}</span></dd>
  `;
  $("orderModal").hidden = false;
}

const fecharPedido = () => { $("orderModal").hidden = true; };

// Produtos, pesquisa e carrinho
function renderProducts() {
  const termo = busca.trim().toLowerCase();
  const lista = produtos.filter((p) => p.nome.toLowerCase().includes(termo));
  $("productsEmpty").hidden = lista.length > 0;

  $("productGrid").innerHTML = lista.map((p) => {
    const desconto = p.antigo
      ? Math.round((1 - p.preco / p.antigo) * 100)
      : 0;
    const favoritado = favoritos.has(p.id);

    return `
      <article class="product">
        <div class="p-img" style="background:linear-gradient(135deg,${p.cor[0]},${p.cor[1]})">
          <i class="bx ${p.icone}"></i>
          ${desconto ? `<span class="discount">-${desconto}%</span>` : ""}
          <button class="fav ${favoritado ? "on" : ""}" data-id="${p.id}" aria-label="Favoritar">
            <i class="bx ${favoritado ? "bxs-heart" : "bx-heart"}"></i>
          </button>
        </div>
        <div class="p-body">
          <h3 class="p-name">${p.nome}</h3>
          <div class="rating"><i class="bx bxs-star"></i>${p.nota.toFixed(1)} (${p.aval.toLocaleString("pt-BR")} avaliações)</div>
          <div><span class="price">${moeda(p.preco)}</span>${p.antigo ? `<span class="old-price">${moeda(p.antigo)}</span>` : ""}</div>
          <button class="btn-primary add" data-id="${p.id}"><i class="bx bx-cart-add"></i>Adicionar</button>
        </div>
      </article>
    `;
  }).join("");
}

function atualizarCarrinho() {
  $("cartBadge").textContent = carrinho;
  $("cartBadge").hidden = carrinho === 0;
}

// Menus, navegação e autenticação
const sidebar = $("sidebar");
const notifMenu = $("notifMenu");
const userMenu = $("userMenu");

function abrirMenu() {
  sidebar.classList.add("open");
  $("overlay").hidden = false;
}

function fecharMenu() {
  sidebar.classList.remove("open");
  $("overlay").hidden = true;
}

function selecionarSecao(nome) {
  document.querySelectorAll("#nav .nav-item").forEach((botao) => {
    botao.classList.toggle("active", botao.dataset.label === nome);
  });
  if (nome !== "Dashboard") toast(`A seção "${nome}" ainda não foi implementada.`);
  fecharMenu();
}

function sair() {
  localStorage.removeItem("utilistoreToken");
  localStorage.removeItem("utilistoreCliente");
  window.location.href = "index.html";
}

function renderNotifs() {
  const novas = notificacoes.filter((n) => n.nova).length;
  $("notifBadge").textContent = novas;
  $("notifBadge").hidden = novas === 0;
  notifMenu.innerHTML = `<h4>Notificações</h4>${notificacoes.map((n) => `
    <div class="notif ${n.nova ? "unread" : ""}">
      <i class="bx ${n.icone}"></i><div>${n.titulo}<small>${n.sub}</small></div>
    </div>
  `).join("")}`;
}

function alternarMenu(menu) {
  [notifMenu, userMenu].filter((item) => item !== menu).forEach((item) => {
    item.hidden = true;
  });
  menu.hidden = !menu.hidden;
}

// Eventos: listeners únicos para elementos que são atualizados dinamicamente
$("stats").addEventListener("click", (event) => {
  const botao = event.target.closest(".stat");
  if (!botao) return;

  const filtros = ["todos", "preparacao", "entregue", null];
  filtroStatus = filtros[Number(botao.dataset.i)];
  if (filtroStatus === null) return toast(`Você tem ${favoritos.size} produto(s) favorito(s).`);

  renderFilters();
  renderOrders();
  $("ordersBody").scrollIntoView({ behavior: "smooth", block: "center" });
});

$("orderFilters").addEventListener("click", (event) => {
  const botao = event.target.closest(".chip");
  if (!botao) return;
  filtroStatus = botao.dataset.k;
  renderFilters();
  renderOrders();
});

$("ordersBody").addEventListener("click", (event) => {
  const botao = event.target.closest(".btn-outline");
  if (botao) abrirPedido(botao.dataset.id);
});

$("productGrid").addEventListener("click", (event) => {
  const favorito = event.target.closest(".fav");
  const adicionar = event.target.closest(".add");

  if (favorito) {
    const id = Number(favorito.dataset.id);
    favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
    toast(favoritos.has(id) ? "Adicionado aos favoritos." : "Removido dos favoritos.");
    renderProducts();
    renderStats();
  }

  if (adicionar) {
    carrinho++;
    atualizarCarrinho();
    toast("Produto adicionado ao carrinho.");
  }
});

$("searchInput").addEventListener("input", (event) => {
  busca = event.target.value;
  renderProducts();
});

$("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
  $("productsSection").scrollIntoView({ behavior: "smooth" });
});

$("menuBtn").addEventListener("click", abrirMenu);
$("overlay").addEventListener("click", fecharMenu);
document.querySelectorAll("#nav .nav-item").forEach((botao) => {
  botao.addEventListener("click", () => selecionarSecao(botao.dataset.label));
});

$("logoutBtn").addEventListener("click", sair);
$("logoutBtn2").addEventListener("click", sair);

$("notifBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  alternarMenu(notifMenu);
  if (!notifMenu.hidden) {
    notificacoes.forEach((n) => { n.nova = false; });
    $("notifBadge").hidden = true;
  }
});

$("userBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  alternarMenu(userMenu);
});

userMenu.querySelectorAll("[data-go]").forEach((botao) => {
  botao.addEventListener("click", () => {
    userMenu.hidden = true;
    selecionarSecao(botao.dataset.go);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-wrap")) {
    notifMenu.hidden = true;
    userMenu.hidden = true;
  }
});

$("cartBtn").addEventListener("click", () => {
  toast(`Você tem ${carrinho} item(ns) no carrinho.`);
});
$("offersBtn").addEventListener("click", () => {
  $("productsSection").scrollIntoView({ behavior: "smooth" });
});
$("closeOrderModal").addEventListener("click", fecharPedido);
$("orderModal").addEventListener("click", (event) => {
  if (event.target === $("orderModal")) fecharPedido();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharPedido();
    fecharMenu();
    notifMenu.hidden = true;
    userMenu.hidden = true;
  }
});

// Atualiza os dados do cliente na interface
const nomeCliente = cliente.nome || "Cliente";
$("userName").textContent = nomeCliente;
$("avatar").textContent = nomeCliente.charAt(0).toUpperCase();
const tituloBoasVindas = document.querySelector(".welcome h1");
if (tituloBoasVindas) tituloBoasVindas.textContent = `Olá, ${nomeCliente}! 👋`;

// Primeira renderização
renderStats();
renderFilters();
renderOrders();
renderProducts();
renderNotifs();
atualizarCarrinho();
