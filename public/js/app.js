let token = sessionStorage.getItem('token');
let usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioAtual'));
let notas = [], eventos = [], avaliacoes = [];
let mesCalendario = new Date().getMonth(), anoCalendario = new Date().getFullYear(), dataEscolhida = new Date().toISOString().slice(0, 10);

async function api(url, opcoes = {}) {
  const resposta = await fetch(url, { ...opcoes, headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' } });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível concluir a operação.');
  return dados;
}
function avisar(texto, tipo = 'ok') { const toast = document.getElementById('toast'); toast.textContent = texto; toast.className = tipo === 'erro' ? 'toast erro-toast' : 'toast'; toast.hidden = false; clearTimeout(avisar.tempo); avisar.tempo = setTimeout(() => { toast.hidden = true; }, 3500); }
function formatarData(data) { return String(data || '').slice(0, 10).split('-').reverse().join('/'); }
function mostrarErro(id, erro) { document.getElementById(id).textContent = erro.message; }
function formatarCnpj(cnpj) { const n = String(cnpj || '').replace(/\D/g, ''); return n.length === 14 ? `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}/${n.slice(8,12)}-${n.slice(12)}` : n; }
function escapar(texto) { return String(texto || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c])); }

const abaCadastro = document.getElementById('aba-cadastro'), abaLogin = document.getElementById('aba-login');
abaCadastro.onclick = () => { abaCadastro.classList.add('ativo'); abaLogin.classList.remove('ativo'); document.getElementById('form-cadastro').classList.remove('escondido'); document.getElementById('form-login').classList.add('escondido'); document.getElementById('texto-acesso').textContent = 'Crie sua conta para começar.'; };
abaLogin.onclick = () => { abaLogin.classList.add('ativo'); abaCadastro.classList.remove('ativo'); document.getElementById('form-login').classList.remove('escondido'); document.getElementById('form-cadastro').classList.add('escondido'); document.getElementById('texto-acesso').textContent = 'Entre com os dados da sua conta.'; };

document.querySelectorAll('[data-ir]').forEach(botao => botao.onclick = () => { (botao.dataset.ir === 'login' ? abaLogin : abaCadastro).click(); const caixa = document.getElementById('caixa-acesso'); caixa.scrollIntoView({ behavior: 'smooth', block: 'center' }); caixa.classList.remove('destaque-pulso'); void caixa.offsetWidth; caixa.classList.add('destaque-pulso'); setTimeout(() => document.querySelector(botao.dataset.ir === 'login' ? '#usuario' : '#cad-nome').focus({ preventScroll: true }), 350); });
document.getElementById('fechar-anuncio').onclick = () => document.getElementById('faixa-anuncio').remove();

document.getElementById('form-cadastro').onsubmit = async e => { e.preventDefault(); try { await api('/api/cadastro', { method:'POST', body: JSON.stringify({ nome: document.getElementById('cad-nome').value, usuario: document.getElementById('cad-usuario').value, senha: document.getElementById('cad-senha').value, cnpj: document.getElementById('cad-cnpj').value, tipo: document.getElementById('cad-tipo').value }) }); document.getElementById('erro-cadastro').className = 'mensagem'; document.getElementById('erro-cadastro').textContent = 'Conta criada. Agora entre no sistema.'; document.getElementById('usuario').value = document.getElementById('cad-usuario').value; abaLogin.click(); } catch (erro) { document.getElementById('erro-cadastro').className = 'erro'; mostrarErro('erro-cadastro', erro); } };
document.getElementById('form-login').onsubmit = async e => { e.preventDefault(); try { const dados = await api('/api/login', { method:'POST', body: JSON.stringify({ usuario: document.getElementById('usuario').value, senha: document.getElementById('senha').value }) }); token = dados.token; usuarioAtual = dados.usuario; sessionStorage.setItem('token', token); sessionStorage.setItem('usuarioAtual', JSON.stringify(usuarioAtual)); abrirSite(); } catch (erro) { mostrarErro('erro-login', erro); } };

async function abrirSite() { document.getElementById('tela-acesso').style.display='none'; document.getElementById('site').style.display='block'; const tipo = usuarioAtual.tipo === 'dono' ? 'Dono' : usuarioAtual.tipo === 'gerente' ? 'Gerente' : 'Funcionário'; document.getElementById('nome-usuario').textContent = `${usuarioAtual.nome} (${tipo}) · CNPJ ${formatarCnpj(usuarioAtual.cnpj)}`; document.querySelectorAll('.gestor-only').forEach(el => el.style.display = ['dono','gerente'].includes(usuarioAtual.tipo) ? '' : 'none'); await carregarDados(); }
async function carregarDados() { try { [notas, eventos, avaliacoes] = await Promise.all([api('/api/notas'), api('/api/eventos'), api('/api/resultados')]); mostrarNotas(); mostrarEventos(); atualizarResultados(); renderizarCalendario(); if (['dono','gerente'].includes(usuarioAtual.tipo)) mostrarPainel(); } catch (erro) { avisar(erro.message, 'erro'); } }
if (token && usuarioAtual) abrirSite();

document.getElementById('sair').onclick = async () => { try { await api('/api/logout', { method:'POST' }); } finally { sessionStorage.clear(); location.reload(); } };
document.querySelectorAll('.menu').forEach(menu => menu.onclick = () => { document.querySelectorAll('.menu').forEach(m => m.classList.remove('ativo')); document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa')); menu.classList.add('ativo'); document.getElementById(menu.dataset.pagina).classList.add('ativa'); if (menu.dataset.pagina === 'painel') mostrarPainel(); });

document.getElementById('nota').oninput = e => document.getElementById('valor-nota').textContent = e.target.value;
document.getElementById('form-avaliacao').onsubmit = async e => { e.preventDefault(); try { await api('/api/avaliacoes', { method:'POST', body: JSON.stringify({ humor:document.querySelector('input[name="humor"]:checked').value, nota:Number(document.getElementById('nota').value), comentario:document.getElementById('comentario').value, anonimo:document.getElementById('anonimo').checked }) }); e.target.reset(); document.getElementById('nota').value=7; document.getElementById('valor-nota').textContent='7'; document.getElementById('mensagem-avaliacao').textContent='Avaliação salva com sucesso.'; avisar('Avaliação salva.'); await carregarDados(); } catch (erro) { avisar(erro.message, 'erro'); } };
document.getElementById('form-nota').onsubmit = async e => { e.preventDefault(); try { await api('/api/notas', { method:'POST', body: JSON.stringify({ titulo:document.getElementById('titulo-nota').value, texto:document.getElementById('texto-nota').value }) }); e.target.reset(); avisar('Nota adicionada.'); await carregarDados(); } catch (erro) { avisar(erro.message, 'erro'); } };
document.getElementById('form-evento').onsubmit = async e => { e.preventDefault(); try { await api('/api/eventos', { method:'POST', body: JSON.stringify({ titulo:document.getElementById('evento-titulo').value, data:document.getElementById('evento-data').value }) }); dataEscolhida=document.getElementById('evento-data').value; e.target.reset(); document.getElementById('evento-data').value=dataEscolhida; avisar('Compromisso agendado.'); await carregarDados(); } catch (erro) { avisar(erro.message, 'erro'); } };

function mostrarNotas() { const lista=document.getElementById('lista-notas'); lista.innerHTML=notas.map(n => `<article class="item"><h3>${escapar(n.titulo)}</h3><small>${formatarData(n.data)}</small><p>${escapar(n.texto)}</p><div class="item-rodape"><button type="button" onclick="apagarNota(${n.id})">Apagar</button></div></article>`).join('') || '<p class="vazio">Nenhuma nota ainda. A primeira aparece aqui.</p>'; }
async function apagarNota(id) { try { await api(`/api/notas/${id}`, { method:'DELETE' }); avisar('Nota apagada.'); await carregarDados(); } catch (erro) { avisar(erro.message, 'erro'); } }
function mostrarEventos() { const lista=document.getElementById('lista-eventos'); const doDia=eventos.filter(e => e.data===dataEscolhida); const podeGerenciar=['dono','gerente'].includes(usuarioAtual.tipo); lista.innerHTML=doDia.map(ev => `<article class="item"><h3>${escapar(ev.titulo)}</h3><small>${formatarData(ev.data)}</small>${podeGerenciar ? `<div class="item-rodape"><button type="button" onclick="apagarEvento(${ev.id})">Apagar</button></div>` : ''}</article>`).join('') || '<p class="vazio">Nada agendado neste dia.</p>'; const dia=document.getElementById('dia-escolhido'); if(dia) dia.textContent=`Compromissos em ${formatarData(dataEscolhida)}: ${doDia.length}`; }
async function apagarEvento(id) { try { await api(`/api/eventos/${id}`, { method:'DELETE' }); avisar('Compromisso apagado.'); await carregarDados(); } catch (erro) { avisar(erro.message, 'erro'); } }
function atualizarResultados() { const comComentarios=avaliacoes.filter(a => a.comentario && a.comentario.trim()); document.getElementById('total-avaliacoes').textContent=avaliacoes.length; document.getElementById('total-comentarios').textContent=comComentarios.length; document.getElementById('total-registros').textContent=notas.length+eventos.length; document.getElementById('contador-notas').textContent=notas.length; document.getElementById('contador-eventos').textContent=eventos.length; const media=avaliacoes.length?avaliacoes.reduce((s,a)=>s+a.nota,0)/avaliacoes.length:0; document.getElementById('media-avaliacoes').textContent=media.toFixed(1); }

async function mostrarPainel() { if(!['dono','gerente'].includes(usuarioAtual.tipo)) return; const dados=await api('/api/empresa'); const comentarios=dados.avaliacoes.filter(a=>a.comentario && a.comentario.trim()); document.getElementById('total-usuarios').textContent=dados.funcionarios.length; document.getElementById('total-equipe').textContent=dados.avaliacoes.length; document.getElementById('total-comentarios-equipe').textContent=comentarios.length; const media=dados.avaliacoes.length?dados.avaliacoes.reduce((s,a)=>s+a.nota,0)/dados.avaliacoes.length:0; document.getElementById('media-equipe').textContent=media.toFixed(1); document.getElementById('media-comentarios').textContent=media.toFixed(1); document.getElementById('lista-usuarios').innerHTML=dados.funcionarios.map(u=>`<div class="usuario-item"><b>${escapar(u.nome)}</b><small>@${escapar(u.usuario)}</small></div>`).join('') || '<p>Nenhum funcionário cadastrado.</p>'; const registros=dados.avaliacoes.map(a=>`<div class="registro-resumo"><strong>${a.anonimo?'Registro anônimo':escapar(a.nome)}</strong> · ${formatarData(a.data)}<p>${escapar(a.comentario||'Sem comentário.')}</p></div>`).join('') || '<p>Nenhuma avaliação recebida.</p>'; document.getElementById('lista-registros').innerHTML=registros; document.getElementById('lista-comentarios').innerHTML=comentarios.map(a=>`<article class="comentario-item"><strong>${a.anonimo?'Comentário anônimo':escapar(a.nome)}</strong> <small>· ${formatarData(a.data)} · Nota ${a.nota}/10</small><p>${escapar(a.comentario)}</p></article>`).join('') || '<p class="vazio">Nenhum comentário enviado.</p>'; }

function renderizarCalendario() {
  const grade = document.getElementById('grade-calendario');
  if (!grade) return;
  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('mes-atual').textContent = meses[mesCalendario];
  document.getElementById('ano-atual').textContent = anoCalendario;
  const primeiroDia = new Date(anoCalendario, mesCalendario, 1).getDay();
  const diasNoMes = new Date(anoCalendario, mesCalendario + 1, 0).getDate();
  const hoje = new Date().toISOString().slice(0, 10);
  grade.innerHTML = '<span class="dia-vazio"></span>'.repeat(primeiroDia);
  for (let numero = 1; numero <= diasNoMes; numero += 1) {
    const data = `${anoCalendario}-${String(mesCalendario + 1).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;
    const classes = ['dia-calendario'];
    if (data === dataEscolhida) classes.push('selecionado');
    if (data === hoje) classes.push('hoje');
    const temEvento = eventos.some(evento => evento.data === data);
    grade.insertAdjacentHTML('beforeend', `<button type="button" class="${classes.join(' ')}" data-data="${data}" aria-label="${numero}${temEvento ? ', com compromisso' : ''}">${numero}${temEvento ? '<i class="ponto-evento"></i>' : ''}</button>`);
  }
  grade.querySelectorAll('.dia-calendario').forEach(botao => botao.onclick = () => {
    dataEscolhida = botao.dataset.data;
    document.getElementById('evento-data').value = dataEscolhida;
    renderizarCalendario();
    mostrarEventos();
  });
}
document.getElementById('mes-anterior').onclick=()=>{mesCalendario--;if(mesCalendario<0){mesCalendario=11;anoCalendario--;}renderizarCalendario();}; document.getElementById('mes-proximo').onclick=()=>{mesCalendario++;if(mesCalendario>11){mesCalendario=0;anoCalendario++;}renderizarCalendario();};

document.getElementById('baixar-dados').onclick = async () => {
  const dados = ['dono', 'gerente'].includes(usuarioAtual.tipo) ? await api('/api/empresa') : null;
  if (!dados) return;
  const arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = 'relatorio-da-empresa.json';
  link.click();
};
