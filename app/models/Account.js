var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccountSchema = new Schema({
    Account_Name:{type:String,required:true},
    Account_Number:{type:Number,required:true},
    Website:{type:String,required:true},
    Industry:{type:String,required:true},
    Phone:{type:Number,required:true},
    Email:{type:String,required:true},
    Address:{type:String,required:true},
    Assigned_To:{type:String,required:true}
})
AccountSchema.index({fields: 'text'});
AccountSchema.index({'$**': 'text'});
mongoose.model('account',AccountSchema);