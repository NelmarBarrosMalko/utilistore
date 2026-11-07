/* ===========================================================
  LOGIN.JS
  Lógica da página de login (index.html): autenticação real via
  API e modal de "esqueci minha senha" (ainda simulado).
  Depende das funções definidas em utils.js (carregue-o antes).
   =========================================================== */

function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const alertBox = document.getElementById("alertBox");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const togglePasswordBtn = document.getElementById("togglePassword");

  // Botão de mostrar/esconder senha
  togglePasswordBtn.addEventListener("click", () => {
    togglePasswordVisibility(passwordInput, togglePasswordBtn);
  });

  // URL base da API. Ajuste aqui se a API rodar em outro endereço/porta.
  const API_BASE_URL = "http://localhost:3000";

  // Envio do formulário de login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideAlert(alertBox);
    setFieldError(emailError, "");
    setFieldError(passwordError, "");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let hasError = false;

    if (!email) {
      setFieldError(emailError, "Informe seu e-mail.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError(emailError, "Digite um e-mail válido.");
      hasError = true;
    }

    if (!password) {
      setFieldError(passwordError, "Informe sua senha.");
      hasError = true;
    } else if (password.length < 4) {
      setFieldError(passwordError, "A senha deve ter ao menos 4 caracteres.");
      hasError = true;
    }

    if (hasError) {
      showAlert(alertBox, "Corrija os campos destacados para continuar.", "error");
      return;
    }

    // Evita múltiplos cliques enquanto a API responde
    const submitButton = loginForm.querySelector(".btn-primary");
    submitButton.disabled = true;

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, senha: password }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        // A API já devolve uma mensagem adequada para 400/401/500
        showAlert(
          alertBox,
          dados.message || "Não foi possível entrar. Tente novamente.",
          "error"
        );
        return;
      }

      // Login real: guarda o token (nunca a senha) para as próximas requisições
      localStorage.setItem("utilistoreToken", dados.token);
      localStorage.setItem("utilistoreCliente", JSON.stringify(dados.cliente));

      showAlert(
        alertBox,
        `Login realizado com sucesso! Bem-vindo(a), ${dados.cliente.nome}.`,
        "success"
      );
      loginForm.reset();

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (erro) {
      // Falha de rede, API fora do ar, CORS bloqueado, etc.
      showAlert(
        alertBox,
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
    }
  });

  // Redireciona para a página de cadastro
  const goToRegisterBtn = document.getElementById("goToRegister");
  goToRegisterBtn.addEventListener("click", () => {
    window.location.href = "cadastro.html";
  });

  /* --------- Modal: Esqueci minha senha --------- */
  const forgotBtn = document.getElementById("forgotPasswordBtn");
  const forgotModalOverlay = document.getElementById("forgotModalOverlay");
  const closeForgotModalBtn = document.getElementById("closeForgotModal");
  const forgotForm = document.getElementById("forgotForm");
  const forgotEmailInput = document.getElementById("forgotEmail");
  const forgotEmailError = document.getElementById("forgotEmailError");
  const forgotAlertBox = document.getElementById("forgotAlertBox");

  function openForgotModal() {
    forgotModalOverlay.hidden = false;
  }

  function closeForgotModal() {
    forgotModalOverlay.hidden = true;
    forgotForm.reset();
    setFieldError(forgotEmailError, "");
    hideAlert(forgotAlertBox);
  }

  forgotBtn.addEventListener("click", openForgotModal);
  closeForgotModalBtn.addEventListener("click", closeForgotModal);

  // Fecha o modal ao clicar fora da caixa
  forgotModalOverlay.addEventListener("click", (event) => {
    if (event.target === forgotModalOverlay) {
      closeForgotModal();
    }
  });

  // Envio do formulário de recuperação de senha
  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert(forgotAlertBox);
    setFieldError(forgotEmailError, "");

    const email = forgotEmailInput.value.trim();

    if (!email) {
      setFieldError(forgotEmailError, "Informe seu e-mail.");
      return;
    }

    if (!isValidEmail(email)) {
      setFieldError(forgotEmailError, "Digite um e-mail válido.");
      return;
    }

    // Simulação de envio de e-mail de recuperação
    showAlert(
      forgotAlertBox,
      `Um link de recuperação foi enviado (simulado) para ${email}.`,
      "success"
    );
  });
}

document.addEventListener("DOMContentLoaded", initLoginPage);
