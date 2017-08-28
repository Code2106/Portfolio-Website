

var mongoose = require("mongoose");

var projectsSchema = new mongoose.Schema({
  
    projTitle: String,
    projImage: String,
    projLink: String,
    projDescription:
   {

     projLanguages: String,
     purpose: String,
     status: String

   }
   
});

module.exports = mongoose.model("Projects", projectsSchema);