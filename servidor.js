import express from "express";
import { listarTodos, salvarTodos } from "./Manipulador/manipulador_arquivo.js";
import { gerarNovoId } from "./FUNCOES/funcoes.js";

const app = express();
const PORT = 3000;
app.use(express.json());

//GET - Boas vindas
app.get("/", (req, res) => {
    res.send("Bem-vindas à API do nosso gerenciador")
});

//GET - alunos
app.get("/alunos", async (req, res) => {
    try{
        const registros = await listarTodos();
        return res.status(200).json(registros);
    }
    catch(error){
        console.log("Erro ao listar", error);
        return res.status(500).json({error: "Não foi possível listar os alunos."})
    }
});

//GET /alunos/:id 
app.get("/alunos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = await listarTodos();

    const alunoEncontrado = dados.find((registro) => registro.id === id);

    if (!alunoEncontrado) {
      return res.status(404).json({ erro: "Aluno não encontrado na tabela ." });
    }

    return res.status(200).json(alunoEncontrado);

  } catch (error) {
    console.log("Erro ao buscar cadastro:", error);
    return res.status(500).json({ erro: "Não foi possível buscar o cadastro dos alunos ." });
  }
});

//DELETE / alunos:id
app.delete("/alunos/:id", async(req, res) => {
    try{
        //Recuperar ID enviadona url e converter para number
        const id = Number(req.params.id);

        //Ler os dados cadastrados
        const dados = await listarTodos();

        //Mantem apenas os itens com id diferente
        const dadosAtualizados = dados.filter((alunos) =>
        alunos.id !==id);

        //verificar se deletou
        if(dadosAtualizados.length === dados.length){
            return res.status(404).json({erro: "Aluno não foi deletado."})
        }

        await salvarTodos(dadosAtualizados);

        return res.status(200).json({mensagem: "Aluno foi excluido com sucesso!"});
    }
    catch{erro}{
        console.log("Erro ao deletar o cadastro", error);
        return res.status(500).json({error: "Não foi possível deletar o cadastro dos alunos."});
    }
});

// POST
app.post("/alunosPost", async (req, res) => {

    try{

    const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo} = 
    req.body;

    //valida campos obrigatorios
    if(!matricula || !nome || !turma || !data || !presente === undefined || !motivoSaida || !minutosFora){
        return res.status(400).json({erro: "Todos os campos são obrigatórios"})
    }

    // gerando um novo ID único
    const id = await gerarNovoId();

    //criar objeto com dados do novo cadastro
    const novoCadastro ={
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma:turma,
        data: data,
        presente: presente,
        motivoSaida:motivoSaida || null,
        minutosFora: Number(minutosFora) || 0,
        alertaTempo:alertaTempo || false,
    };

    //carregar a lista de cadastros, adicionar o novo e salvar
    const cadastro = await listarTodos();
    cadastro.push(novoCadastro);

    //manipulador
    await salvarTodos(cadastro);
    return res.status(201).json({mensagem: "Cadastro do aluno realizado com sucesso!"});

    }
    catch(error){
    console.log("Erro ao salvar cadastro do aluno", error);
    return res.status(500).json
    ({error: "Não foi possível salvar o cadastro do aluno"});
    }
});

//PuT /atendimentos/:id
app.put("/alunos/:id", async(req, res) => {
    try{

        //Recuperar  ID enviado na url e converter para Number
        const id = Number(req.params.id);

        //Leio os dados cadastrados
        const dados = await listarTodos();

        //procurar o id com id informado
        const alunoExistente = dados.find((alunos) =>
        alunos.id === id);

        //verificar se encontrou o atendimento
        if(!alunoExistente){
            return res.status(404).json({erro: "Aluno não encontrado, tente novamente "});
        }

        //se comportara como um novo cadastro
        //dado do novo cadastro
        const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo} = 
        req.body;

        //valida campos obrigatorios
        if(!id || !matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora){
        return res.status(400).json({erro: "Todos os campos são obrigatórios"})
    }

    //criar objeto com dados do novo cadastro
        const cadastroAtualizado ={
        id: Number(id),
        matricula: matricula,
        nome: nome,
        turma:(turma),
        data: data,
        presente: presente,
        motivoSaida:(motivoSaida),
        minutosFora: Number(minutosFora),
        alertaTempo: alertaTempo

    };

    //Substituir o atendimento existente pelo atualizado - map
        const dadosAtualizados = dados.map((alunos) =>
        alunos.id === id ? cadastroAtualizado : alunos);
    
    //salvar lista nova
        await salvarTodos(dadosAtualizados);

    //mensagem de resposta
        return res.status(200).json({mensagem: "Alunos atualizado com sucesso prossiga!"})

        }
        catch(error){
        console.log("Erro ao alterar o cadastro do aluno", error);
        return res.status(500).json
        ({error: "Não foi possível alterar e salvar o cadastro do aluno."});
        }
    });


app.use ((req, res) => {
    res.status(404).json({erro: "Rota não encontrada, tente novamente."})
});

app.listen(PORT, () =>  {
    console.log("Está rodando na porta: ", PORT);
});
