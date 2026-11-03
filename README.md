# Diário do Trabalhador — TypeScript, MySQL e MVC

Projeto organizado para o VS Code com frontend, backend, banco e rotas separados.

## Estrutura

```text
public/
├── index.html
├── css/style.css
└── js/app.js

src/
├── config/
│   ├── database.json
│   └── database.ts
├── controllers/
│   ├── AuthController.ts
│   ├── AvaliacaoController.ts
│   ├── EmpresaController.ts
│   ├── EventoController.ts
│   └── NotaController.ts
├── middlewares/auth.ts
├── models/
│   ├── ContaModel.ts
│   ├── AvaliacaoModel.ts
│   ├── EventoModel.ts
│   └── NotaModel.ts
├── routes/
│   ├── authRoutes.ts
│   ├── empresaRoutes.ts
│   ├── eventoRoutes.ts
│   └── notaRoutes.ts
├── types/index.ts
└── server.ts

database/schema.sql
```

## Regras implementadas

- Funcionário consulta somente as próprias avaliações.
- Apenas dono e gerente acessam o painel e os comentários da empresa.
- Apenas dono e gerente podem criar ou apagar reuniões.
- O banco recusa uma segunda conta usando o mesmo IP.
- O banco recusa uma segunda avaliação do mesmo usuário no mesmo mês.
- CNPJ separa os grupos de cada empresa.

## Preparar o MySQL

1. Instale o MySQL.
2. Crie as tabelas executando `database/schema.sql` no MySQL Workbench ou no terminal:

```bash
mysql -u root -p < database/schema.sql
```

3. Confira `src/config/database.json` ou use variáveis de ambiente:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=diario_trabalhador
```

## Rodar

```bash
npm install
npm run dev
```

Para gerar a versão compilada:

```bash
npm run build
npm start
```

Abra `http://localhost:3000`.

## Usar no computador onde o MySQL está instalado

Para o site funcionar sem configurar acesso remoto ao banco, rode a API no mesmo computador do seu amigo que já tem o MySQL. Nesse computador:

1. Abra a pasta do projeto no terminal.
2. Confira `src/config/database.json` ou crie `.env` a partir de `.env.example`. Use as credenciais locais do MySQL; normalmente `DB_HOST=localhost` e `DB_PORT=3306`.
3. Se o banco ainda não tiver as tabelas, execute `database/schema.sql` no MySQL Workbench.
4. Rode `npm install` (se ainda não instalou as dependências) e `npm run dev`.
5. Abra `http://localhost:3000` nesse computador.

O servidor escuta a rede local também. Para abrir o site em outro computador conectado à mesma rede, descubra o IPv4 do computador que está rodando a API com `ipconfig` e acesse `http://IP-DO-COMPUTADOR:3000` (por exemplo, `http://192.168.0.25:3000`). Se o Windows Firewall perguntar, permita o Node.js em redes privadas. O computador que hospeda a API precisa permanecer ligado e com o MySQL iniciado.

Se a senha do MySQL não estiver vazia, informe-a em `DB_PASSWORD` no `.env`; não compartilhe esse arquivo. Para restringir a API ao próprio computador, defina `APP_HOST=127.0.0.1` no `.env`.

## Atualização importante: várias contas no mesmo computador

A regra de uma conta por IP foi removida. Agora é possível criar dono, gerente e funcionário no mesmo computador. O usuário continua precisando ser único.

Se a tabela `contas` foi criada com a versão antiga, execute uma vez no DBeaver:

```sql
USE diario_trabalhador;
ALTER TABLE contas DROP INDEX ip_cadastro;
```

O mesmo comando está em `database/atualizar-sem-ip-unico.sql`.

## Créditos das imagens

- `public/img/hero-pessoa.jpg`: foto de [Vitaly Gariev](https://unsplash.com/photos/young-woman-smiling-while-using-her-smartphone-at-desk-5RQnUp_-5OU) / Unsplash
- `public/img/equipe.jpg`: foto de [Vitaly Gariev](https://unsplash.com/photos/diverse-team-collaborates-around-a-table-in-office-fm4B1xWEIsU) / Unsplash
- `public/img/og-capa.jpg` e `public/favicon.png`: feitos para o projeto, com a paleta do site
