# Menor Preço

Aplicativo para comparação de preços de produtos em diferentes estabelecimentos.

## Tecnologias

- React Native / Expo
- TypeScript
- Supabase (Banco de dados PostgreSQL)

## Configuração

### Pré-requisitos

- Node.js
- npm ou yarn
- Expo CLI

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados Supabase:
   - Veja as instruções em `supabase/README.md`

### Execução

```bash
npm start
```

## Estrutura do Projeto

- `src/app/`: Rotas e telas da aplicação
- `src/lib/`: Lógica de negócios e utilitários
  - `contexts/`: Contextos React
  - `database/`: Configuração e acesso ao banco de dados Supabase
  - `types/`: Tipos TypeScript

## Banco de Dados

A aplicação utiliza o Supabase como backend para persistência de dados. As principais entidades são:

1. **Categorias** (`categories`): Categorias de produtos
2. **Produtos** (`products`): Produtos que podem ser comparados
3. **Apresentações de Produtos** (`product_presentations`): Registros de preços de produtos em diferentes estabelecimentos

## Desenvolvimento

### Principais arquivos

- `src/lib/database/supabase.ts`: Configuração e funções de acesso ao Supabase
- `src/lib/contexts/DatabaseContext.tsx`: Contexto para acesso ao banco de dados
- `supabase/schema.sql`: Esquema do banco de dados

### Sincronização

Os dados são armazenados remotamente no servidor Supabase, permitindo acesso de múltiplos dispositivos aos mesmos dados. 