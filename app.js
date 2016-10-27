//every node.js has these
//app config
// run ./mongod to start the db
var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    app             = express();
    
//configure Mongoose
mongoose.connect("mongodb://localhost/blog-app");

//use ejs, prepare for CSS, set up body parser
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//ending "every node.js has these"

// Mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog post",
//     image: "https://placekitten.com/200/300",
//     body: "Here's a new cute kitten that PlaceKitten added!",
// });

//RESTFUL ROUTES
//INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//NEW ROUTE /model/new
app.get("/blogs/new", function(req, res) {
    res.render("new");
})

//CREATE ROUTE /model
app.post("/blogs", function(req, res){
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new")
       } else {
              //redirect
           res.redirect("/blogs")
       }
   })
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
     if(err) {
         res.redirect("/blogs");
     } else {
         res.render("show", {blog: foundBlog});
     }
   });
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        } else {
            //render and pass the data from db
            res.render("index.ejs", {blogs: blogs});    
        }
    })

});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("it's working")
})