Você é um engenheiro de software sênior especialista em Next.js, TypeScript, shadcn/ui, Tailwind, arquitetura frontend, SaaS multi-tenant e Spec Driven Development.

Quero que você faça um MAPEAMENTO COMPLETO do projeto Bigood.

Contexto do projeto:
O Bigood é um SaaS para barbearias gerenciarem agenda, clientes, planos de assinatura, serviços, profissionais, comandas, caixa e financeiro. O projeto atualmente possui somente frontend, feito em Next.js com TypeScript, Tailwind e shadcn/ui. Já existem três áreas principais:
1. Landing page pública
2. Dashboard do barbeiro
3. Portal do cliente para agendar serviços e assinar planos da barbearia

Importante:
- NÃO altere nenhum arquivo.
- NÃO refatore nada.
- NÃO modifique CSS, layout, cores, fontes, componentes ou responsividade.
- NÃO crie arquivos novos ainda.
- Apenas leia, analise e documente.
- O objetivo é gerar um relatório técnico para que outro engenheiro/IA entenda profundamente o projeto antes de aplicar Spec Driven Development.

Sua tarefa:
Analise todo o projeto e gere um relatório completo em Markdown contendo:

# 1. Visão geral do projeto
Explique o que o sistema parece fazer com base no código existente.

# 2. Stack utilizada
Liste frameworks, bibliotecas, padrões e ferramentas encontradas:
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- bibliotecas de ícones
- bibliotecas de formulário
- validação
- autenticação, se existir
- mocks
- qualquer dependência relevante

# 3. Estrutura de pastas
Mapeie a estrutura principal do projeto.
Explique para que serve cada pasta importante.

# 4. Rotas e páginas existentes
Liste todas as rotas encontradas no projeto.
Para cada rota, informe:
- caminho da rota
- arquivo correspondente
- objetivo da tela
- tipo de usuário que acessa: público, barbeiro, cliente ou admin
- se parece depender de backend futuramente
- dados necessários para funcionar de verdade

# 5. Componentes principais
Liste os principais componentes encontrados.
Para cada componente, informe:
- caminho do arquivo
- onde é usado
- função do componente
- se é apenas visual ou se possui lógica
- se recebe props
- se usa dados mockados

# 6. Dados mockados
Identifique todos os dados mockados/hardcoded encontrados.
Para cada mock, informe:
- arquivo onde está
- tipo de dado representado
- exemplo de entidade: cliente, agendamento, plano, serviço, profissional, pagamento etc.
- se deveria futuramente vir do backend
- sugestão de service/API correspondente

# 7. Fluxos de usuário existentes
Mapeie os principais fluxos já presentes no frontend:
- visitante acessando landing page
- barbeiro criando conta ou entrando
- barbeiro acessando dashboard
- cliente acessando portal da barbearia
- cliente escolhendo serviço
- cliente escolhendo data e horário
- cliente vendo agendamentos
- cliente vendo/assinando planos
- barbeiro gerenciando clientes, agenda, serviços, profissionais, planos, caixa ou financeiro

Para cada fluxo, informe:
- telas envolvidas
- estado atual no frontend
- o que falta para backend
- regras de negócio aparentes

# 8. Entidades de domínio identificadas
Liste todas as entidades que o sistema parece usar ou precisar.
Exemplos:
- User
- Company
- Barbershop
- Unit
- Customer
- Professional
- Service
- Plan
- Subscription
- Appointment
- Payment
- Command
- Transaction
- Role
- Permission

Para cada entidade, informe:
- campos encontrados no frontend, se existirem
- campos recomendados para backend
- relação com outras entidades

# 9. Regras de negócio aparentes
Com base no código e nas telas, identifique possíveis regras de negócio.
Exemplo:
- cliente só pode agendar horário disponível
- plano anual tem benefícios diferentes do mensal
- barbearia pode ter até 3 unidades no plano Pro
- cliente com plano ativo pode usar serviços inclusos
- barbeiro precisa ter assinatura ativa para acessar dashboard

Separe entre:
- regras já visíveis no frontend
- regras que precisam ser confirmadas
- regras que obrigatoriamente devem ser validadas no backend

# 10. Pontos críticos de segurança
Identifique riscos e pontos que precisam de atenção:
- autenticação
- autorização
- multiempresa/multitenancy
- companyId
- unitId
- proteção de rotas
- acesso de cliente a dados de outro cliente
- acesso de barbeiro a dados de outra barbearia
- manipulação de plano, preço ou pagamento pelo frontend
- validação apenas no frontend

# 11. Preparação para backend
Liste todos os endpoints que provavelmente serão necessários.
Organize por módulo:
- Auth
- Empresas/Barbearias
- Unidades
- Clientes
- Profissionais
- Serviços
- Agenda
- Agendamentos
- Planos
- Assinaturas
- Pagamentos
- Caixa/Comandas
- Financeiro
- Configurações

Para cada endpoint sugerido, informe:
- método HTTP
- rota sugerida
- objetivo
- dados de entrada
- dados de saída
- permissões necessárias

# 12. Problemas de arquitetura encontrados
Identifique problemas como:
- dados mockados dentro de páginas
- componentes muito grandes
- regra de negócio misturada com JSX
- falta de types
- falta de schemas
- falta de services
- repetição de código
- nomes inconsistentes
- dependência forte entre tela e mock
- ausência de estados loading/error/empty
- ausência de contratos de API

# 13. Oportunidades de refatoração sem alterar o visual
Sugira melhorias estruturais sem modificar a aparência:
- extrair mocks para pasta /mocks
- criar /types
- criar /schemas
- criar /services
- criar /features
- criar /docs/specs
- criar /docs/contracts
- separar componentes visuais de lógica
- preparar services mockados para troca futura por API real

# 14. Sugestão de arquitetura ideal
Proponha uma estrutura de pastas ideal para este projeto mantendo o design atual.

# 15. Ordem recomendada de refatoração
Crie uma sequência segura de refatoração, por etapas:
1. documentação
2. types
3. schemas
4. mocks
5. services
6. contratos de API
7. refatoração por módulo
8. preparação para backend

# 16. Resumo executivo para outro engenheiro
No final, gere um resumo objetivo explicando:
- estado atual do projeto
- nível de maturidade
- principais riscos
- próximos passos
- o que deve ser feito antes de iniciar o backend

Formato da resposta:
- Gere tudo em Markdown.
- Use títulos claros.
- Seja técnico, direto e específico.
- Sempre cite os caminhos dos arquivos analisados.
- Quando não tiver certeza, marque como "precisa confirmar".
- Não invente funcionalidades que não aparecem no código.
- Não altere nenhum arquivo.