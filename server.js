let express = require('express');
let morgan = require('morgan');
let uuid = require('uuid');
var cors = require('cors')

let app = express();

app.use(cors());
app.use(express.static('public'));
app.use( morgan( 'dev' ) );
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


let fecha = new Date();
let posts = [
    {
        id: uuid.v4(),
        title: "titulo",
        content: "dummy",
        author: "Jose Adame",
        publishDate: fecha.getDate() + "/" +  fecha.getMonth() + "/" + fecha.getFullYear()
    }
]

app.get( '/blog-posts', (req, res) =>{
	console.log( "Req query", req.query );
	return res.status(200).json(posts);
});

app.get( '/blog-post?', (req, res) =>{
    let query = req.query.author;
    if(query != null){
        let resultados = [];
        posts.forEach(element => {
            console.log(element["author"]);
            console.log(query);
            if(element["author"] == query){
                console.log("encontro!");
                resultados.push(element);
            }
        });
        console.log(resultados);
        if(resultados.length == 0){
            res.statusMessage = "No author found";
            return res.status(404).json({
                code: 404,
                message: "No author found"
            });
        }
            return res.status(200).json(resultados); 
    }
    res.statusMessage = "No author parameter given";
    return res.status(406).json({
        code: 406,
        message: "No author parameter given"
    });
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

    posts.push(json);
    return res.status(201).json(json);
});

app.delete("/blog-posts/:id",(req,res)=>{
    let id = req.params.id;
    let i = 0;
    posts.forEach(element => {
        if(element["id"]==id){
            posts.splice(i,1);
            return res.status(200).json({
                code: 200,
                message: "deleted succesfully"
            });
        }
        i++;
    });
    return res.status(404).json({
        code: 404,
        message: "id not found"
    });
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
    posts.forEach(element => {
        if(req.body.id == element.id){
            if(req.body.content != null){
                element.content = req.body.content;
            }
            if(req.body.author != null){
                element.author = req.body.author;
            }
            if(req.body.publishDate != null){
                element.publishDate = req.body.publishDate;
            }
            if(req.body.title != null){
                element.title = req.body.title;
            }
            return res.status(202).json(element);
        }
    });


});

app.listen( '8080', () => {
	console.log( "App running on localhost:8080" );
});