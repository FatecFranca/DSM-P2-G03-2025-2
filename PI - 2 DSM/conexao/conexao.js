var mysql = require("mysql2");
var database = 'bancopi';

// instanciar objeto de acesso ao banco de dados
var conexao = mysql.createConnection({
    user: 'root',
    password: 'Pyetromorgan10',
    host: 'localhost',
    port: 3306,
    database: 'bancopi'
});

conexao.connect((err) => {
    if(err){
        console.log("Erro ao conectar ao Servidor Mysql...", err)
        return
    }else{
        conexao.query("USE " + database);
        console.log("\nConexão Estabilizada com Sucesso!!!")
    }
})


module.exports = conexao;
