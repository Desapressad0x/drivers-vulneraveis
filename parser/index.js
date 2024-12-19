const { Parser } = require("xml2js");
const fs = require("fs");
const path = require('path');

const parser = new Parser({ explicitArray: false });

async function processar(caminhoArquivoXML) {
    try {
        const xml = fs.readFileSync(caminhoArquivoXML, "utf8");
        const resultado = await parser.parseStringPromise(xml);
		
        const regrasArquivo = resultado["ns0:FileRules"];
        const regrasNegadas = regrasArquivo["ns0:Deny"] || [];
        const hashes = regrasNegadas.map(regra => regra.$.Hash.toLowerCase());

        const arrayC = `const char* hashesVulneraveis[] = {\n    ${hashes.map(h => `"${h}"`).join(",\n    ")}\n};`;
        console.log(arrayC.replace(/\n/g, '\n'));
    } catch (erro) {
        console.log(`Erro ao processar: ${erro.message}`);
    }
}

const argumentos = process.argv.slice(2);

if (argumentos.length === 0) {
    console.log(`Uso: node ${path.basename(__filename)} [arquivo xml]`);
    process.exit(1);
}

processar(argumentos[0]);
