let box = "box";
let add = $("#submitPost");
let updatePost = $("#updatePost");
lista = $("#load-posts");
let del = $("#deletePost");
let author = $("#searchByAuthor");
function init(){
    let url = '/blog-posts';
    lista.html("");
    $.ajax({
        url: url,
        method: "GET",
        success: function(result){
            console.log(result);
            result.forEach(element => {
                id = element["id"];
                author = element["author"];
                title = element["title"];
                content = element["content"];
                publishDate = element["publishDate"];
                $(lista).append("<div class="+box +"> <p>id: "+id+"</p> <p>title: "+title+"</p> <p>Date: "+publishDate+"</p> <p>Author: "+author+"</p> <p>Content: "+content+ "</p></div>");
            });
        }
    })
}

init();

add.on("click",event =>{
    event.preventDefault();
    let post = {
        title: $("#AddTitle").val(),
        content: $("#AddContent").val(),
        author: $("#AddAuthor").val()
    }
    $.ajax({
        url: "/blog-posts",
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(post),
        success: () =>{
            init();
        }
    });
})

del.on("click",event =>{
    event.preventDefault();
    let id = $("#DeletePostId").val();
    console.log(id);
    $.ajax({
        url: "/blog-posts/"+id,
        method: "DELETE",
        success: () =>{
            init();
        }
    });
});

author.on("click",event=>{
    authorName = $("#AuthorGet").val();
    $.ajax({
        url: "/blog-posts/author="+authorName,
        method: "GET",
        success: (posts) =>{
            posts.forEach(element => {
                id = element["id"];
                author = element["author"];
                title = element["title"];
                content = element["content"];
                publishDate = element["publishDate"];
                $(lista).append("<div class="+box +"> <p>id: "+id+"</p> <p>title: "+title+"</p> <p>Date: "+publishDate+"</p> <p>Author: "+author+"</p> <p>Content: "+content+ "</p></div>");
            });
        }
    });
});


updatePost.on("click",event =>{
    event.preventDefault();
    let id=$("#UpdateId").val();
    let postUpdate = {
        id: $("#UpdateId").val()
    }
    if($("#UpdateTitle").val().trim().lenght != 0){
        postUpdate["title"] = $("#UpdateTitle").val()
    }
    if($("#UpdateContent").val().trim().lenght != 0){
        postUpdate["content"] = $("#UpdateContent").val()
    }
    if($("#UpdateAuthor").val().trim().lenght != 0){
        postUpdate["author"] = $("#UpdateAuthor").val()
    }
    $.ajax({
        url: "http://localhost:8080/blog-posts/"+id,
        method: "PUT",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(postUpdate),
        success: () =>{
            init();
        }
    })
})