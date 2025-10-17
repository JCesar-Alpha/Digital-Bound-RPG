const fs = require('fs-extra');
const path = require('path');

class PDFBuilder {
    constructor() {
        this.sourceDir = path.join(__dirname, '../src');
        this.distDir = path.join(__dirname, '../dist');
        this.tempDir = path.join(this.distDir, 'temp');
    }

    async init() {
        await fs.ensureDir(this.tempDir);
        await fs.ensureDir(this.distDir);
    }

    async buildFullPDF() {
        console.log('📚 Building complete Digital Bound RPG PDF...');
        
        // Implementar lógica de build completo usando markdown-pdf ou puppeteer
        // Combinar todos os capítulos e apêndices
        
        const chapters = await this.getAllChapters();
        const appendices = await this.getAllAppendices();
        
        const fullContent = await this.generateFullHTML(chapters, appendices);
        await this.generatePDF(fullContent, 'digital-bound-rpg-completo.pdf');
        
        console.log('✅ Complete PDF built successfully!');
    }

    async buildPreviewPDF() {
        console.log('🔍 Building preview PDF (Chapters 1-3)...');
        
        const previewChapters = await this.getChaptersRange(1, 3);
        const previewContent = await this.generatePreviewHTML(previewChapters);
        await this.generatePDF(previewContent, 'digital-bound-rpg-preview.pdf');
        
        console.log('✅ Preview PDF built successfully!');
    }

    async buildPrintPDF() {
        console.log('🖨️ Building print-optimized PDF...');
        
        const allChapters = await this.getAllChapters();
        const allAppendices = await this.getAllAppendices();
        const printContent = await this.generatePrintHTML(allChapters, allAppendices);
        await this.generatePDF(printContent, 'digital-bound-rpg-print.pdf');
        
        console.log('✅ Print PDF built successfully!');
    }

    async getAllChapters() {
        const chaptersDir = path.join(this.sourceDir, 'chapters');
        const files = await fs.readdir(chaptersDir);
        
        return files
            .filter(file => file.endsWith('.md'))
            .sort()
            .map(file => ({
                name: file.replace('.md', ''),
                content: fs.readFileSync(path.join(chaptersDir, file), 'utf8')
            }));
    }

    async getAllAppendices() {
        const appendicesDir = path.join(this.sourceDir, 'appendices');
        const files = await fs.readdir(appendicesDir);
        
        return files
            .filter(file => file.endsWith('.md'))
            .sort()
            .map(file => ({
                name: file.replace('.md', ''),
                content: fs.readFileSync(path.join(appendicesDir, file), 'utf8')
            }));
    }

    async getChaptersRange(start, end) {
        const allChapters = await this.getAllChapters();
        return allChapters.slice(start - 1, end);
    }

    async generateFullHTML(chapters, appendices) {
        // Implementar geração de HTML com estilo futurista
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Bound RPG - Sistema Completo</title>
    <style>
        ${await this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        ${await this.generateHeader()}
        ${await this.generateTOC(chapters, appendices)}
        ${chapters.map(chapter => this.generateChapterHTML(chapter)).join('')}
        ${appendices.map(appendix => this.generateAppendixHTML(appendix)).join('')}
        ${await this.generateFooter()}
    </div>
</body>
</html>`;
    }

    async generatePreviewHTML(chapters) {
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Bound RPG - Preview</title>
    <style>
        ${await this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        ${await this.generateHeader()}
        <div class="preview-notice">
            <h2>🎯 Preview - Capítulos 1-3</h2>
            <p>Esta é uma versão preview do sistema Digital Bound RPG.</p>
        </div>
        ${chapters.map(chapter => this.generateChapterHTML(chapter)).join('')}
        ${await this.generateFooter()}
    </div>
</body>
</html>`;
    }

    async generatePrintHTML(chapters, appendices) {
        // Versão otimizada para impressão
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Bound RPG - Versão Impressão</title>
    <style>
        ${await this.getPrintStyles()}
    </style>
</head>
<body>
    <div class="container">
        ${await this.generateHeader()}
        ${chapters.map(chapter => this.generateChapterHTML(chapter)).join('')}
        ${appendices.map(appendix => this.generateAppendixHTML(appendix)).join('')}
    </div>
</body>
</html>`;
    }

    async getStyles() {
        return `
        /* Estilos futuristas para Digital Bound RPG */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');
        
        :root {
            --primary-blue: #00b4d8;
            --digital-gold: #ffd700;
            --dark-bg: #0a0a0a;
            --light-bg: #ffffff;
            --card-bg: #f8f9fa;
            --text-dark: #2d3748;
            --text-light: #ffffff;
        }
        
        body {
            font-family: 'Source Sans Pro', sans-serif;
            line-height: 1.6;
            color: var(--text-dark);
            background: var(--light-bg);
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Orbitron', sans-serif;
            color: var(--primary-blue);
            border-bottom: 2px solid var(--digital-gold);
            padding-bottom: 10px;
        }
        
        .chapter-header {
            background: linear-gradient(135deg, var(--primary-blue), var(--digital-gold));
            color: var(--text-light);
            padding: 30px;
            border-radius: 10px;
            margin: 40px 0;
            text-align: center;
        }
        
        .rule-box {
            background: var(--card-bg);
            border-left: 4px solid var(--primary-blue);
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .tip-box {
            background: #fff3cd;
            border-left: 4px solid var(--digital-gold);
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .warning-box {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .example-box {
            background: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .digital-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-blue), transparent);
            margin: 40px 0;
            position: relative;
        }
        
        .digital-divider::before {
            content: "⚡";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: var(--light-bg);
            padding: 0 10px;
            color: var(--primary-blue);
        }
        `;
    }

    async getPrintStyles() {
        return `
        /* Estilos otimizados para impressão */
        body {
            font-family: 'Source Sans Pro', sans-serif;
            line-height: 1.4;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 12pt;
        }
        
        .container {
            max-width: 100%;
            margin: 0;
            padding: 20px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Orbitron', sans-serif;
            color: #000;
            page-break-after: avoid;
        }
        
        .chapter-header {
            background: #f0f0f0;
            color: #000;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #ccc;
        }
        
        .rule-box, .tip-box, .warning-box, .example-box {
            background: #f9f9f9;
            border-left: 4px solid #666;
            padding: 10px;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .digital-divider {
            display: none;
        }
        
        @media print {
            .no-print {
                display: none;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
        `;
    }

    async generateHeader() {
        return `
        <header class="chapter-header">
            <h1>DIGITAL BOUND RPG</h1>
            <h2>Sistema de Laço e Evolução</h2>
            <p>Onde o Laço é a Verdadeira Evolução</p>
        </header>`;
    }

    async generateTOC(chapters, appendices) {
        const chapterLinks = chapters.map((chapter, index) => 
            `<li><a href="#chapter-${index + 1}">CAPÍTULO ${index + 1}: ${this.formatChapterName(chapter.name)}</a></li>`
        ).join('');
        
        const appendixLinks = appendices.map((appendix, index) => 
            `<li><a href="#appendix-${String.fromCharCode(65 + index)}">APÊNDICE ${String.fromCharCode(65 + index)}: ${this.formatAppendixName(appendix.name)}</a></li>`
        ).join('');
        
        return `
        <nav class="toc">
            <h2>📖 Sumário</h2>
            <ul>
                ${chapterLinks}
                ${appendixLinks}
            </ul>
        </nav>
        <div class="digital-divider"></div>`;
    }

    generateChapterHTML(chapter) {
        return `
        <section id="${chapter.name}" class="chapter">
            <div class="chapter-header">
                <h2>${this.formatChapterName(chapter.name)}</h2>
            </div>
            <div class="chapter-content">
                ${this.convertMarkdownToHTML(chapter.content)}
            </div>
            <div class="digital-divider"></div>
        </section>`;
    }

    generateAppendixHTML(appendix) {
        return `
        <section id="${appendix.name}" class="appendix">
            <div class="chapter-header">
                <h2>${this.formatAppendixName(appendix.name)}</h2>
            </div>
            <div class="appendix-content">
                ${this.convertMarkdownToHTML(appendix.content)}
            </div>
            <div class="digital-divider"></div>
        </section>`;
    }

    async generateFooter() {
        return `
        <footer class="footer">
            <div class="digital-divider"></div>
            <p><strong>DIGITAL BOUND RPG</strong> - Sistema de Laço e Evolução</p>
            <p>Autor: Sr. Orthus | Versão 1.0</p>
            <p class="no-print">"O objetivo final não é se tornar o mais poderoso, mas construir o laço mais forte."</p>
        </footer>`;
    }

    formatChapterName(filename) {
        const names = {
            '01-introducao': 'INTRODUÇÃO AO MUNDO DIGITAL',
            '02-criacao-personagem': 'CRIAÇÃO DE PERSONAGEM',
            '03-sistema-laco': 'O SISTEMA DE LAÇO',
            '04-sistema-digimon': 'SISTEMA DIGIMON',
            '05-sistema-evolucao': 'SISTEMA DE EVOLUÇÃO',
            '06-heranca-digital': 'SISTEMA DE HERANÇA DIGITAL',
            '07-sistema-combate': 'SISTEMA DE COMBATE',
            '08-equipamentos-tecnologia': 'EQUIPAMENTOS E TECNOLOGIA',
            '09-mundo-digital': 'O MUNDO DIGITAL',
            '10-narrativa-missoes': 'NARRATIVA E MISSÕES',
            '11-inimigos-encontros': 'INIMIGOS E ENCONTROS',
            '12-regras-avancadas': 'REGRAS AVANÇADAS'
        };
        return names[filename] || filename.toUpperCase().replace(/-/g, ' ');
    }

    formatAppendixName(filename) {
        const names = {
            'A-tabelas-referencia': 'TABELAS DE REFERÊNCIA RÁPIDA',
            'B-lista-traços': 'LISTA COMPLETA DE TRAÇOS',
            'C-catalogo-talentos': 'CATÁLOGO DE TALENTOS',
            'D-tecnicas-elemento': 'TÉCNICAS POR ELEMENTO',
            'E-equipamentos-precos': 'EQUIPAMENTOS E PREÇOS',
            'F-folhas-personagem': 'FOLHAS DE PERSONAGEM'
        };
        return names[filename] || filename.toUpperCase().replace(/-/g, ' ');
    }

    convertMarkdownToHTML(markdown) {
        // Conversão básica de markdown para HTML
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n/gim, '<br>');
    }

    async generatePDF(htmlContent, filename) {
        // Implementar geração de PDF usando puppeteer ou markdown-pdf
        console.log(`📄 Generating PDF: ${filename}`);
        
        // Placeholder - implementar com biblioteca PDF real
        const outputPath = path.join(this.distDir, filename);
        await fs.writeFile(outputPath.replace('.pdf', '.html'), htmlContent);
        
        console.log(`✅ HTML generated for: ${filename}`);
        console.log(`⚠️  PDF generation requires additional setup with puppeteer`);
    }

    async cleanup() {
        await fs.remove(this.tempDir);
    }
}

// Main execution
async function main() {
    const builder = new PDFBuilder();
    await builder.init();
    
    const args = process.argv.slice(2);
    
    try {
        if (args.includes('--preview')) {
            await builder.buildPreviewPDF();
        } else if (args.includes('--print')) {
            await builder.buildPrintPDF();
        } else {
            await builder.buildFullPDF();
        }
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    } finally {
        await builder.cleanup();
    }
}

if (require.main === module) {
    main();
}

module.exports = PDFBuilder;