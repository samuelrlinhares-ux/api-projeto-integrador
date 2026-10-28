# Guia de imagens: Diário do Trabalhador

Este guia lista as imagens que o site usa, onde cada uma aparece e o estilo que elas devem seguir. O layout já está pronto. Basta salvar os arquivos em `public/img/` com os nomes exatos abaixo.

Se uma imagem não existir, o site mostra um fundo azul-claro no lugar e continua funcionando. Você pode publicar antes de ter todas as fotos.

---

## 1. Lista de imagens

| # | Arquivo | Onde aparece | Proporção | Tamanho ideal | Peso máximo |
|---|---------|--------------|-----------|---------------|-------------|
| 1 | `public/img/hero-pessoa.jpg` | Topo da página inicial, à esquerda do formulário de cadastro (só no computador) | 4:5 (vertical) | 800 × 1000 px | 180 KB |
| 2 | `public/img/equipe.jpg` | Seção "Menos planilha, mais conversa" | 4:3 (horizontal) | 1200 × 900 px | 220 KB |
| 3 | `public/img/og-capa.jpg` *(opcional)* | Prévia quando o link é compartilhado no WhatsApp ou em outras redes | 1,91:1 | 1200 × 630 px | 250 KB |
| 4 | `public/favicon.png` *(opcional)* | Ícone na aba do navegador | 1:1 | 512 × 512 px | 30 KB |

### 1.1 `hero-pessoa.jpg`: foto principal

É a imagem mais importante do site e equivale à foto da moça com o celular na referência (tagembed).

- **O que mostrar:** uma pessoa no ambiente de trabalho, olhando para o celular e sorrindo de leve, como se tivesse acabado de registrar o dia. Pode ser em escritório, loja, oficina ou chão de fábrica.
- **Enquadramento:** da cintura para cima, com a pessoa centralizada ou levemente à direita. **Deixe o terço de baixo mais "limpo"**, porque um cartão branco ("Hoje: Bem · 8/10") fica sobreposto nessa área.
- **Fundo:** parede lisa ou ambiente desfocado, em tons claros e neutros (branco, cinza-azulado ou bege frio).
- **Roupa:** cores sólidas. Um tom de azul, rosa claro ou verde-água conversa bem com a paleta. Evite estampas fortes e logotipos de marcas.
- **Evite:** pose de "banco de imagem" (polegar para cima, apontar para a câmera, terno com fundo branco puro) e várias pessoas na mesma foto.

### 1.2 `equipe.jpg`: equipe conversando

- **O que mostrar:** de 3 a 5 pessoas conversando de forma natural, em volta de uma mesa ou em pé perto de um quadro. Precisa transmitir "a equipe está sendo ouvida".
- **Enquadramento:** horizontal, com as pessoas ocupando o centro e um pouco de respiro nas bordas, porque a foto recebe cantos arredondados.
- **Diversidade:** idades, gêneros e tons de pele variados. O produto é para qualquer tipo de empresa, então funciona bem misturar uniforme de trabalho com roupa casual.
- **Evite:** todo mundo olhando para a câmera, aperto de mãos ensaiado ou notebooks com a tela virada para a câmera.

### 1.3 `og-capa.jpg` (opcional)

- Fundo azul-marinho `#141B2D`, com o logo "DT" e a frase **"Registro diário e clima da equipe"** em branco, à esquerda.
- À direita, um recorte da própria tela do sistema (print da página de Avaliação) com cantos arredondados.
- Para ativar, adicione no `<head>` do `index.html`:
  ```html
  <meta property="og:image" content="/img/og-capa.jpg">
  ```

### 1.4 `favicon.png` (opcional)

- Quadrado azul `#2F62E9` com as letras **DT** em branco e peso extra-negrito, igual ao logo do topo, com cantos arredondados de cerca de 25%.
- Para ativar: `<link rel="icon" href="/favicon.png">` no `<head>`.

---

## 2. Estilo visual das fotos

O objetivo é parecer **gente real trabalhando**, não propaganda. Siga estas regras em todas as fotos para que elas pareçam da mesma família:

| Aspecto | Faça | Evite |
|---------|------|-------|
| **Luz** | Luz natural de janela, suave e clara | Flash direto, luz amarelada de lâmpada, contraluz forte |
| **Cor** | Tons frios e neutros, com um ponto de cor (roupa ou objeto) | Filtros saturados, sépia, preto e branco |
| **Contraste** | Médio, com a pele natural | HDR exagerado, pele "plastificada" |
| **Profundidade** | Fundo levemente desfocado | Fundo poluído com textos ou logotipos |
| **Pessoas** | Expressões naturais, em ação | Olhar fixo para a câmera, sorriso forçado |
| **Contexto** | Celular, caderno, crachá, ferramentas de trabalho | Objetos de luxo, cenários de escritório "perfeitos" demais |

**Ajuste rápido de cor (opcional):** se as fotos vierem de fontes diferentes, aplique o mesmo tratamento em todas (Canva, Lightroom ou Photopea):
- Temperatura: −5 (levemente mais fria)
- Saturação: −10
- Sombras: +10

---

## 3. Paleta de referência

Use estas cores ao escolher fotos ou criar artes, para que tudo combine com o site:

| Nome | Hex | Uso |
|------|-----|-----|
| Tinta (texto) | `#141B2D` | Títulos e faixa do topo |
| Azul de ação | `#2F62E9` | Botões e destaques |
| Azul suave | `#E8EEFD` | Fundo de seleção |
| Verde-água | `#4FD8C0` | Sublinhado do título principal |
| Fundo | `#F3F6FC` | Fundo da página |
| Laranja | `#E08A4D` | Marcador de compromisso no calendário |

---

## 4. Onde conseguir as fotos (gratuitas)

- **Unsplash**: unsplash.com. Pesquise: `worker smiling phone`, `team meeting casual`, `brazilian office`, `factory worker tablet`.
- **Pexels**: pexels.com. Pesquise: `trabalhador celular`, `equipe reunião`.
- **Banco de imagens do Canva**: tem muitas fotos gratuitas com pessoas brasileiras.

Como é um projeto escolar, vale **dar crédito ao fotógrafo** no rodapé ou no README, por exemplo: *"Foto: Nome do fotógrafo / Unsplash"*.

**Alternativa com mais autenticidade:** fotografe colegas ou funcionários reais (com autorização). Siga as regras de luz e enquadramento da seção 2. Celular na vertical, perto de uma janela, já basta.

---

## 5. Antes de salvar: checklist

- [ ] O nome do arquivo está exatamente como na tabela (minúsculas, sem acentos)
- [ ] A foto foi exportada em **JPG com qualidade de 75 a 80%**, ou em WebP (nesse caso, troque a extensão também no `index.html`)
- [ ] O peso está abaixo do limite da tabela (comprima em squoosh.app, se necessário)
- [ ] A foto não tem texto, marca d'água ou logotipo de outra empresa
- [ ] O terço de baixo da `hero-pessoa.jpg` está limpo para o cartão sobreposto
- [ ] Se trocar a foto, atualize o texto alternativo (`alt`) no `index.html` para descrever a nova imagem

---

## 6. O que **não** usar

- Ilustrações 3D genéricas de "bonequinhos" ou personagens de IA
- Ícones dentro de quadradinhos coloridos acima de cada título
- Gradientes roxo-azul de fundo
- Mockups de notebook/celular flutuando em cima de gradiente
- Logotipos de empresas reais como "clientes" (a referência usa isso, mas aqui seria informação falsa)
