//every node.js has these
//app config
// run ./mongod to start the db
var express         = require("express"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    app             = express();
    
//configure Mongoose
mongoose.connect("mongodb://localhost/blog-app");

//use ejs, prepare for CSS, set up body parser
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            //render and pass the data from db
            res.render("index.ejs", {blogs: blogs});    
        }
    });
});

//NEW ROUTE /model/new
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE /model
app.post("/blogs", function(req, res){
   //create blog
   
   //sanitize
   req.body.blog.body = req.sanitize(req.body.blog.body); 
   
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       } else {
              //redirect
           res.redirect("/blogs");
       }
   });
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

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
       Blog.findById(req.params.id, function(err, foundBlog){
     if(err) {
         res.redirect("/blogs");
     } else {
         res.render("edit", {blog: foundBlog});
     }
   });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    
    Blog.findByIdAndUpdate(req.params.id, 
    req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
//delete and redirect elsewhere
app.delete("/blogs/:id", function (req, res) {
    //destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/blogs");
    } else {
        res.redirect("/blogs");
    }
    });
});

//SERVER CHECK C9
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("it's working");
});