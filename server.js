let express = require('express');
let morgan = require('morgan');
let uuid = require('uuid');
var cors = require('cors')
let mongoose = require("mongoose");
let {PostList} = require("./blog-post-model");;
let {DATABASE_URL,PORT} = require("./config");

let app = express();
mongoose.Promise = global.Promise;
app.use(cors());
app.use(express.static('public'));
app.use( morgan( 'dev' ) );
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


let fecha = new Date();


app.get( '/blog-posts', (req, res) =>{
    PostList.get()
    .then(posts=>{
        return res.status(200).json(posts);
    })
	.catch(err=>{
        res.statusMessage = "la DB salio mal";
        return res.status(500).json({
            code: 500,
            message: "la BD salio mal"
        })
    })
});

app.get( '/blog-post?', (req, res) =>{
    let query = req.query.author;
    if(query != null){
       PostList.getAuthor(query)
       .then(posts=>{
           return res.status(200).json(posts);
       })
       .catch(error=>{
           res.statusMessage = "la DB salio mal";
           return res.status(500).json({
            code: 500,
            message: "la DB salio mal"
        });
       })
    }else{
        res.statusMessage = "No author parameter given";
        return res.status(406).json({
            code: 406,
            message: "No author parameter given"
        });
    }
});

app.post("/blog-posts",(req,res) =>{
    console.log(req.body);

    if(req.body.title == null){
        return res.status(406).json({
            code: 406,
            message: "No title given"
        });
    }

    if(req.body.content == null){
        return res.status(406).json({
            code: 406,
            message: "No content given"
        });
    }

    if(req.body.author == null){
        return res.status(406).json({
            code: 406,
            message: "No author given"
        });
    }

    let json = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: fecha.getDate() + "/" +  fecha.getMonth() + "/" + fecha.getFullYear()
    };
    PostList.post(json)
    .then(post=>{
        return res.status(201).json(json);
    })
    .catch(err =>{
        res.statusMessage = "La DB salio mal";
        return res.status(500).json({
            code:500,
            message:"La DB salio mal"
        })
    })
});

app.delete("/blog-posts/:id",(req,res)=>{
    let id = req.params.id;
    PostList.delete(id)
    .then(post=>{
        if(!post){
            return res.status(404).json({
                code:404,
                message: "No existe un post con ese id"
            });
        }else{
            return res.status(200).json({
                code:200,
                message:"se borro el post correctamente"
            });
        }
    })
    .catch(err=>{
        res.statusMessage = "La DB salio mal";
        return res.status(500).json({
            code:500,
            message:"La DB salio mal"
        })
    })
});

app.put("/blog-posts/:id",(req,res)=>{
    if(req.body.id == null){
        return res.status(406).json({
            code: 406,
            message: "missing id in body"
        });
    }

    if(req.body.id != req.params.id){
        return res.status(409).json({
            code: 409,
            message: "path variables and body do not match"
        });
    }

    let newVal = {$set : {}};
    let id = req.params.id;

    if (Object.keys(req.body).length > 1){
        if(req.body.content != null){
            newVal["$set"]["content"] = req.body.content;
        }
        if(req.body.author != null){
            newVal["$set"]["author"] = req.body.author;
        }
        if(req.body.title != null){
            newVal["$set"]["title"] = req.body.title;
        }

        PostList.update(id,newVal)
        .then(post=>{
            return res.status(202).json(post);
        })
        .catch(err =>{
            res.statusMessage = "La DB salio mal";
            return res.status(500).json({
                code:500,
                message:"La DB salio mal"
            })
        })
    }



});

let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject) => {
        mongoose.connect(databaseUrl, response =>{
            if(response){
                return reject(response);
            }
            else{
                server = app.listen(port, () =>{
                    console.log("App is running on port " + port);
                    resolve();
                })
                .on("error", err =>{
                    mongoose.disconnect();
                    return reject(err);
                });
            }
        });
    });
}

function closeServer(){
    return mongoose.disconnect()
            .then(() => {
                return new Promise((resolve, reject) =>{
                    console.log("Closing the server");
                    server.close(err =>{
                        if (err){
                            return reject(err);
                        }
                        else{
                            resolve();
                        }
                    });
                });
            });
}

runServer(PORT, DATABASE_URL)
        .catch(err => {
            console.log(err);
        });

module.exports = {app, runServer, closeServer};