var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmailServiceSchema = new Schema({
    Group_Name:{type:String,required:true},
    Email:[{type:String,required:true}],  
})

mongoose.model('Emailservice',EmailServiceSchema);