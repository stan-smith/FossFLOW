# FossFLOW - Ferramenta de Diagramas Isométricos <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a> | <a href="README.es.md">Español</a> | <a href="README.pt.md">Português</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.bn.md">বাংলা</a> | <a href="README.ru.md">Русский</a>
</p>

<b>Olá!</b> Aqui é o Stan, se você usou o FossFLOW e ele te ajudou, <b>eu realmente agradeceria se você pudesse doar algo pequeno :)</b> Eu trabalho em tempo integral, e encontrar tempo para trabalhar neste projeto já é desafiador o suficiente.
Se eu implementei um recurso para você ou corrigi um bug, seria ótimo se você pudesse :) se não, não há problema, este software sempre será gratuito!


<b>Também!</b> Se você ainda não o fez, por favor confira a biblioteca subjacente na qual isso é construído por <a href="https://github.com/markmanx/isoflow">@markmanx</a> Eu realmente estou sobre os ombros de um gigante aqui 🫡

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>


Obrigado,

-Stan

## Experimente online

Vá para  <b> --> https://stan-smith.github.io/FossFLOW/ <-- </b>


------------------------------------------------------------------------------------------------------------------------------
FossFLOW é um poderoso Progressive Web App (PWA) de código aberto para criar belos diagramas isométricos. Construído com React e a biblioteca <a href="https://github.com/markmanx/isoflow">Isoflow</a> (Agora bifurcada e publicada no NPM como fossflow), ele roda inteiramente no seu navegador com suporte offline.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/FOSSFLOW_TODO.md)** - Problemas atuais e roteiro com mapeamentos de código base, a maioria das reclamações são com a própria biblioteca isoflow.
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - Como contribuir para o projeto.

## Atualizações Recentes (Outubro 2025)

### Suporte Multilíngue
- **8 Idiomas Suportados** - Tradução completa da interface em inglês, chinês (simplificado), espanhol, português (brasileiro), francês, hindi, bengali e russo
- **Seletor de Idioma** - Seletor de idioma fácil de usar no cabeçalho do aplicativo
- **Tradução Completa** - Todos os menus, diálogos, configurações, dicas de ferramentas e conteúdo de ajuda traduzidos
- **Consciente de Localidade** - Detecta e lembra automaticamente sua preferência de idioma

### Ferramenta de Conector Aprimorada
- **Criação Baseada em Cliques** - Novo modo padrão: clique no primeiro nó, depois no segundo nó para conectar
- **Opção de Modo de Arrastar** - O arrastar e soltar original ainda está disponível através das configurações
- **Seleção de Modo** - Alterne entre os modos de clique e arrastar em Configurações → aba Conectores
- **Melhor Confiabilidade** - O modo de clique fornece criação de conexão mais previsível

### Importação de Ícones Personalizados
- **Importe Seus Próprios Ícones** - Carregue ícones personalizados (PNG, JPG, SVG) para usar em seus diagramas
- **Dimensionamento Automático** - Os ícones são dimensionados automaticamente para tamanhos consistentes para aparência profissional
- **Alternar Isométrico/Plano** - Escolha se os ícones importados aparecem como 3D isométrico ou 2D plano
- **Persistência Inteligente** - Ícones personalizados são salvos com diagramas e funcionam em todos os métodos de armazenamento
- **Recursos de Ícones** - Encontre ícones gratuitos em:
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - Milhares de ícones SVG gratuitos
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - Pacotes de ícones isométricos de alta qualidade

### Suporte de Armazenamento no Servidor
- **Armazenamento Persistente** - Diagramas salvos no sistema de arquivos do servidor, persistem entre sessões do navegador
- **Acesso Multi-dispositivo** - Acesse seus diagramas de qualquer dispositivo ao usar implantação Docker
- **Detecção Automática** - A interface do usuário mostra automaticamente o armazenamento do servidor quando disponível
- **Proteção contra Sobrescrita** - Diálogo de confirmação ao salvar com nomes duplicados
- **Integração Docker** - Armazenamento no servidor habilitado por padrão em implantações Docker

### Recursos de Interação Aprimorados
- **Teclas de Atalho Configuráveis** - Três perfis (QWERTY, SMNRCT, Nenhum) para seleção de ferramentas com indicadores visuais
- **Controles de Panorâmica Avançados** - Múltiplos métodos de panorâmica incluindo arrastar área vazia, clique do meio/direito, teclas modificadoras (Ctrl/Alt) e navegação por teclado (Setas/WASD/IJKL)
- **Alternar Setas do Conector** - Opção para mostrar/ocultar setas em conectores individuais
- **Seleção de Ferramenta Persistente** - A ferramenta de conector permanece ativa após criar conexões
- **Diálogo de Configurações** - Configuração centralizada para teclas de atalho e controles de panorâmica

### Melhorias de Docker e CI/CD
- **Builds Docker Automatizadas** - Fluxo de trabalho do GitHub Actions para implantação automática do Docker Hub em commits
- **Suporte Multi-arquitetura** - Imagens Docker para `linux/amd64` e `linux/arm64`
- **Imagens Pré-construídas** - Disponíveis em `stnsmith/fossflow:latest`

### Arquitetura Monorepo
- **Repositório único** para biblioteca e aplicação
- **NPM Workspaces** para gerenciamento de dependências simplificado
- **Processo de build unificado** com `npm run build` na raiz

### Correções de Interface
- Corrigido problema de exibição de ícones da barra de ferramentas do editor Quill
- Resolvidos avisos de chave React em menus de contexto
- Melhorado estilo do editor de markdown

## Características

- 🎨 **Diagramação Isométrica** - Crie impressionantes diagramas técnicos em estilo 3D
- 💾 **Salvamento Automático** - Seu trabalho é salvo automaticamente a cada 5 segundos
- 📱 **Suporte PWA** - Instale como um aplicativo nativo no Mac e Linux
- 🔒 **Privacidade em Primeiro Lugar** - Todos os dados armazenados localmente no seu navegador
- 📤 **Importar/Exportar** - Compartilhe diagramas como arquivos JSON
- 🎯 **Armazenamento de Sessão** - Salvamento rápido sem diálogos
- 🌐 **Suporte Offline** - Trabalhe sem conexão à internet
- 🗄️ **Armazenamento no Servidor** - Armazenamento persistente opcional ao usar Docker (habilitado por padrão)
- 🌍 **Multilíngue** - Suporte completo para 8 idiomas: English, 简体中文, Español, Português, Français, हिन्दी, বাংলা, Русский


## 🐳 Implantação Rápida com Docker

```bash
# Usando Docker Compose (recomendado - inclui armazenamento persistente)
docker compose up

# Ou execute diretamente do Docker Hub com armazenamento persistente
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

O armazenamento no servidor está habilitado por padrão no Docker. Seus diagramas serão salvos em `./diagrams` no host.

Para desabilitar o armazenamento no servidor, defina `ENABLE_SERVER_STORAGE=false`:
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
```

## Início Rápido (Desenvolvimento Local)

```bash
# Clonar o repositório
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# Instalar dependências
npm install

# Compilar a biblioteca (necessário na primeira vez)
npm run build:lib

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Monorepo

Este é um monorepo contendo dois pacotes:

- `packages/fossflow-lib` - Biblioteca de componentes React para desenhar diagramas de rede (construída com Webpack)
- `packages/fossflow-app` - Progressive Web App para criar diagramas isométricos (construído com RSBuild)

### Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Iniciar servidor de desenvolvimento do aplicativo
npm run dev:lib      # Modo watch para desenvolvimento da biblioteca

# Build
npm run build        # Compilar biblioteca e aplicativo
npm run build:lib    # Compilar apenas biblioteca
npm run build:app    # Compilar apenas aplicativo

# Testes e Linting
npm test             # Executar testes unitários
npm run lint         # Verificar erros de linting

# Testes E2E (Selenium)
cd e2e-tests
./run-tests.sh       # Executar testes end-to-end (requer Docker e Python)

# Publicação
npm run publish:lib  # Publicar biblioteca no npm
```

## Como Usar

### Criar Diagramas

1. **Adicionar Itens**:
   - Pressione o botão "+" no menu superior direito, a biblioteca de componentes aparecerá à esquerda
   - Arraste e solte componentes da biblioteca na tela
   - Ou clique com o botão direito na grade e selecione "Adicionar nó"

2. **Conectar Itens**:
   - Selecione a ferramenta Conector (pressione 'C' ou clique no ícone do conector)
   - **Modo de clique** (padrão): Clique no primeiro nó, depois clique no segundo nó
   - **Modo de arrastar** (opcional): Clique e arraste do primeiro nó para o segundo
   - Alterne os modos em Configurações → aba Conectores

3. **Salvar Seu Trabalho**:
   - **Salvamento Rápido** - Salva na sessão do navegador
   - **Exportar** - Baixar como arquivo JSON
   - **Importar** - Carregar de arquivo JSON

### Opções de Armazenamento

- **Armazenamento de Sessão**: Salvamentos temporários apagados quando o navegador fecha
- **Exportar/Importar**: Armazenamento permanente como arquivos JSON
- **Salvamento Automático**: Salva automaticamente as alterações a cada 5 segundos na sessão

## Contribuindo

Damos as boas-vindas a contribuições! Por favor veja [CONTRIBUTORS.md](../CONTRIBUTORS.md) para diretrizes.

## Documentação

- [FOSSFLOW_ENCYCLOPEDIA.md](../FOSSFLOW_ENCYCLOPEDIA.md) - Guia abrangente para a base de código
- [FOSSFLOW_TODO.md](../FOSSFLOW_TODO.md) - Problemas atuais e roteiro
- [CONTRIBUTORS.md](../CONTRIBUTORS.md) - Diretrizes de contribuição

## Licença

MIT
