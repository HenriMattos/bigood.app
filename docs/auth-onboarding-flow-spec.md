# Bigood Auth e Onboarding - Spec Atualizada

## Objetivo

Definir o novo fluxo de entrada do barbeiro no Bigood. O produto agora permite criar conta pelo site e acessar o dashboard antes da assinatura paga.

## Fluxo Principal

1. O barbeiro acessa a landing page publica.
2. A landing apresenta o produto e direciona para `Acessar painel`.
3. Na tela de login, o barbeiro pode entrar com uma conta existente ou criar uma nova conta.
4. Ao criar conta, o usuario e redirecionado diretamente para `/dashboard`.
5. No primeiro acesso, o dashboard exibe uma boas-vindas com passo a passo de configuracao.
6. Apos o tutorial inicial, aparece um modal informando 30 dias gratuitos.
7. O modal oferece duas acoes:
   - `Seguir com o teste`: fecha o modal e mantem o usuario no dashboard.
   - `Assinar um plano`: leva para `/escolher-plano`.

## Regras de Produto

- A landing page nao deve comunicar preco, teste gratuito ou periodo promocional.
- O teste gratuito deve ser comunicado apenas dentro do dashboard, depois da boas-vindas.
- A criacao de conta deve pedir no minimo nome, e-mail e senha.
- O nome da barbearia pode ser coletado no cadastro e usado como `companyName`.
- Dados de login, senha, plano e assinatura ficam na area de conta/configuracoes do dashboard.
- Usuarios recem-cadastrados podem acessar o painel sem plano ativo durante o periodo inicial.
- Planos continuam disponiveis para assinatura dentro do dashboard.

## Estados de Interface

- `login`: formulario de acesso ao painel.
- `register`: formulario de criacao de conta gratuita.
- `welcome`: modal de boas-vindas com tutorial inicial.
- `trial`: modal de 30 dias gratuitos com acoes de teste ou assinatura.
- `subscribed`: estado futuro para conta com plano ativo.

## Persistencia Atual no Prototipo

- Autenticacao mockada por cookie HTTP-only criado nas rotas `/api/auth/login` e `/api/auth/signup`.
- Contas criadas em runtime no `lib/auth-store.ts`.
- Estado de boas-vindas e modal de teste salvo em `localStorage`, separado por e-mail do usuario.

## Observacoes para Backend Real

- Persistir usuario, empresa e status do periodo inicial no banco.
- Registrar `trialStartedAt`, `trialEndsAt` e status de assinatura.
- Evitar depender de `localStorage` para regras comerciais; ele deve controlar apenas exibicao de UI.
- Bloqueios ou avisos apos o periodo inicial devem ser validados no servidor.
