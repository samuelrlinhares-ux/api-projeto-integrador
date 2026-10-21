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

## Atualização importante: várias contas no mesmo computador

A regra de uma conta por IP foi removida. Agora é possível criar dono, gerente e funcionário no mesmo computador. O usuário continua precisando ser único.

Se a tabela `contas` foi criada com a versão antiga, execute uma vez no DBeaver:

```sql
USE diario_trabalhador;
ALTER TABLE contas DROP INDEX ip_cadastro;
```

O mesmo comando está em `database/atualizar-sem-ip-unico.sql`.
