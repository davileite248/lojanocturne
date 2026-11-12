// Proteção por chave para páginas de administrador (ex.: get.html).
// Para proteger outra página, inclua no HTML:
//   <link rel="stylesheet" href="admin.css">           (dentro do <head>)
//   <script src="admin.js"></script>                   (ANTES do script da própria página)

const CHAVE_ADMIN = "nocturne-admin"; // <-- TROQUE pela chave que você quiser

(function () {
  const autorizado = () => sessionStorage.getItem("admin") === "1";

  // Segura os fetch() da página (ex.: o do get.js) até a chave ser digitada.
  // Assim os cadastrados nem são carregados antes do login.
  const fetchOriginal = window.fetch.bind(window);
  const fila = [];
  window.fetch = (...args) =>
    autorizado()
      ? fetchOriginal(...args)
      : new Promise((ok, erro) => fila.push(() => fetchOriginal(...args).then(ok, erro)));
  const liberar = () => { while (fila.length) fila.shift()(); };

  function botaoSair() {
    const b = document.createElement("button");
    b.className = "admin-sair";
    b.textContent = "Sair do modo admin";
    b.addEventListener("click", () => { sessionStorage.removeItem("admin"); location.reload(); });
    document.body.appendChild(b);
  }

  if (autorizado()) { botaoSair(); return; }

  // Tela de bloqueio por cima da página
  document.body.classList.add("bloqueado");
  const portao = document.createElement("div");
  portao.className = "portao";
  portao.innerHTML = `
    <form class="portao-card" novalidate>
      <h2>Nocturne</h2>
      <p class="portao-sub">Área restrita ao administrador.</p>
      <label for="chaveAdmin">Chave de acesso</label>
      <input type="password" id="chaveAdmin" autocomplete="off" required>
      <p class="portao-erro" role="alert" hidden>Chave incorreta. Tente novamente.</p>
      <button type="submit">Entrar</button>
      <a href="index.html">Voltar à loja</a>
    </form>`;
  document.body.appendChild(portao);

  const campo = portao.querySelector("input");
  const erro = portao.querySelector(".portao-erro");
  campo.focus();

  portao.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (campo.value === CHAVE_ADMIN) {
      sessionStorage.setItem("admin", "1");   // vale até fechar a aba
      portao.remove();
      document.body.classList.remove("bloqueado");
      botaoSair();
      liberar();                               // agora o get.js pode buscar os dados
    } else {
      erro.hidden = false;
      campo.value = "";
      campo.focus();
    }
  });
})();