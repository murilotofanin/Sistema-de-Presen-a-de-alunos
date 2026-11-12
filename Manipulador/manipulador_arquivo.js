//imports
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDados = path.join(__dirname, "..","BD", "tabelas.json");  //juntar coisas


export async function listarTodos() {

    const registros = await fs.readFile(caminhoDados, "utf-8");
    return JSON.parse(registros);
}

//Escrever/Salvars
// SalvarTodos escrever em um arquivo local
export async function salvarTodos(registros) {
    await fs.writeFile(caminhoDados, JSON.stringify(registros, null, 2), "utf-8");
    
}

//funcoes auxiliares