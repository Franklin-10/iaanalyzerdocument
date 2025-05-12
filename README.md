# 📄 Analisador de Documentos com React & Azure AI

Um aplicativo web construído em **React** que permite enviar PDFs ou imagens para extrair texto, tabelas e layout usando a API **Document Intelligence** do Azure. Ideal para demonstrar como integrar front-end moderno a serviços cognitivos na nuvem.

---

## 🚀 Tecnologias e Ferramentas

- **React** (v18) com **Vite**  
  - **JSX** + **Hooks** (`useState`, `useEffect`) para gerenciar estado de upload, loading e resultado  
- **Azure Document Intelligence** (Modelo **prebuilt-layout**)  
  - Chamada HTTP REST via `fetch` encapsulada em `src/Api.jsx`  
  - Tratamento de polling para operações assíncronas  
- **CSS** (App.css) para estilo responsivo e limpo  
- **Node.js** & **npm** para gerenciamento de dependências  
  

---

## 📝 Visão Geral

Este projeto demonstra:

1. **Upload de arquivos** (PDF/JPG/PNG) no navegador  
2. **Leitura em Base64** usando `FileReader`  
3. **Envio** dos dados para o endpoint Azure Document Intelligence  
4. **Polling** até o processamento completar  
5. **Renderização** do JSON de resposta — texto, estilos e coordenadas de layout  

O fluxo garante feedback ao usuário (spinner, mensagens de erro) e retorna resultados em tempo real.

---

## ⚙️ Pré-requisitos

- Conta no Azure com recurso **Document Intelligence** habilitado  
- Node.js ≥ 16.x e npm instalado  

---

## 🔧 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto

# 2. Variáveis de ambiente
cp .env.example .env
# Abra .env e defina:
# VITE_AZ_ENDPOINT=https://<seu-endpoint>.cognitiveservices.azure.com/
# VITE_AZ_KEY=<sua-chave-de-api>

# 3. Instale dependências e inicie
npm install
npm run dev

# 4. Acesse no navegador
http://localhost:{port}
