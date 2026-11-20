/* Cadastro real de clientes: envia os dados para a API UtiliStore. */
const API_URL = "http://localhost:3000";

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  const alertBox = document.getElementById("alertBox");
  const fields = {
    nome: document.getElementById("fullName"),
    cpf: document.getElementById("regCpf"),
    email: document.getElementById("regEmail"),
    telefone: document.getElementById("regPhone"),
    dataNascimento: document.getElementById("birthDate"),
    senha: document.getElementById("regPassword"),
    confirmarSenha: document.getElementById("confirmPassword")
  };
  const errors = {
    nome: document.getElementById("fullNameError"),
    cpf: document.getElementById("regCpfError"),
    email: document.getElementById("regEmailError"),
    telefone: document.getElementById("regPhoneError"),
    dataNascimento: document.getElementById("birthDateError"),
    senha: document.getElementById("regPasswordError"),
    confirmarSenha: document.getElementById("confirmPasswordError")
  };

  document.querySelectorAll(".toggle-password[data-target]").forEach((button) => {
    button.addEventListener("click", () => togglePasswordVisibility(document.getElementById(button.dataset.target), button));
  });

  fields.cpf.addEventListener("input", () => {
    let v = fields.cpf.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    fields.cpf.value = v;
  });
  fields.telefone.addEventListener("input", () => {
    let v = fields.telefone.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "($1) $2");
    fields.telefone.value = v;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideAlert(alertBox);
    Object.values(errors).forEach((el) => setFieldError(el, ""));
    const dados = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
    let invalido = false;
    const erro = (campo, mensagem) => { setFieldError(errors[campo], mensagem); invalido = true; };

    if (dados.nome.length < 3) erro("nome", "Informe seu nome completo.");
    if (dados.cpf.replace(/\D/g, "").length !== 11) erro("cpf", "Informe um CPF com 11 números.");
    if (!isValidEmail(dados.email)) erro("email", "Digite um e-mail válido.");
    if (dados.telefone.replace(/\D/g, "").length < 10) erro("telefone", "Informe um telefone com DDD.");
    if (!dados.dataNascimento) erro("dataNascimento", "Informe sua data de nascimento.");
    if (dados.senha.length < 8 || !/[A-Za-z]/.test(dados.senha) || !/\d/.test(dados.senha)) erro("senha", "Use ao menos 8 caracteres, com letras e números.");
    if (dados.confirmarSenha !== dados.senha) erro("confirmarSenha", "As senhas não coincidem.");
    if (invalido) { showAlert(alertBox, "Corrija os campos destacados para continuar.", "error"); return; }

    // O tipo Vendedor continua visível, mas não altera o cadastro nesta etapa.
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = "Cadastrando...";
    try {
      const resposta = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.nome,
          cpf: dados.cpf,
          email: dados.email,
          telefone: dados.telefone,
          dataNascimento: dados.dataNascimento,
          senha: dados.senha
        })
      });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.message || "Não foi possível realizar o cadastro.");
      showAlert(alertBox, "Cadastro realizado com sucesso! Você será direcionado ao login.", "success");
      form.reset();
      setTimeout(() => { window.location.href = "index.html"; }, 1600);
    } catch (erroRequisicao) {
      const mensagem = erroRequisicao.message === "Failed to fetch"
        ? "Não foi possível conectar à API. Verifique se o servidor está iniciado."
        : erroRequisicao.message;
      showAlert(alertBox, mensagem, "error");
    } finally {
      botao.disabled = false;
      botao.textContent = "Cadastrar";
    }
  });

  document.getElementById("backToLogin").addEventListener("click", () => { window.location.href = "index.html"; });
}

document.addEventListener("DOMContentLoaded", initRegisterPage);
