//arquivo principal 
// dar npm install mysql2, ter o ejs
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'estilos'))); 
app.use(express.static(__dirname)); 

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'app', 'views'));
const views = path.join(__dirname, 'views');

const conexao = require('./conexao/conexao.js');

//const loginCadastro = require('/views/loginCadastro.ejs');
//const solicitarOrcamento = require();
//const profissional = require();

//app.get('/servicos', (req,res) => {
//    res.send('testando')
//});

//rota principal, serviços
//app.get('/servicos', (req, res) => {
//    res.render('servicos.ejs', {
//    });
//});

app.get('/servicos', (req, res) => {
    const termo = req.query.buscar;

    let sql = `
        SELECT p.id_profissional, u.nome, p.profissao
        FROM profissional p
        JOIN usuario u ON p.id_usuario = u.id_usuario
    `;

    let params = [];

    if (termo) {
        sql += " WHERE p.profissao LIKE ?";
        params.push("%" + termo + "%");
    }

    conexao.execute(sql, params, (err, result) => {
        if (err) {
            console.log("Erro ao buscar profissionais:", err);
            return res.render("servicos.ejs", { profissionais: [] });
        }

        return res.render("servicos.ejs", {
            profissionais: result
        });
    });
});


//rota do login
app.get('/login', (req, res) => {
    res.render('loginCadastro', {  
    });
});

app.get('/loginProfissional', (req, res) => {
    res.render('loginCadastroProfissional', {
    });
});

app.get('/cadastrar', (req, res) => {
    res.render('cadastrar', {
    });
});

app.get('/cadastrarProfissional', (req, res) => {
    res.render('cadastrarProfissional', {
    });
});

//app.get('/areaProfissional', (req, res) => {
//    res.render('areaProfissional', {
//    });
//});

app.get('/areaProfissional/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT 
            u.nome,
            u.email,
            u.telefone,
            p.profissao,
            p.descricao
        FROM profissional p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE p.id_profissional = ?
    `;

    conexao.execute(sql, [id], (err, result) => {
        if (err) {
            console.log("Erro:", err);
            return res.send("Erro no servidor");
        }

        if (result.length === 0) {
            return res.send("Profissional não encontrado");
        }

        res.render("areaProfissional", { profissional: result[0] });
    });
});


app.get('/completarPerfil/:id', (req, res) => {
    const id = req.params.id;
    res.render("completarPerfilProfissional", { id_usuario: id });
});



// login cliente
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
    
    console.log("Email recebido:", email);
    console.log("Senha recebida:", senha);

    conexao.execute(sql, [email, senha], (err, result) => {
        if (err) {
            console.log('Erro no banco:', err);
            return res.render('loginCadastro', {
                erro: 'Erro no login.'
            });
        }

        if (result.length > 0) {
            console.log("Login realizado com sucesso:", result[0]);
            return res.redirect('/servicos');
        } else {
            console.log("Usuário não encontrado ou senha incorreta.");
            return res.render('loginCadastro', {
                erro: 'Email ou senha incorretos.'
            });
        }
    });
});


//cadastro cliente
app.post('/cadastrar', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const sql = `INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`;
    const values = [req.body.nome, req.body.email, req.body.senha]
    conexao.execute(sql, values, (err, result) => {

        if (err) {
            console.log('erro', err)
            return res.render('cadastrar', {
                erro: "erro ao cadastrar"
            })
        }
        
        else {

        console.log("cadastro realizado com sucesso", result)
        return res.redirect('/servicos');
        }
    })
});

//login profissional
app.post('/loginCadastroProfissional', (req, res) => {
    const {email, senha} = req.body;
    const sql = "SELECT * FROM usuario u  INNER JOIN profissional p ON u.id_usuario = p.id_usuario WHERE email = ? AND senha = ?";
    console.log("Email recebido:", email);
    console.log("Senha recebida:", senha);
    conexao.execute(sql, [email, senha], (err, result) => {
        if (err) {
            console.log('erro', err)
            return res.render('loginCadastroProfissional', {
                erro: 'erro no login'})
        }
        if (result.length > 0){
            console.log("login realizado com sucesso", result[0])
            return res.redirect('/servicos');
            }
        else{
            return res.render('loginCadastroProfissional', {
              erro: 'erro ao logar'  
            })
        }
    })
})

//cadastro profissional
app.post('/cadastrarProfissional', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const sql = `INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`;
    const values = [req.body.nome, req.body.email, req.body.senha];
    
    conexao.execute(sql, values, (err, result) => {
        if (err) {
            console.log('erro', err);
            return res.render('cadastrarProfissional', {
                erro: "erro ao cadastrar"
            });
        }
        
        console.log("cadastro realizado com sucesso", result);

        const novoUsuarioId = result.insertId;

        const sqlProfissional = `INSERT INTO profissional (id_usuario, profissao) VALUES (?, ?)`;
        const valuesProfissional = [novoUsuarioId, req.body.profissao];
        
        conexao.execute(sqlProfissional, valuesProfissional, (err, resultProfissional) => {
            if (err) {
                console.log('erro', err);
                return res.render('cadastrarProfissional', {
                    erro: "erro ao cadastrar2"
                });
            }
            
            console.log("cadastro realizado com sucesso 2");
            return res.redirect(`/completarPerfil/${novoUsuarioId}`);
        });
    }); 
});

app.post('/salvarPerfilProfissional/:id', (req, res) => {
    const id = req.params.id;
    const { telefone, descricao } = req.body;

    const sqlUser = "UPDATE usuario SET telefone = ? WHERE id_usuario = ?";
    const sqlProf = "UPDATE profissional SET descricao = ? WHERE id_usuario = ?";

    conexao.execute(sqlUser, [telefone, id], (err) => {
        if (err) { console.log(err); return res.send("Erro ao atualizar telefone"); }

        conexao.execute(sqlProf, [descricao, id], (err2) => {
            if (err2) { console.log(err2); return res.send("Erro ao salvar descrição"); }

            res.redirect("/servicos"); // ou redirecione para onde quiser
        });
    });
});


app.listen(3000)
//rota localhost:3000/servicos - rota principal

//app.use('/', loginCadastro);

//essa rota é aonde vai ter os serviços, o usuaario entra no site ja nessa rota ja podendo ver os serviços

