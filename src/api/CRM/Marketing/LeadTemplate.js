const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const excel = require("exceljs");
const multer = require('multer');
const csv=require('csvtojson')
var fs = require("fs");
var pdf = require('html-pdf');
var LeadSchema = require("../../../../app/models/Lead");
var LeadModel = mongoose.model("lead");
var MeetingSchema = require("../../../../app/models/Meeting");
var MeetingModel = mongoose.model("meeting");
var  CallsSchema= require("../../../../app/models/Calls");
var CallsModel = mongoose.model("calls");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `./uploads`;
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname,file.fieldname);
    }
  })
});


 router.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
  importCsvData2MongoDB('./uploads/' + req.file.filename);
  res.json({
      'msg': 'File uploaded/import succesfully!', 'file': req.file
  });
});

function importCsvData2MongoDB(filePath){
  csv()
      .fromFile(filePath)
      .then((jsonObj)=>{
          console.log(jsonObj);
              LeadModel.insertMany(jsonObj, (err, res) => {
                 if (err) throw err; 
              });
    
          fs.unlinkSync(filePath);
      })
}



router.post('/addLeads',function(req,res){
  var time = new Date();
    var addLeads = new LeadModel({
        Oppurtunity_Name:req.body.Oppurtunity_Name,
        Birth_Date:req.body.Birth_Date,
        Status:req.body.Status,
        Lang:req.body.Lang,
        Source:req.body.Source,
        Industry:req.body.Industry,
        Rating_Scoring:req.body.Rating_Scoring,
        Annual_Revenue:req.body.Annual_Revenue,
        Referell_Id:req.body.Referell_Id,
        Capture_Date:req.body.Capture_Date,
        Assigned_To:req.body.Assigned_To,
        Phone:req.body.Phone,
        Email:req.body.Email,
        Fax:req.body.Fax,
        Job_Title:req.body.Job_Title,
        Website:req.body.Website,
        Company:req.body.Company,
        Lead_Name:req.body.Lead_Name,
        Lead_Price:req.body.Lead_Price,
        Num_of_Emp:req.body.Num_of_Emp,
        Response:req.body.Response,
        createdAt:time

    });
    addLeads.save(function (err, result) {
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

router.get('/getLeads',function(req,res){
    LeadModel.find({}).exec(function(err,result){
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
  
 

router.put('/updateLeadsStatus/:id',function(req,res){
    update = {
      $set: {
        Lead_Type: req.body.Lead_Type,
        Response: req.body.Response,
      }
    };
    LeadModel.findByIdAndUpdate(req.params.id,update, function (err, leadstatus) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: leadstatus
          })
        }
  
      });
  });


  router.put('/updateLead/:id',function(req,res){
    update = {
      $set: {
        Capture_Date: req.body.Capture_Date,
        Response: req.body.Response,
      }
    };
    LeadModel.findByIdAndUpdate(req.params.id,update, function (err, leads) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: leads
          })
        }
  
      });
  });
  
  router.post("/searchleads", function(req, res){
     LeadModel.find({Lead_Name:req.body.Lead_Name,Status:req.body.Status,Lead_Price:req.body.Lead_Price}).exec(function(err,Leads){
        if(err){
          res.json({
            status:400,
            message:"Bad request"
              
          })
      }else{
        res.json({
          status:200,
          data:Leads
        })
      }
      })
    });
    
  router.get("/TotalLeads", function(req, res){
  LeadModel.count({}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
    })
  });

  router.get("/NewLeads", function(req, res){
    LeadModel.count({Lead_Type:"New"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
    })
  });

  router.get("/LeadsConverted", function(req, res){
    LeadModel.count({Lead_Type:"Converted"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
    })
  });

  router.get("/LeadsQualified", function(req, res){
    LeadModel.count({Lead_Type:"Qualified"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
    })
  });

  router.get("/LeadsDisqualified", function(req, res){
    LeadModel.count({Lead_Type:"Disqualified"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
   
     
    })
  });

  router.get("/LeadsContacted", function(req, res)  {
    LeadModel.count({Lead_Type:"Contacted"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
   
     
    })
  });

  router.get("/LeadsProposalSent", function(req, res){
     LeadModel.count({Lead_Type:"Proposal Sent"}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
   
     
    })
  });

  router.get("/getleads/:id",(req, res) => {
    LeadModel.findById({_id:req.params.id}).exec(function(err,Leads){
      if(err){
        res.json({
          status:400,
          message:"Bad request"
            
        })
    }else{
      res.json({
        status:200,
        data:Leads
      })
    }
   
     
    })
  });
  
  router.get("/LeadPdfdownload", function (req, res) {
    LeadModel.find({}).exec(function (err, Leads) {
      if (err) throw err;
      const jsonLeads = JSON.parse(JSON.stringify(Leads));
  
      var result = jsonLeads;    
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr > Contacts";
table += "<th >Id</th>";
table += "<th >Oppurtunity_Name";
table += "<th >Birth_Date";
table += "<th >Status";
table += "<th >Lang";
table += "<th >Source";
table += "<th >Industry";
table += "<th >Rating_Scoring";
table += "<th >Annual_Revenue";
table += "<th >Referell_Id";
table += "<th >Capture_Date";
table += "<th >Assigned_To";
table += "<th >Phone";
table += "<th >Email";
table += "<th >Fax";
table += "<th >Job_Title";
table += "<th >Website";
table += "<th >Company";
table += "<th >Num_of_Emp";
table += "<th >Lead_Name";
table += "<th >Lead_Price";
table += "<th >Lead_Type";
table += "<th >Response";
table += "<th >createdAt";
table += "</tr>";
result.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row._id+"</td>";
    table += "<td>"+row.Oppurtunity_Name+"</td>";
    table += "<td>"+row.Birth_Date+"</td>";
    table += "<td>"+row.Status+"</td>";
    table += "<td>"+row.Lang+"</td>";
    table += "<td>"+row.Source+"</td>";
    table += "<td>"+row.Industry+"</td>";
    table += "<td>"+row.Rating_Scoring+"</td>";
    table += "<td>"+row.Annual_Revenue+"</td>";
    table += "<td>"+row.Referell_Id+"</td>";
    table += "<td>"+row.Capture_Date+"</td>";
    table += "<td>"+row.Assigned_To+"</td>";
    table += "<td>"+row.Phone+"</td>";
    table += "<td>"+row.Email+"</td>";
    table += "<td>"+row.Fax+"</td>";
    table += "<td>"+row.Job_Title+"</td>";
    table += "<td>"+row.Website+"</td>";
    table += "<td>"+row.Company+"</td>";
    table += "<td>"+row.Num_of_Emp+"</td>";
    table += "<td>"+row.Lead_Name+"</td>";
    table += "<td>"+row.Lead_Price+"</td>";
    table += "<td>"+row.Lead_Type+"</td>";
    table += "<td>"+row.Response+"</td>";
    table += "<td>"+row.createdAt+"</td>";
    table += "</tr>";
});
table += "</table>";
var options = {
  "format": "A1",
  "orientation": "landscape",
  "border": {
    "top": "0.1in",
},
"timeout": "120000"
};

pdf.create(table, options).toFile('public/Leads.pdf', function(err, result) {
  if (err) return console.log(err);
  res.download('public/Leads.pdf');
});
  });
  });

 
  router.get('/LeadExceldownload', function (req, res) {
    
    LeadModel.find({}).exec(function(err,Leads){
      if(err){
        console.error(err);
      }else{
       
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Leads'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          // { header: 'Id', key: '_id', width: 30 },
          { header: 'Oppurtunity Name',key: 'Oppurtunity_Name', width: 30},
          { header: 'Birth Date', key: 'Birth_Date', width: 30},
          { header: 'status', key: 'Status', width: 30},
          { header: 'lang', key: 'Lang', width: 30 },
          { header: 'source', key: 'Source', width: 30},
          { header: 'industry', key: 'Industry', width: 30 },
          { header: 'Rating Scoring', key: 'Rating_Scoring', width: 30},
          { header: 'Annual Revenue', key: 'Annual_Revenue', width: 30},
          { header: 'Referell Id', key: 'Referell_Id', width: 30, outlineLevel: 1},
          { header: 'Capture Date', key: 'Capture_Date', width: 30 },
          { header: 'Assigned To', key: 'Assigned_To', width: 30},
          { header: 'Phone', key: 'Phone', width: 30},
          { header: 'Email', key: 'Email', width: 30 },
          { header: 'Fax', key: 'Fax', width: 30},
          { header: 'Job Title', key: 'Job_Title', width: 30 },
          { header: 'Website', key: 'Website', width: 30},
          { header: 'Company', key: 'Company', width: 30},
          { header: 'Num of Emp', key: 'Num_of_Emp', width: 30, outlineLevel: 1},
          { header: 'Lead Name', key: 'Lead_Name', width: 30},
          { header: 'Lead Price', key: 'Lead_Price', width: 30 },
          { header: 'Lead Type', key: 'Lead_Type', width: 30},
          { header: 'Response', key: 'Response', width: 30 },
          { header: 'createdAt', key: 'createdAt', width: 30},
         
        ];
        
        for (const row of Leads) {
        worksheet.addRow(row);
    }
    worksheet.autoFilter = 'A1:G1';


    worksheet.eachRow(function (row, rowNumber) {

        row.eachCell((cell, colNumber) => {
            if (rowNumber == 1) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'f5b914' }
                }
            }
            
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        })
        
        row.commit();
    });

    const balDue = worksheet.getColumn('Oppurtunity_Name')
    balDue.eachCell((cell, rowNumber) => {
        if (cell.value >= 'A1'  ) {
            cell.fill = {
                type: 'gradient',
                gradient: 'angle',
                degree: 0,
                stops: [
                    { position: 0, color: { argb: 'ffffff' } },
                    { position: 0.5, color: { argb: 'cc8188' } },
                    { position: 1, color: { argb: 'fa071e' } }
                ]
            };
        }
    });
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + `Leads_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
        });
      
});


router.delete('/deleteLead',function(req,res){
  var query={
    _id:req.body.LeadId
  }
  MeetingModel.find({
    LeadId:req.body.LeadId
  }).exec(function(err,meeting){
    CallsModel.find({
      LeadId:req.body.LeadId
    }).exec(function(err1,call){
    if(err && err1){
      return res.status(400).json({
       message:'Bad Request'
      });
    }else if((meeting=='' || meeting==null || meeting=='undefined' || meeting==undefined) && (call=='' || call==null || call=='undefined' || call==undefined)){
  LeadModel.find({
    _id:req.body.LeadId
  }).exec(function(err,deleteLead){
     if(err){
       return res.status(400).json({
        message:'Bad Request'
       });
     }else if(deleteLead!='' || deleteLead!=null || deleteLead!='undefined' || deleteLead!=undefined){
      LeadModel.findOneAndRemove(query).exec(function(err,lead){
         if(err){
           return res.status(500).json({
             message:'Internal Server Error!!!....'
           });
         }else{
           res.json({
             status:200,
             data:lead,
             message:'Lead Deleted Successfully!!!....'
           });
         }

       });

     }
  });
}else if((meeting!=''  || meeting!=null  || meeting!='undefined'  || meeting!=undefined )&& (call!='' || call!=null || call!='undefined' || call!=undefined)){
  res.json({
    //status:200,
    data1:meeting,call,
    message:'Please remove Lead data in meeting  and  call!!!....'
  });

}
});
});


});

module.exports = router;
