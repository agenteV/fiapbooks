//requisitando os modulos
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//configurando o express para o postman e para usar a pagina
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;

//configurando o banco de dados
mongoose.connect("mongodb://127.0.0.1:27017/fiapbooks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//criando a model usuario do meu projeto
const UsuarioSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required : true},
    senha : {type : String}
});

const ProdutoSchema = new mongoose.Schema({
    id_produto : {type : String, required : true},
    descricao : {type : String},
    fornecedor : {type : String},
    dataimpressao : {type : Date},
    quantidadeestoque : {type : Number}
});


const Usuario = mongoose.model("Usuario", UsuarioSchema);
const Produto = mongoose.model("Produto",ProdutoSchema)


//configuração dos roteamendos
//cadastrousuario
app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.email;  
  const email = req.body.email;
  const senha = req.body.senha;

  if(nome == null || email == null || senha == null){
    return res.status(400).json({error : "Preencher todos os campos"});
}
  
   
  const usuario = new Usuario({
    nome: nome,
    email: email,
    senha: senha
});

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
  } catch (error) {}

});


//rota de cadastro especifico
app.post("/cadastroproduto", async (req, res) => {
    
    
    const id_produto = req.body.id_produto;
    const descricao = req.body.descricao;
    const fornecedor = req.body.id_fornecedor;
    const dataimpressao = req.body.dataimpressao;
    const quantidadeestoque = req.body.quantidadeestoque;

    if(id_produto == null || descricao == null || fornecedor == null || dataimpressao == null || quantidadeestoque == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    }

    if(quantidadeestoque > 44){
        return res.status(400).json({error : "Estoque Esgotado, não é possivel cadastrar mais!"});
    }
    else if(quantidadeestoque <= 0){
        return res.status(400).json({error : "Você digitou um valor de estoque inválido. Insira um valor valido de estoque entre 1 e 44. "});
    }
     
    const produto = new Produto({
      id_produto: id_produto,
      descricao: descricao,
      fornecedor: fornecedor,
      dataimpressao: dataimpressao,
      quantidadeestoque: quantidadeestoque
    });
  
    try {
      const newProduto = await produto.save();
      res.json({ error: null, msg: "Cadastro ok", ProdutoId: newProduto._id });
    } catch (error) {}
  
  });


//rota padrao
app.get("/cadastroproduto.html", async (req, res) => {
    res.sendFile(__dirname + "/cadastroproduto.html");
  });

app.get("/cadastrousuario.html", async (req, res) => {
    res.sendFile(__dirname + "/cadastrousuario.html");
  });


app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//tem que ter o comando de listen
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});