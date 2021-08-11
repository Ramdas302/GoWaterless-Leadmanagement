var mongoose = require('mongoose');

url = "mongodb+srv://leadcrmadmin:lead@123@cluster0.vuhrq.mongodb.net/leadcrm?retryWrites=true&w=majority"
mongoose.connect(url,{
useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true,
useFindAndModify:false
}).then(()=>{
console.log('mongodb connected')
}).catch((err)=>{
    console.log('mongodb not connected')
})

module.exports=mongoose;