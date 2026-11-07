/* ===========================================================
  CADASTRO.JS
  Lógica da página de cadastro (cadastro.html).
  Ainda simulado no front-end (sem conexão com a API/banco).
  Depende das funções definidas em utils.js (carregue-o antes).
   =========================================================== */

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

document.addEventListener("DOMContentLoaded", initRegisterPage);
