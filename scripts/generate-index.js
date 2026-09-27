#!/usr/bin/env node

/**
 * generate-index.js
 *
 * Lê todos os arquivos .md dentro de examples/ (ou da pasta passada
 * como argumento), extrai título, status e data do cabeçalho de cada
 * ADR, e regenera a tabela de índice em docs/adr/README.md.
 *
 * Uso:
 *   node scripts/generate-index.js
 *   node scripts/generate-index.js caminho/para/outra/pasta
 *
 * Não usa dependências externas — só módulos nativos do Node.
 */

const fs = require("fs");
const path = require("path");

const ADR_DIR = process.argv[2] || path.join(__dirname, "..", "examples");
const OUTPUT_FILE = path.join(__dirname, "..", "docs", "adr", "README.md");

function extrairCampo(conteudo, rotulo) {
  // Procura linhas como "- Status: Aceita" dentro do bloco de metadados
  const regex = new RegExp(`-\\s*${rotulo}:\\s*(.+)`, "i");
  const match = conteudo.match(regex);
  return match ? match[1].trim() : "—";
}

function extrairTitulo(conteudo) {
  // Primeira linha "# ADR XXXX: Título" do arquivo
  const primeiraLinha = conteudo.split("\n")[0];
  const match = primeiraLinha.match(/^#\s*ADR\s*(\d+):\s*(.+)/i);
  if (!match) return { numero: "????", titulo: "Título não encontrado" };
  return { numero: match[1], titulo: match[2].trim() };
}

function gerarLinhaTabela(arquivo) {
  const conteudo = fs.readFileSync(arquivo, "utf-8");
  const { numero, titulo } = extrairTitulo(conteudo);
  const status = extrairCampo(conteudo, "Status");
  const data = extrairCampo(conteudo, "Data");

  return `| ${numero} | ${titulo} | ${status} | ${data} |`;
}

function gerarIndice() {
  if (!fs.existsSync(ADR_DIR)) {
    console.error(`Pasta não encontrada: ${ADR_DIR}`);
    process.exit(1);
  }

  const arquivos = fs
    .readdirSync(ADR_DIR)
    .filter((nome) => nome.endsWith(".md"))
    .sort();

  if (arquivos.length === 0) {
    console.warn(`Nenhum arquivo .md encontrado em ${ADR_DIR}`);
  }

  const linhas = arquivos.map((nome) =>
    gerarLinhaTabela(path.join(ADR_DIR, nome))
  );

  const cabecalho = [
    "<!-- Este arquivo é gerado automaticamente por scripts/generate-index.js -->",
    "<!-- Não edite manualmente — suas mudanças serão sobrescritas -->",
    "",
    "# Índice de ADRs",
    "",
    "| ADR | Título | Status | Data |",
    "|-----|--------|--------|------|",
  ];

  const saida = [...cabecalho, ...linhas].join("\n") + "\n";

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, saida, "utf-8");

  console.log(`Índice gerado com ${arquivos.length} ADR(s) em ${OUTPUT_FILE}`);
}

gerarIndice();
