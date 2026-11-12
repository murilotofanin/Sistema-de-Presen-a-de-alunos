//trazera lista de qualuqer maneira k.o

//saber qual é o ultimo id cadastrado


//somar +1 para ser o proximo id


//

import { listarTodos } from "../Manipulador/manipulador_arquivo.js";


export async function gerarNovoId(){
    const registrosAlunos = await listarTodos();

    //pegar todos os id existentes
    const ids = registrosAlunos.map((aluno) => aluno.id);

    //return o maior id encontrado + 1 garantindo quye seja único
    const novoID = Match.max(...ids) + 1
    return novoID

}


