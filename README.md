# RTiler2D - Redimensionador de Tilesets para RPG Maker MZ

RTiler2D é uma ferramenta web projetada para ajudar usuários do RPG Maker MZ a redimensionar seus tilesets mantendo as proporções corretas dos tiles. Esta ferramenta é especialmente útil quando você precisa converter tilesets de diferentes tamanhos para atender aos requisitos do RPG Maker MZ.

## Funcionalidades

- **Interface de Arrastar e Soltar**: Facilita o upload de múltiplos arquivos PNG
- **Processamento em Lote**: Converte vários tilesets de uma vez
- **Controle Individual**: Redimensiona cada tileset individualmente se necessário
- **Download Inteligente**: Cria automaticamente um arquivo ZIP para mais de 5 imagens
- **Design Responsivo**: Funciona tanto em dispositivos desktop quanto móveis
- **Feedback Visual**: Prévia das imagens carregadas e suas dimensões

## Como Usar

1. **Carregar Tilesets**:
   - Arraste e solte arquivos PNG na área de upload, ou
   - Clique na área de upload para selecionar os arquivos

2. **Definir Dimensões**:
   - Tamanho Original do Tile: Insira as dimensões atuais dos seus tiles
   - Novo Tamanho do Tile: Insira as dimensões desejadas para os tiles redimensionados

3. **Converter**:
   - Clique em "Converter" para redimensionar todos os tilesets de uma vez, ou
   - Use o botão "Redimensionar" em tilesets individuais

4. **Download**:
   - Para 1-5 arquivos: Baixe individualmente ou use "Baixar Todos"
   - Para mais de 5 arquivos: Cria automaticamente um arquivo ZIP

## Detalhes Técnicos

### Tecnologias Utilizadas

- **HTML5**: Para estrutura e entrada de arquivos
- **CSS3**: Para estilização e design responsivo
- **JavaScript**: Para funcionalidade principal
- **JSZip**: Para criação de arquivos ZIP
- **Font Awesome**: Para ícones

### Por que Estas Tecnologias?

- **API de Arquivos HTML5**: Permite arrastar e soltar e manipulação de arquivos
- **API Canvas**: Usada para processamento e redimensionamento de imagens
- **JSZip**: Manipulação eficiente de downloads múltiplos
- **Font Awesome**: Fornece ícones consistentes e escaláveis
- **Design Responsivo**: Garante usabilidade em diferentes dispositivos

## Suporte a Navegadores

RTiler2D funciona em todos os navegadores modernos que suportam:
- API de Arquivos HTML5
- API Canvas
- Recursos ES6 do JavaScript

## Contribuindo

Sinta-se à vontade para enviar problemas e solicitações de melhorias!

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes. 