const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const excel = require("exceljs");
var  CallsSchema= require("../../../../app/models/Calls");
var CallsModel = mongoose.model("calls");
var PDFDocument = require("pdfkit");
const path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');


router.post('/addCalls',function(req,res){
    var addCall = new CallsModel({
        Comment:req.body.Comment,
        LeadId:req.body.Lead_Name
    });
    addCall.save(function (err, result) {
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

router.get('/getallCalls',function(req,res){
    var view_data=[];
    CallsModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,call){
      if(err){
        console.error(err);
      }else if(call!='' || call!=undefined || call!='undefined' || call!=null){
        call.forEach(function(calls){
        view_data.push({
          _id : calls._id,
          Comment:calls.Comment,
          LeadId:calls.LeadId._id,
          Lead_Name:calls.LeadId.Lead_Name,
          
        })
    
      })
        res.json({
          status:200,
          data:view_data
          
        });
      }else{
        res.json({
          status:400
        });
      }
    });
    });
    
    

router.put('/updateCalls/:id',function(req,res){
    update = {
      $set: {
        Comment:req.body.Comment,
        LeadId:req.body.Lead_Name
       
      }
    };
    CallsModel.findByIdAndUpdate(req.params.id,update, function (err, result) {
        if (err) {
          console.error("err"+err)
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
  
  router.get("/CallsPdfdownload", function (req, res) {
    var view_data=[];
    CallsModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,call){
      if(err){
        console.error(err);
      }else if(call!='' || call!=undefined || call!='undefined' || call!=null){
        call.forEach(function(calls){
        view_data.push({
          CallId : calls._id,
          Comment:calls.Comment,
          LeadId:calls.LeadId._id,
          Lead_Name:calls.LeadId.Lead_Name,
          
        })
    
      })
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr >Calls";
table += "<th >CallId</th>";
table += "<th >Comment";
table += "<th >LeadId";
table += "<th >Lead_Name";
table += "</tr>";
view_data.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row.CallId+"</td>";
    table += "<td>"+row.Comment+"</td>";
    table += "<td>"+row.LeadId+"</td>";
    table += "<td>"+row.Lead_Name+"</td>";
    table += "</tr>";
});
table += "</table>";
var options = {
  "format": "A4",
  "orientation": "landscape",
  "border": {
    "top": "0.1in",
},
"timeout": "120000"
};

pdf.create(table, options).toFile('public/Calls.pdf', function(err, result) {
  if (err) return console.log(err);
  console.log("pdf create");
  res.download('public/Calls.pdf');
})
}
})
  })

 
  router.get('/CallsExceldownload', function (req, res) {
    var view_data=[];
    CallsModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,call){
      if(err){
        console.error(err);
      }else if(call!='' || call!=undefined || call!='undefined' || call!=null){
        call.forEach(function(calls){
        view_data.push({
          CallId : calls._id,
          Comment:calls.Comment,
          LeadId:calls.LeadId._id,
          Lead_Name:calls.LeadId.Lead_Name,
          
        })
    
      })
    
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Calls'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          { header: 'callId', key: 'CallId', width: 30 },
          { header: 'comment', key: 'Comment', width: 30},
          { header: 'leadId', key: 'LeadId', width: 30 },
          { header: 'lead Name', key: 'Lead_Name', width: 30, outlineLevel: 1}
        ];
        
        for (const row of view_data) {
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

    const balDue = worksheet.getColumn('Lead_Name')
    balDue.eachCell((cell, rowNumber) => {
        if (cell.value >= 'D1'  ) {
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
          "attachment; filename=" + `Calls_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
        });
      
    })

    router.get("/searchcalls/:Comment", function(req, res){
         CallsModel.find({Comment:req.params.Comment}).exec(function(err,result){
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

    router.post('/deletecalls/:id',async(req,res)=>{
        var deletedata = await CallsModel.findByIdAndRemove(req.params.id)
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
