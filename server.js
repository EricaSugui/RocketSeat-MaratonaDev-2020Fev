const express = require("express")
const server = express();
const port = 3000
const ip = 'localhost'

// configurar para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body
server.use(express.urlencoded({ extended: true }))

// configurar banco de dados
const Pool = require("pg").Pool
const db = new Pool({
    user: 'postgres',
    password: '1111',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// configurando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

server.get("/", function(req, res) {
    db.query(`SELECT * FROM donors`, function(err, result){
        if (err) return res.send("Erro de banco ARGH")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
    //const donors = []
    
})

server.post("/", function(req, res) {
    //pegar dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }
    // colocar valores novos no banco
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if (err)
            return res.send(err.message)
        //fluxo ideal
        return res.redirect("/")
    })

})

server.listen(port, ip , () => {
    console.log(`Servidor rodando em http://${ip}:${port}`)
    console.log('Para finalizar o servidor: ctrl + C')
})