const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var EmailServiceSchema = require("../../../../app/models/EmailService");
var EmailserviceModel = mongoose.model("Emailservice");
const sgMail = require('@sendgrid/mail')


router.post('/addEmailgroup',function(req,res){
    var addEmailGroup = new EmailserviceModel({
        Group_Name:req.body.Group_Name,
        Email:req.body.Email,
    });
    addEmailGroup.save(function (err, result) {
      if (err) {
        console.error(err);
        return res.status(400).json({
          message: 'Bad Request'
        });
      } else {
        res.json({
          status: 200,
          data: result
        })
      }

    });

});


router.post('/sendEmailgroup', async(req,res)=>{
    var emaildata = await EmailserviceModel.findById({_id:req.body.id})
    sendEmail(emaildata)
    function sendEmail(emaildata) {
      const sendGridAPIKey = "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"
         sgMail.setApiKey(sendGridAPIKey)
      
          const msg = {
         to: emaildata.Email,
         from: 'jadhavramdas655@gmail.com',
         subject:'New lead add',
         text: 'Hello,\n\n' +
         'lead management system add new leads.\n'
     };
      
         sgMail.send(msg).then(() => {
          res.json('lead managenment system')
      }).catch((error) => {
          console.log(error)
          
      })     
   }      
})


router.get('/getEmailGroup',function(req,res){
  EmailserviceModel.find({}).exec(function(err,result){
      if(err){
        return res.status(400).json({
          message: 'Bad Request'
        });
      }else{
        res.json({
          status: 200,
          data: result
        });
      }
    
    });
});
  
  
router.put('/updateEmailservice/:id',function(req,res){
    update = {
      $set: {
        Group_Name:req.body.Group_Name,
        Email:req.body.Email,
      }
    };
    EmailserviceModel.findByIdAndUpdate(req.params.id,update, function (err, email) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: email
          })
        }
  
      });
  });
  
  
    router.post('/deleteEmailGroup/:id',async(req,res)=>{
      var deletedata = await EmailserviceModel.findByIdAndRemove(req.params.id)
      if (deletedata) {
        res.json({
          status:200,
          data:deletedata 
        })
      }else{
       console.error(err);
       return res.status(400).json({
         message: 'Bad Request'
      }); 
      }
    })
    
module.exports = router;
