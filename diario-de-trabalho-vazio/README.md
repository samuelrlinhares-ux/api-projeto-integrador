# Diário do Trabalhador — versão vazia

Esta pasta contém os arquivos do site com a mesma estrutura visual e as mesmas abas do protótipo original, mas sem notas, eventos, depoimentos ou avaliações demonstrativas.

## Abas incluídas

- Termômetro & Avaliação da Empresa
- Bloco de Notas
- Calendário de Trabalho
- Painel de Resultados & Voz Coletiva

As áreas do formulário permanecem configuradas para que você possa preencher as avaliações de 0 a 10. Notas, compromissos e respostas criadas no navegador são salvos no LocalStorage.

## Como abrir no VS Code

1. Extraia a pasta ou abra diretamente `diario-de-trabalho-vazio` no VS Code.
2. Abra o terminal integrado na raiz do projeto.
3. Execute `pnpm install`.
4. Execute `pnpm dev`.
5. Acesse o endereço mostrado no terminal, normalmente `http://localhost:3000`.

## Estrutura principal

- `client/src/pages/Home.tsx`: página principal e navegação entre abas.
- `client/src/components/NotesSection.tsx`: bloco de notas.
- `client/src/components/CalendarSection.tsx`: calendário e eventos.
- `client/src/components/WorkerFeedbackForm.tsx`: formulário de sentimentos, comentários e notas de 0 a 10.
- `client/src/components/CompanyOverview.tsx`: painel de resultados.
- `client/src/storage.ts`: dados iniciais vazios e persistência local.
- `client/src/types.ts`: tipos usados pela aplicação.

## Observação

Esta versão é um protótipo frontend. Os dados ficam no navegador em que foram cadastrados; ainda não existe banco de dados, login ou sincronização entre usuários.
