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

  if (numero.length !== 14) {
    return numero;
  }

  return `${numero.slice(0, 2)}.${numero.slice(2, 5)}.${numero.slice(5, 8)}/${numero.slice(8, 12)}-${numero.slice(12)}`;
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

  document.getElementById('nome-usuario').textContent =
    `${usuarioAtual.nome} · CNPJ ${formatarCnpj(usuarioAtual.cnpj)}`;

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
      await mostrarPainel();
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
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: token
          ? `Bearer ${token}`
          : ''
      }
    });
  } catch (erro) {
    console.warn('Não foi possível avisar o servidor sobre o logout.');
  } finally {
    token = null;
    usuarioAtual = null;
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

  const comentario = avaliacoes.find(
    avaliacao =>
      avaliacao.comentario &&
      avaliacao.comentario.trim() !== ''
  );

  botao.hidden = !comentario;
  botao.dataset.id = comentario
    ? comentario.id
    : '';
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
      'Deseja excluir a avaliação e o comentário?'
    );

    if (!confirmou) {
      return;
    }

    try {
      await api(`/api/avaliacoes/${id}/comentario`, {
        method: 'DELETE'
      });

      avisar('Avaliação removida com sucesso.');

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
  const avaliacoesExistentes = Array.isArray(avaliacoes)
    ? avaliacoes
    : [];

  const comentarios = avaliacoesExistentes.filter(
    avaliacao =>
      avaliacao.comentario &&
      String(avaliacao.comentario).trim() !== ''
  );

  document.getElementById('total-avaliacoes').textContent =
    avaliacoesExistentes.length;

  document.getElementById('total-comentarios').textContent =
    comentarios.length;

  document.getElementById('total-registros').textContent =
    notas.length + eventos.length;

  document.getElementById('contador-notas').textContent =
    notas.length;

  document.getElementById('contador-eventos').textContent =
    eventos.length;

  const media = avaliacoesExistentes.length > 0
    ? avaliacoesExistentes.reduce(
        (total, avaliacao) =>
          total + Number(avaliacao.nota || 0),
        0
      ) / avaliacoesExistentes.length
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

  const todasAvaliacoes = Array.isArray(dados.avaliacoes)
    ? dados.avaliacoes
    : [];

  /*
   * Só considera avaliações que ainda possuem comentário.
   * Isso impede que apareçam:
   *
   * Registro anônimo
   * Sem comentário.
   *
   * Também faz a média voltar para 0.0 quando não há comentários.
   */
  const avaliacoesValidas = todasAvaliacoes.filter(
    avaliacao =>
      avaliacao.comentario &&
      String(avaliacao.comentario).trim() !== ''
  );

  const funcionarios = Array.isArray(dados.funcionarios)
    ? dados.funcionarios
    : [];

  document.getElementById('total-usuarios').textContent =
    funcionarios.length;

  document.getElementById('total-equipe').textContent =
    avaliacoesValidas.length;

  document.getElementById(
    'total-comentarios-equipe'
  ).textContent = avaliacoesValidas.length;

  const mediaEquipe = avaliacoesValidas.length > 0
    ? avaliacoesValidas.reduce(
        (total, avaliacao) =>
          total + Number(avaliacao.nota || 0),
        0
      ) / avaliacoesValidas.length
    : 0;

  document.getElementById('media-equipe').textContent =
    mediaEquipe.toFixed(1);

  document.getElementById('media-comentarios').textContent =
    mediaEquipe.toFixed(1);

  document.getElementById('lista-usuarios').innerHTML =
    funcionarios
      .map(
        funcionario => `
          <div class="usuario-item">
            <b>${escapar(funcionario.nome)}</b>
            <small>@${escapar(funcionario.usuario)}</small>
          </div>
        `
      )
      .join('') ||
    '<p>Nenhum funcionário cadastrado.</p>';

  const registros = avaliacoesValidas
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
          · Nota ${Number(avaliacao.nota || 0)}/10

          <p>${escapar(avaliacao.comentario)}</p>
        </div>
      `
    )
    .join('');

  document.getElementById('lista-registros').innerHTML =
    registros ||
    '<p>Nenhum registro com comentário.</p>';

  document.getElementById('lista-comentarios').innerHTML =
    avaliacoesValidas
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
              · Nota ${Number(avaliacao.nota || 0)}/10
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

document.getElementById('baixar-dados').onclick = async () => {
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
