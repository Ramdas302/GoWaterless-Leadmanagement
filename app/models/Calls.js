var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var textSearch = require('mongoose-text-search');
var CallsSchema = new Schema({
    Comment:{type:String,required:true},
    LeadId:{type:String,ref:'lead'}
   
})
CallsSchema.plugin(textSearch);
CallsSchema.index({Comment:'text'});
CallsSchema.index({'$**': 'text'});
mongoose.model('calls',CallsSchema);