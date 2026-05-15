# Spec - Landing publica Bigood orientada a produto

## Objetivo

Recriar somente a landing page publica do Bigood usando a estrutura visual extraida da AbacatePay como referencia de layout, mantendo a identidade visual do Bigood e mostrando o produto sem comunicar preco, teste gratuito ou periodo promocional.

## Decisao de produto atual

A landing publica deve apresentar o Bigood como sistema de gestao para barbearias, com foco em painel do barbeiro, portal do cliente, agenda, caixa, clientes, equipe e planos.

Fluxo publico:

Visitante -> Entende o produto -> Acessar painel -> Login ou cadastro -> Dashboard

O login e o cadastro usam a mesma tela publica em `/login`.

## Escopo

- Rota publica `/`.
- Header publico.
- Hero com CTA de acesso ao painel.
- Secao de recursos.
- Secoes demonstrativas do produto.
- Secao de painel do barbeiro.
- Secao de portal do cliente.
- FAQ em acordeon.
- Footer profissional.

Fora de escopo:

- Implementar backend real de assinatura.
- Alterar dashboard/admin.
- Alterar portal do cliente.
- Comunicar precos, teste gratuito ou periodo promocional na landing.

## Usuarios

- Barbeiro ou dono de barbearia que quer conhecer o sistema.
- Usuario ja cadastrado que quer fazer login.
- Cliente final da barbearia, mostrado na landing apenas como beneficiario do portal.

## Fluxo principal

1. Visitante acessa a landing.
2. Entende que o Bigood tem painel do barbeiro e portal do cliente.
3. Ve recursos de agenda, caixa, clientes, equipe e planos.
4. Clica em `Acessar painel`.
5. Entra ou cria conta em `/login`.
6. Entra no dashboard e recebe o fluxo de boas-vindas.

## Regras de negocio

- A landing deve usar CTA de acesso ao painel/login do barbeiro.
- A landing nao deve comunicar teste gratuito, gratuidade temporaria, periodo promocional ou precos.
- A landing deve contemplar barbearias com clientes assinantes de planos e barbearias que trabalham principalmente com agendamentos avulsos.
- Planos, assinatura e qualquer regra comercial ficam dentro do dashboard.
- Configuracao de conta pessoal, login, senha, conta e plano assinado deve ficar no dashboard.
- O fluxo de cadastro, boas-vindas, tutorial e modal de 30 dias gratuitos esta documentado em `docs/auth-onboarding-flow-spec.md`.

## Dados necessarios

- Conteudo institucional.
- Recursos principais.
- Etapas de uso do produto.
- Metricas demonstrativas de produto.
- FAQ comercial.
- Links para `/login` e ancora das secoes da landing.

## Estados

- Loading: nao aplicavel nesta versao estatica.
- Empty: nao aplicavel nesta versao estatica.
- Error: sem integracao externa neste passo.
- Success: visitante cria conta ou acessa login.

## Futuro contrato de backend

Cadastro publico:

```txt
POST /api/auth/signup
```

Assinatura e conta:

```txt
GET /api/billing/plans
POST /api/billing/subscribe
GET /api/account
PATCH /api/account
```

Validacoes futuras:

- Email unico.
- Senha forte.
- Rate limit.
- Validacao de empresa/barbearia.
- Controle de assinatura por usuario e empresa.
- Autorizacao por `companyId`.
