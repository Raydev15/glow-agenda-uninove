/* =====================================================
   GLOW AGENDA PRO — script.js
   Sistema de Login (5 Perfis) & Banco de Dados Local
   ===================================================== */

// ── Banco de Dados Simulado (5 Perfis Reais) ──
const USERS = [
  { id: 1, nome: "Ana Silva", email: "ana@uninove.com", senha: "123", avatar: "AS" },
  { id: 2, nome: "Beatriz Santos", email: "beatriz@uninove.com", senha: "123", avatar: "BS" },
  { id: 3, nome: "Carla Oliveira", email: "carla@uninove.com", senha: "123", avatar: "CO" },
  { id: 4, nome: "Daniela Lima", email: "daniela@uninove.com", senha: "123", avatar: "DL" },
  { id: 5, nome: "Fernanda Costa", email: "fernanda@uninove.com", senha: "123", avatar: "FC" }
];

let currentUser = JSON.parse(localStorage.getItem("glow_user")) || null;

// ── Navegação ──
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add("active");
    window.scrollTo(0, 0);
  }
  
  // Atualiza link ativo
  const activeLink = document.querySelector(`.nav-link[onclick*="${pageId}"]`);
  if (activeLink) activeLink.classList.add("active");

  if (pageId === "meus-agendamentos") renderAgendamentos();
}

// ── Sistema de Login ──
function openLoginModal() {
  if (currentUser) {
    logout();
  } else {
    document.getElementById("loginModal").classList.add("active");
  }
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("active");
}

function logout() {
  currentUser = null;
  localStorage.removeItem("glow_user");
  updateUI();
  showPage("home");
}

document.getElementById("formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  const user = USERS.find(u => u.email === email && u.senha === senha);

  if (user) {
    currentUser = user;
    localStorage.setItem("glow_user", JSON.stringify(user));
    updateUI();
    closeLoginModal();
    showSuccessModal("Bem-vinda de volta, " + user.nome + "!");
  } else {
    alert("E-mail ou senha incorretos. Tente: ana@uninove.com / 123");
  }
});

function updateUI() {
  const status = document.getElementById("userStatus");
  if (currentUser) {
    status.innerText = currentUser.nome.split(" ")[0];
    document.getElementById("btnLogin").classList.add("logged-in");
  } else {
    status.innerText = "Entrar";
    document.getElementById("btnLogin").classList.remove("logged-in");
  }
}

// ── Agendamentos (LocalStorage) ──
document.getElementById("formAgendamento").addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    openLoginModal();
    return;
  }

  const novoAg = {
    id: Date.now(),
    userId: currentUser.id,
    nome: document.getElementById("nome").value,
    servico: document.getElementById("servico").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value
  };

  const agendamentos = JSON.parse(localStorage.getItem("glow_agendamentos")) || [];
  agendamentos.push(novoAg);
  localStorage.setItem("glow_agendamentos", JSON.stringify(agendamentos));

  e.target.reset();
  showSuccessModal("Seu horário foi agendado com sucesso!");
  showPage("meus-agendamentos");
});

function renderAgendamentos() {
  const container = document.getElementById("listaAgendamentos");
  const agendamentos = JSON.parse(localStorage.getItem("glow_agendamentos")) || [];
  
  const meusAg = agendamentos.filter(a => a.userId === (currentUser ? currentUser.id : null));

  if (meusAg.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>${currentUser ? "Você ainda não tem agendamentos." : "Faça login para ver seus horários."}</p></div>`;
    return;
  }

  container.innerHTML = meusAg.map(a => `
    <div class="agendamento-card">
      <div class="ag-info">
        <h4>${a.servico}</h4>
        <p><i data-lucide="calendar"></i> ${formatDate(a.data)} às ${a.hora}</p>
      </div>
      <button class="btn-delete" onclick="deleteAgendamento(${a.id})" title="Cancelar">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `).join("");
  lucide.createIcons();
}

function deleteAgendamento(id) {
  if (confirm("Deseja realmente cancelar este agendamento?")) {
    let agendamentos = JSON.parse(localStorage.getItem("glow_agendamentos")) || [];
    agendamentos = agendamentos.filter(a => a.id !== id);
    localStorage.setItem("glow_agendamentos", JSON.stringify(agendamentos));
    renderAgendamentos();
  }
}

// ── Utilitários ──
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function showSuccessModal(msg) {
  document.getElementById("successMsg").innerText = msg;
  document.getElementById("successModal").classList.add("active");
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("active");
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  lucide.createIcons();
  showPage("home");
});
