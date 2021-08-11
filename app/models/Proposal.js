var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var textSearch = require('mongoose-text-search');
var ProposalSchema = new Schema({
    Title:{type:String,required:true},
    Amount:{type:Number,required:true},
    Description:{type:String,required:true},
    File_Attachment:{type:String,required:true},
    Date:{type:String,required:true},
    NextCall_Date_Comment:{type:String,required:true},
    Status:{type:String,required:true} 
   
})
ProposalSchema.plugin(textSearch);
ProposalSchema.index({Title:'text'});
ProposalSchema.index({'$**': 'text'});
mongoose.model('proposal',ProposalSchema);