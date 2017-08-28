

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Projects    = require("./models/projects"),
    methodOverride  = require("method-override"),
    expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/portfoliodb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(expressSanitizer());// Only requirement is that this needs to go after body-parser
app.use(methodOverride("_method"));

app.get("/", function(req, res){

     // Get all campgrounds from DB
    Projects.find({}, function(err, allProjects){

       if(err){ 

           console.log(err);

       } else {

          res.render("index", {projects:allProjects});

       }
    });

});

// Render our form to add new projects
app.get("/add", function(req,res){

      res.render("add"); 

});

//  Add new projects
app.post("/", function(req, res){

   var name = req.body.projTitle;
    var image = req.body.image;
    var link = req.body.link;
    //description
    var language = req.body.languages;
    var purpose = req.body.purpose;
    var status = req.body.status;
    
    var newProj = {projTitle: name, projImage: image, projLink: link, projDescription: {projLanguages:language,purpose:purpose,status:status}};

    Projects.create(newProj, function(err, newlyPro){

            if(err){

              console.log(err);

            }else{

              res.redirect("/");

            }

    });

});


// Update Project: Edit and Delete

// Render our update page
app.get("/update", function(req,res){

    Projects.find(req.params.id, function(err, allProjects){

       if(err){ 

           console.log(err);

       } else {

          res.render("update", {projects:allProjects});

       }
    });

});


// Render our edit page
app.get("/update/:id/edit", function(req,res){

    Projects.findById(req.params.id, function(err, editProject){

       if(err){ 

           console.log(err);

       } else {

 console.log(editProject);
          res.render("edit", {project:editProject});

       }
    });

});


//Edit Projects
app.put("/update/:id", function(req,res){

console.log(req.body);

    req.body.project.body = req.sanitize(req.body.project.body);
console.log(req.body);
    Projects.findByIdAndUpdate(req.params.id, req.body.project,

    function(err,updatedProject){

        if(err){
          res.redirect("/");
        }  else {
          res.redirect("/update", + req.params.id, {project:updatedProject});
        }

    });

});

//Delete projects
app.delete("/update/:id", function(req,res){

   Projects.findByIdAndRemove(req.params.id, function(err,deletedProject){
  
     if(err){

        console.log(deletedProject);

     }else{

        res.redirect("/update");

     }
       
   });

});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   console.log("My Portfolio Has Started!");
});
