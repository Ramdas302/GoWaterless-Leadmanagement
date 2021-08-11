var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var validateEmail = function(Email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(Email)
};
var ContactSchema = new Schema({
    UserName:{type:String,required:true},
    Email:{type:String,required:true,unique:true,
    validate:[validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    Phone_No:{type:Number,required:true,min:10,validate: /^\d{10}$/},
    FirstName:{type:String,required:true},
    LastName:{type:String,required:true},
    City:{type:String,required:true},
    Current_Occupation:{type:String,required:true},
    Industry_Interest:{type:String,required:true},
    Educational_Qualification:{type:String,required:true},
    Assigned_To: {type:String, text: true},
})
ContactSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
ContactSchema.index({fields: 'text'});
ContactSchema.index({'$**': 'text'});
mongoose.model('contact',ContactSchema);