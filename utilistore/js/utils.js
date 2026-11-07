/* ===========================================================
  UTILS.JS
  Funções auxiliares compartilhadas entre as páginas (login,
  cadastro, etc). Nenhuma lógica de página específica aqui.
   =========================================================== */

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
