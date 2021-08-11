var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var textSearch = require('mongoose-text-search');
var MeetingSchema = new Schema({
    Date_Time:{type:String,required:true},
    Title:{type:String,required:true},
    Comment:{type:String,required:true},
    LeadId:{type:String, ref:'lead'},
    Invite_Email:{type:String,required:true}
   
})
MeetingSchema.plugin(textSearch);
MeetingSchema.index({Title:'text', Invite_Email:'text'});
MeetingSchema.index({'$**': 'text'});
mongoose.model('meeting',MeetingSchema);