let token = sessionStorage.getItem('token');
let usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioAtual'));

let notas = [];
let eventos = [];
let avaliacoes = [];

let mesCalendario = new Date().getMonth();
let anoCalendario = new Date().getFullYear();
let dataEscolhida = new Date().toISOString().slice(0, 10);

async function api(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      dados.erro || 'Não foi possível concluir a operação.'
    );
  }

  return dados;
}

function avisar(texto, tipo = 'ok') {
  const toast = document.getElementById('toast');

  toast.textContent = texto;
  toast.className =
    tipo === 'erro'
      ? 'toast erro-toast'
      : 'toast';

  toast.hidden = false;

  clearTimeout(avisar.tempo);

  avisar.tempo = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function formatarData(data) {
  return String(data || '')
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('/');
}

function mostrarErro(id, erro) {
  document.getElementById(id).textContent = erro.message;
}

function formatarCnpj(cnpj) {
  const numero = String(cnpj || '').replace(/\D/g, '');

  return numero.length === 14
    ? `${numero.slice(0, 2)}.${numero.slice(2, 5)}.${numero.slice(5, 8)}/${numero.slice(8, 12)}-${numero.slice(12)}`
    : numero;
}

function escapar(texto) {
  return String(texto || '').replace(
    /[&<>"']/g,
    caractere => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[caractere])
  );
}

const abaCadastro = document.getElementById('aba-cadastro');
const abaLogin = document.getElementById('aba-login');
const modalAcesso = document.getElementById('modal-acesso');

function selecionarAbaAcesso(modo) {
  const cadastro = modo === 'cadastro';

  abaCadastro.classList.toggle('ativo', cadastro);
  abaLogin.classList.toggle('ativo', !cadastro);

  document
    .getElementById('form-cadastro')
    .classList.toggle('escondido', !cadastro);

  document
    .getElementById('form-login')
    .classList.toggle('escondido', cadastro);

  document.getElementById('texto-acesso').textContent = cadastro
    ? 'Crie sua conta para começar.'
    : 'Entre com os dados da sua conta.';
}

abaCadastro.onclick = () => selecionarAbaAcesso('cadastro');
abaLogin.onclick = () => selecionarAbaAcesso('login');

document.querySelectorAll('[data-ir]').forEach(botao => {
  botao.addEventListener('click', () => {
    selecionarAbaAcesso(botao.dataset.ir);

    modalAcesso.showModal();

    document
      .querySelector(
        botao.dataset.ir === 'login'
          ? '#usuario'
          : '#cad-nome'
      )
      .focus();
  });
});

document.getElementById('fechar-acesso').onclick = () => {
  modalAcesso.close();
};

modalAcesso.addEventListener('click', evento => {
  if (evento.target === modalAcesso) {
    modalAcesso.close();
  }
});

document.getElementById('fechar-anuncio').onclick = () => {
  document.getElementById('faixa-anuncio').remove();
};

document.getElementById('form-cadastro').onsubmit = async evento => {
  evento.preventDefault();

  try {
    await api('/api/cadastro', {
      method: 'POST',
      body: JSON.stringify({
        nome: document.getElementById('cad-nome').value,
        usuario: document.getElementById('cad-usuario').value,
        senha: document.getElementById('cad-senha').value,
        cnpj: document.getElementById('cad-cnpj').value,
        tipo: document.getElementById('cad-tipo').value
      })
    });

    document.getElementById('erro-cadastro').className = 'mensagem';

    document.getElementById('erro-cadastro').textContent =
      'Conta criada. Agora entre no sistema.';

    document.getElementById('usuario').value =
      document.getElementById('cad-usuario').value;

    abaLogin.click();
  } catch (erro) {
    document.getElementById('erro-cadastro').className = 'erro';
    mostrarErro('erro-cadastro', erro);
  }
};

document.getElementById('form-login').onsubmit = async evento => {
  evento.preventDefault();

  try {
    const dados = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value
      })
    });

    token = dados.token;
    usuarioAtual = dados.usuario;

    sessionStorage.setItem('token', token);
    sessionStorage.setItem(
      'usuarioAtual',
      JSON.stringify(usuarioAtual)
    );

    abrirSite();
  } catch (erro) {
    mostrarErro('erro-login', erro);
  }
};

async function abrirSite() {
  if (modalAcesso.open) {
    modalAcesso.close();
  }

  document.getElementById('tela-acesso').style.display = 'none';
  document.getElementById('site').style.display = 'block';

  const tipo =
    usuarioAtual.tipo === 'dono'
      ? 'Dono'
      : usuarioAtual.tipo === 'gerente'
        ? 'Gerente'
        : 'Funcionário';

  document.getElementById('nome-usuario').textContent =
    `${usuarioAtual.nome} (${tipo}) · CNPJ ${formatarCnpj(usuarioAtual.cnpj)}`;

  document
    .querySelectorAll('.gestor-only')
    .forEach(elemento => {
      elemento.style.display =
        ['dono', 'gerente'].includes(usuarioAtual.tipo)
          ? ''
          : 'none';
    });

  await carregarDados();
}

async function carregarDados() {
  try {
    [
      notas,
      eventos,
      avaliacoes
    ] = await Promise.all([
      api('/api/notas'),
      api('/api/eventos'),
      api('/api/resultados')
    ]);

    mostrarNotas();
    mostrarEventos();
    atualizarResultados();
    renderizarCalendario();

    if (['dono', 'gerente'].includes(usuarioAtual.tipo)) {
      mostrarPainel();
    }
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
}

if (token && usuarioAtual) {
  abrirSite();
}

document.getElementById('sair').onclick = async () => {
  try {
    await api('/api/logout', {
      method: 'POST'
    });
  } finally {
    sessionStorage.clear();
    location.reload();
  }
};

document.querySelectorAll('.menu').forEach(menu => {
  menu.onclick = () => {
    document
      .querySelectorAll('.menu')
      .forEach(item => item.classList.remove('ativo'));

    document
      .querySelectorAll('.pagina')
      .forEach(pagina => pagina.classList.remove('ativa'));

    menu.classList.add('ativo');

    document
      .getElementById(menu.dataset.pagina)
      .classList.add('ativa');

    if (menu.dataset.pagina === 'painel') {
      mostrarPainel();
    }
  };
});

document.getElementById('nota').oninput = evento => {
  document.getElementById('valor-nota').textContent =
    evento.target.value;
};

document.getElementById('form-avaliacao').onsubmit = async evento => {
  evento.preventDefault();

  try {
    await api('/api/avaliacoes', {
      method: 'POST',
      body: JSON.stringify({
        humor: document.querySelector(
          'input[name="humor"]:checked'
        ).value,
        nota: Number(
          document.getElementById('nota').value
        ),
        comentario: document.getElementById('comentario').value,
        anonimo: document.getElementById('anonimo').checked
      })
    });

    evento.target.reset();

    document.getElementById('nota').value = 7;
    document.getElementById('valor-nota').textContent = '7';

    document.getElementById(
      'mensagem-avaliacao'
    ).textContent = 'Avaliação salva com sucesso.';

    avisar('Avaliação salva.');

    await carregarDados();
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
};

function atualizarBotaoRemoverComentario() {
  const botao = document.getElementById(
    'remover-comentario'
  );

  if (!botao) {
    return;
  }

  const avaliacaoComComentario = avaliacoes.find(
    avaliacao =>
      avaliacao.comentario &&
      avaliacao.comentario.trim() !== ''
  );

  if (avaliacaoComComentario) {
    botao.hidden = false;
    botao.dataset.id = avaliacaoComComentario.id;
  } else {
    botao.hidden = true;
    botao.dataset.id = '';
  }
}

const botaoRemoverComentario =
  document.getElementById('remover-comentario');

if (botaoRemoverComentario) {
  botaoRemoverComentario.onclick = async () => {
    const id = botaoRemoverComentario.dataset.id;

    if (!id) {
      return;
    }

    const confirmou = confirm(
      'Deseja remover seu comentário? A nota continuará salva.'
    );

    if (!confirmou) {
      return;
    }

    try {
      await api(`/api/avaliacoes/${id}/comentario`, {
        method: 'DELETE'
      });

      document.getElementById('comentario').value = '';

      avisar('Comentário removido com sucesso.');

      await carregarDados();
    } catch (erro) {
      avisar(erro.message, 'erro');
    }
  };
}

document.getElementById('form-nota').onsubmit = async evento => {
  evento.preventDefault();

  try {
    await api('/api/notas', {
      method: 'POST',
      body: JSON.stringify({
        titulo: document.getElementById('titulo-nota').value,
        texto: document.getElementById('texto-nota').value
      })
    });

    evento.target.reset();

    avisar('Nota adicionada.');

    await carregarDados();
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
};

document.getElementById('form-evento').onsubmit = async evento => {
  evento.preventDefault();

  try {
    await api('/api/eventos', {
      method: 'POST',
      body: JSON.stringify({
        titulo: document.getElementById('evento-titulo').value,
        data: document.getElementById('evento-data').value
      })
    });

    dataEscolhida =
      document.getElementById('evento-data').value;

    evento.target.reset();

    document.getElementById('evento-data').value =
      dataEscolhida;

    avisar('Compromisso agendado.');

    await carregarDados();
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
};

function mostrarNotas() {
  const lista = document.getElementById('lista-notas');

  lista.innerHTML =
    notas
      .map(
        nota => `
          <article class="item">
            <h3>${escapar(nota.titulo)}</h3>
            <small>${formatarData(nota.data)}</small>
            <p>${escapar(nota.texto)}</p>

            <div class="item-rodape">
              <button
                type="button"
                onclick="apagarNota(${nota.id})"
              >
                Apagar
              </button>
            </div>
          </article>
        `
      )
      .join('') ||
    '<p class="vazio">Nenhuma nota ainda. A primeira aparece aqui.</p>';
}

async function apagarNota(id) {
  try {
    await api(`/api/notas/${id}`, {
      method: 'DELETE'
    });

    avisar('Nota apagada.');

    await carregarDados();
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
}

function mostrarEventos() {
  const lista = document.getElementById('lista-eventos');

  const eventosDoDia = eventos.filter(
    evento => evento.data === dataEscolhida
  );

  const podeGerenciar = [
    'dono',
    'gerente'
  ].includes(usuarioAtual.tipo);

  lista.innerHTML =
    eventosDoDia
      .map(
        evento => `
          <article class="item">
            <h3>${escapar(evento.titulo)}</h3>
            <small>${formatarData(evento.data)}</small>

            ${
              podeGerenciar
                ? `
                  <div class="item-rodape">
                    <button
                      type="button"
                      onclick="apagarEvento(${evento.id})"
                    >
                      Apagar
                    </button>
                  </div>
                `
                : ''
            }
          </article>
        `
      )
      .join('') ||
    '<p class="vazio">Nada agendado neste dia.</p>';

  const dia = document.getElementById('dia-escolhido');

  if (dia) {
    dia.textContent =
      `Compromissos em ${formatarData(dataEscolhida)}: ${eventosDoDia.length}`;
  }
}

async function apagarEvento(id) {
  try {
    await api(`/api/eventos/${id}`, {
      method: 'DELETE'
    });

    avisar('Compromisso apagado.');

    await carregarDados();
  } catch (erro) {
    avisar(erro.message, 'erro');
  }
}

function atualizarResultados() {
  const comComentarios = avaliacoes.filter(
    avaliacao =>
      avaliacao.comentario &&
      avaliacao.comentario.trim() !== ''
  );

  document.getElementById('total-avaliacoes').textContent =
    avaliacoes.length;

  document.getElementById('total-comentarios').textContent =
    comComentarios.length;

  document.getElementById('total-registros').textContent =
    notas.length + eventos.length;

  document.getElementById('contador-notas').textContent =
    notas.length;

  document.getElementById('contador-eventos').textContent =
    eventos.length;

  const media = avaliacoes.length
    ? avaliacoes.reduce(
        (total, avaliacao) => total + avaliacao.nota,
        0
      ) / avaliacoes.length
    : 0;

  document.getElementById('media-avaliacoes').textContent =
    media.toFixed(1);

  atualizarBotaoRemoverComentario();
}

async function mostrarPainel() {
  if (!['dono', 'gerente'].includes(usuarioAtual.tipo)) {
    return;
  }

  const dados = await api('/api/empresa');

  const comentarios = dados.avaliacoes.filter(
    avaliacao =>
      avaliacao.comentario &&
      avaliacao.comentario.trim()
  );

  document.getElementById('total-usuarios').textContent =
    dados.funcionarios.length;

  document.getElementById('total-equipe').textContent =
    dados.avaliacoes.length;

  document.getElementById(
    'total-comentarios-equipe'
  ).textContent = comentarios.length;

  const media = dados.avaliacoes.length
    ? dados.avaliacoes.reduce(
        (total, avaliacao) => total + avaliacao.nota,
        0
      ) / dados.avaliacoes.length
    : 0;

  document.getElementById('media-equipe').textContent =
    media.toFixed(1);

  document.getElementById('media-comentarios').textContent =
    media.toFixed(1);

  document.getElementById('lista-usuarios').innerHTML =
    dados.funcionarios
      .map(
        usuario => `
          <div class="usuario-item">
            <b>${escapar(usuario.nome)}</b>
            <small>@${escapar(usuario.usuario)}</small>
          </div>
        `
      )
      .join('') ||
    '<p>Nenhum funcionário cadastrado.</p>';

  const registros = dados.avaliacoes
    .map(
      avaliacao => `
        <div class="registro-resumo">
          <strong>
            ${
              avaliacao.anonimo
                ? 'Registro anônimo'
                : escapar(avaliacao.nome)
            }
          </strong>

          · ${formatarData(avaliacao.data)}

          <p>
            ${escapar(
              avaliacao.comentario || 'Sem comentário.'
            )}
          </p>
        </div>
      `
    )
    .join('');

  document.getElementById('lista-registros').innerHTML =
    registros ||
    '<p>Nenhuma avaliação recebida.</p>';

  document.getElementById('lista-comentarios').innerHTML =
    comentarios
      .map(
        avaliacao => `
          <article class="comentario-item">
            <strong>
              ${
                avaliacao.anonimo
                  ? 'Comentário anônimo'
                  : escapar(avaliacao.nome)
              }
            </strong>

            <small>
              · ${formatarData(avaliacao.data)}
              · Nota ${avaliacao.nota}/10
            </small>

            <p>${escapar(avaliacao.comentario)}</p>
          </article>
        `
      )
      .join('') ||
    '<p class="vazio">Nenhum comentário enviado.</p>';
}

function renderizarCalendario() {
  const grade = document.getElementById(
    'grade-calendario'
  );

  if (!grade) {
    return;
  }

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  document.getElementById('mes-atual').textContent =
    meses[mesCalendario];

  document.getElementById('ano-atual').textContent =
    anoCalendario;

  const primeiroDia = new Date(
    anoCalendario,
    mesCalendario,
    1
  ).getDay();

  const diasNoMes = new Date(
    anoCalendario,
    mesCalendario + 1,
    0
  ).getDate();

  const hoje = new Date()
    .toISOString()
    .slice(0, 10);

  grade.innerHTML =
    '<span class="dia-vazio"></span>'.repeat(
      primeiroDia
    );

  for (
    let numero = 1;
    numero <= diasNoMes;
    numero += 1
  ) {
    const data =
      `${anoCalendario}-${String(mesCalendario + 1).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;

    const classes = ['dia-calendario'];

    if (data === dataEscolhida) {
      classes.push('selecionado');
    }

    if (data === hoje) {
      classes.push('hoje');
    }

    const temEvento = eventos.some(
      evento => evento.data === data
    );

    grade.insertAdjacentHTML(
      'beforeend',
      `
        <button
          type="button"
          class="${classes.join(' ')}"
          data-data="${data}"
          aria-label="${numero}${
            temEvento ? ', com compromisso' : ''
          }"
        >
          ${numero}
          ${
            temEvento
              ? '<i class="ponto-evento"></i>'
              : ''
          }
        </button>
      `
    );
  }

  grade
    .querySelectorAll('.dia-calendario')
    .forEach(botao => {
      botao.onclick = () => {
        dataEscolhida = botao.dataset.data;

        document.getElementById(
          'evento-data'
        ).value = dataEscolhida;

        renderizarCalendario();
        mostrarEventos();
      };
    });
}

document.getElementById('mes-anterior').onclick = () => {
  mesCalendario--;

  if (mesCalendario < 0) {
    mesCalendario = 11;
    anoCalendario--;
  }

  renderizarCalendario();
};

document.getElementById('mes-proximo').onclick = () => {
  mesCalendario++;

  if (mesCalendario > 11) {
    mesCalendario = 0;
    anoCalendario++;
  }

  renderizarCalendario();
};

document.getElementById('baixar-dados').onclick =
  async () => {
    const dados = [
      'dono',
      'gerente'
    ].includes(usuarioAtual.tipo)
      ? await api('/api/empresa')
      : null;

    if (!dados) {
      return;
    }

    const arquivo = new Blob(
      [JSON.stringify(dados, null, 2)],
      {
        type: 'application/json'
      }
    );

    const link = document.createElement('a');

    link.href = URL.createObjectURL(arquivo);
    link.download = 'relatorio-da-empresa.json';
    link.click();
  };
