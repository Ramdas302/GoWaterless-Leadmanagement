var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LeadSchema = new Schema({
    Oppurtunity_Name:{type:String,required:true},
    Birth_Date:{type:String,required:true},
    Status:{type:String,required:true},
    Lang:{type:String,required:true},
    Source:{type:String,required:true},
    Industry:{type:String,required:true},
    Rating_Scoring:{type:String,required:true},
    Annual_Revenue:{type:String,required:true},
    Referell_Id:{type:String,required:true},
    Capture_Date:{type:String,required:true},
    Assigned_To:{type:String,required:true},
    Phone:{type:Number,required:true},
    Email:{type:String,required:true},
    Fax:{type:String,required:true},
    Job_Title:{type:String,required:true},
    Website:{type:String,required:true},
    Company:{type:String,required:true},
    Num_of_Emp:{type:String,required:true},
    Lead_Name:{type:String,required:true},
    Lead_Price:{type:String,required:true},
    Lead_Type:{type:String,default:"New"},
    Response:{type:String,default:""},
    createdAt : {type:Date,default:Date.now},
})
LeadSchema.index({Lead_Name: 'text', Oppurtunity_Name: 'text'});
LeadSchema.index({'$**': 'text'});
mongoose.model('lead',LeadSchema);