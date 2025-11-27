const api = "/api/publicacoes";
const modalBackdrop = document.getElementById("modal-backdrop");
const formBox = document.getElementById("form-box");
const listaDiv = document.getElementById("lista");
const confirmBackdrop = document.getElementById("confirm-modal-backdrop");
const confirmYesBtn = document.getElementById("confirm-yes");
const confirmNoBtn = document.getElementById("confirm-no");
let postIdToExclude = null;

function abrirForm() {
	modalBackdrop.classList.add("show");
}

function fecharForm() {
	modalBackdrop.classList.remove("show");
	limpar();
}

modalBackdrop.addEventListener("click", function (event) {
	if (event.target === modalBackdrop) {
		fecharForm();
	}
});

document.addEventListener("keydown", function (event) {
	if (event.key === "Escape") {
		if (modalBackdrop.classList.contains("show")) {
			fecharForm();
		} else if (confirmBackdrop.classList.contains("show")) {
			fecharConfirmacao();
		}
	}
});

function carregar() {
	fetch(api)
		.then((r) => r.json())
		.then((dados) => {
			listaDiv.innerHTML = "";

			dados.forEach((p) => {
				const publicado = new Date(p.dataPublicacao) < new Date();
				const badge = publicado ? "" : '<span class="badge badge-nao-publicado">NÃO PUBLICADO</span>'; // Uso de += para evitar sobrescrever o innerHTML em cada iteração (mais rápido)

				listaDiv.innerHTML += `
          <div class="card ${publicado ? "" : "nao-publicado"}">
            <h3>${p.titulo} ${badge}</h3>
            <p><strong>Autor:</strong> ${p.autor}</p>
            <p><strong>Publicado em:</strong> ${new Date(p.dataPublicacao).toLocaleDateString("pt-BR")}</p>
            <p>${p.texto}</p>

            <div class="card-footer">
							<button class="btn-outline btn-outline-primary" onclick="editar(${p.id})">Alterar</button>
							<button class="btn-outline btn-outline-danger" onclick="confirmarExclusao(${p.id})">Excluir</button>
            </div>
          </div>`;
			});
		});
}

async function salvar() {
	const id = document.getElementById("id").value;
	const obj = {
		titulo: document.getElementById("titulo").value,
		autor: document.getElementById("autor").value,
		dataPublicacao: document.getElementById("data").value,
		texto: document.getElementById("texto").value,
	};

	const metodo = id ? "PUT" : "POST";
	const url = id ? api + "/" + id : api;

	try {
		const response = await fetch(url, {
			method: metodo,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(obj),
		});

		if (!response.ok) {
			const errorJson = await response.json().catch(() => null);
			if (errorJson?.errors) {
				const mensagens = errorJson.errors.map((e) => `<p>${e.defaultMessage}</p>`).join("");
				throw new Error(mensagens);
			}
			throw new Error(errorJson?.message || "Erro ao salvar a publicação");
		}

		mostrarMensagem("Publicação salva com sucesso!", "sucesso");
		carregar();
		fecharForm();
	} catch (error) {
		console.error("Erro ao salvar:", error);
		mostrarMensagem(error.message, "erro");
	}
}

async function editar(id) {
	try {
		const response = await fetch(api + "/" + id);

		if (!response.ok) {
			const errorJson = await response.json().catch(() => null);
			if (errorJson?.errors) {
				const mensagens = errorJson.errors.map((e) => e.defaultMessage).join("");
				throw new Error(mensagens);
			}
			throw new Error(errorJson?.message || "Erro ao carregar publicação");
		}

		const p = await response.json();

		document.getElementById("id").value = p.id;
		document.getElementById("titulo").value = p.titulo;
		document.getElementById("autor").value = p.autor;
		document.getElementById("data").value = new Date(p.dataPublicacao).toISOString().split("T")[0];
		document.getElementById("texto").value = p.texto;

		document.getElementById("tituloForm").innerText = "Editar Publicação";

		mostrarMensagem("Publicação carregada para edição.", "sucesso");
		abrirForm();
	} catch (error) {
		console.error("Erro ao editar:", error);
		mostrarMensagem(error.message, "erro");
	}
}

async function excluir(id) {
	try {
		const response = await fetch(api + "/" + id, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorJson = await response.json().catch(() => null);
			if (errorJson?.errors) {
				const mensagens = errorJson.errors.map((e) => e.defaultMessage).join("");
				throw new Error(mensagens);
			}
			throw new Error(errorJson?.message || "Erro ao excluir a publicação");
		}

		mostrarMensagem("Publicação excluída com sucesso!", "sucesso");
		carregar();
		fecharConfirmacao();
	} catch (error) {
		console.error("Erro ao excluir:", error);
		mostrarMensagem(error.message, "erro");
	}
}

function abrirConfirmacao(id) {
	postIdToExclude = id;
	confirmBackdrop.classList.add("show");
}

function fecharConfirmacao() {
	confirmBackdrop.classList.remove("show");
	postIdToExclude = null;
}

function confirmarExclusao(id) {
	abrirConfirmacao(id);
}

confirmYesBtn.addEventListener("click", function () {
	if (postIdToExclude) {
		excluir(postIdToExclude);
	}
});

confirmNoBtn.addEventListener("click", fecharConfirmacao);
confirmBackdrop.addEventListener("click", function (event) {
	if (event.target === confirmBackdrop) {
		fecharConfirmacao();
	}
});

function mostrarMensagem(texto, tipo) {
	const msg = document.getElementById("mensagem");
	msg.innerHTML = texto;
	msg.className = "mensagem " + tipo;
	msg.style.display = "block";

	setTimeout(() => {
		msg.style.display = "none";
	}, 20000);
}

function limpar() {
	document.getElementById("id").value = "";
	document.getElementById("titulo").value = "";
	document.getElementById("autor").value = "";
	document.getElementById("data").value = "";
	document.getElementById("texto").value = "";
	document.getElementById("tituloForm").innerText = "Nova Publicação";
}

carregar();
