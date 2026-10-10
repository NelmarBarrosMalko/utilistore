/* ===========================================================
  SCRIPT.JS
  Controla login, cadastro e recuperação de senha.
  Tudo é simulado no front-end (sem conexão com banco de dados).
   =========================================================== */

/* -----------------------------------------------------------
  FUNÇÕES AUXILIARES GERAIS
   ----------------------------------------------------------- */

// Exibe uma mensagem dentro de uma caixa de alerta (sucesso ou erro)
function showAlert(boxElement, message, type) {
  boxElement.textContent = message;
  boxElement.className = "alert " + type; // "success" ou "error"
  boxElement.hidden = false;
}

// Esconde a caixa de alerta
function hideAlert(boxElement) {
  boxElement.hidden = true;
  boxElement.textContent = "";
}

// Valida um formato simples de e-mail
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Mostra uma mensagem de erro abaixo de um campo específico
function setFieldError(errorElement, message) {
  errorElement.textContent = message || "";
}

// Alterna a visibilidade de um campo de senha (mostrar/esconder)
function togglePasswordVisibility(inputElement, buttonElement) {
  const isHidden = inputElement.type === "password";
  inputElement.type = isHidden ? "text" : "password";
  buttonElement.textContent = isHidden ? "🙈" : "👁️";
  buttonElement.setAttribute(
    "aria-label",
    isHidden ? "Esconder senha" : "Mostrar senha"
  );
}

/* -----------------------------------------------------------
   PÁGINA DE LOGIN (index.html)
   ----------------------------------------------------------- */
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

  // Envio do formulário de login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert(alertBox);
    setFieldError(emailError, "");
    setFieldError(passwordError, "");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const accessType = document.querySelector(
      'input[name="accessType"]:checked'
    ).value;

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

    // Simulação de login bem-sucedido
    const tipoTexto = accessType === "vendedor" ? "Vendedor" : "Usuário";
    showAlert(
      alertBox,
      `Login realizado com sucesso! Você entrou como ${tipoTexto}.`,
      "success"
    );
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);

    loginForm.reset();
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

/* -----------------------------------------------------------
   PÁGINA DE CADASTRO (cadastro.html)
   ----------------------------------------------------------- */
function initRegisterPage() {
  const registerForm = document.getElementById("registerForm");
  const alertBox = document.getElementById("alertBox");

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("regEmail");
  const passwordInput = document.getElementById("regPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const fullNameError = document.getElementById("fullNameError");
  const emailError = document.getElementById("regEmailError");
  const passwordError = document.getElementById("regPasswordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  // Botões de mostrar/esconder senha (podem existir vários na página)
  const toggleButtons = document.querySelectorAll(".toggle-password[data-target]");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetInput = document.getElementById(btn.dataset.target);
      togglePasswordVisibility(targetInput, btn);
    });
  });

  // Envio do formulário de cadastro
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert(alertBox);
    setFieldError(fullNameError, "");
    setFieldError(emailError, "");
    setFieldError(passwordError, "");
    setFieldError(confirmPasswordError, "");

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const registerType = document.querySelector(
      'input[name="registerType"]:checked'
    ).value;

    let hasError = false;

    if (!fullName) {
      setFieldError(fullNameError, "Informe seu nome completo.");
      hasError = true;
    }

    if (!email) {
      setFieldError(emailError, "Informe seu e-mail.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError(emailError, "Digite um e-mail válido.");
      hasError = true;
    }

    if (!password) {
      setFieldError(passwordError, "Crie uma senha.");
      hasError = true;
    } else if (password.length < 4) {
      setFieldError(passwordError, "A senha deve ter ao menos 4 caracteres.");
      hasError = true;
    }

    if (!confirmPassword) {
      setFieldError(confirmPasswordError, "Confirme sua senha.");
      hasError = true;
    } else if (password && confirmPassword !== password) {
      setFieldError(confirmPasswordError, "As senhas não coincidem.");
      hasError = true;
    }

    if (hasError) {
      showAlert(alertBox, "Corrija os campos destacados para continuar.", "error");
      return;
    }

    // Simulação de cadastro bem-sucedido
    const tipoTexto = registerType === "vendedor" ? "Vendedor" : "Usuário";
    showAlert(
      alertBox,
      `Cadastro realizado com sucesso como ${tipoTexto}! Redirecionando para o login...`,
      "success"
    );

    registerForm.reset();

    // Redireciona para o login após um pequeno atraso
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1800);
  });

  // Botão "Fazer login" volta para a página inicial
  const backToLoginBtn = document.getElementById("backToLogin");
  backToLoginBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

/* -----------------------------------------------------------
   INICIALIZAÇÃO: detecta em qual página o script está rodando
   ----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("page-login")) {
    initLoginPage();
  } else if (document.body.classList.contains("page-register")) {
    initRegisterPage();
  }
});
