const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pi-node"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Conectado!");
});

app.get('/',function(req,res){
    res.render('index.ejs');
});

app.get('/register',function(req,res){
    res.render('register.ejs');
});

app.post('/register',function(req,res){
    console.log(req.body);
    var sql = "INSERT INTO quadras (nome, telefone, esportes, endereco, cep, cidade, estado) VALUES ?";
    var values = [
        [req.body['name'], req.body['phone'], req.body['sports'],
        req.body['address'], req.body['zip'], req.body['city'],
        req.body['state']]
    ];    

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Inserido no banco com sucesso!");
    }); 
    res.redirect('/show');
});

app.get('/list', function(req,res){
    var sql ="SELECT * FROM quadras"
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
            res.render('list.ejs', {dadosQuadras: result})
    });
       
});

app.get('/delete/:id',function(req,res){
    var id= req.params.id;
    var sql = "DELETE FROM quadras WHERE id = ?";
    con.query(sql, id, function (err, result) {
        if (err) throw err;
            console.log("Registro apagado com sucesso");
    }); 
      
    res.redirect('/list');
});

app.listen(80,function(){
    console.log("Servidor Escutando na porta 80");
});