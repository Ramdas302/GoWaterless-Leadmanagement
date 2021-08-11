const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const excel = require("exceljs");
const multer = require('multer');
var  ProposalSchema= require("../../../../app/models/Proposal");
var ProposalModel = mongoose.model("proposal");
var PDFDocument = require("pdfkit");
const path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');

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

router.post('/addProposal',upload.single('file'),function(req,res,next){
  const url = req.protocol + '://' + req.get('host')
    var addProposal = new ProposalModel({
        Title:req.body.Title,
        Amount:req.body.Amount,
        Description:req.body.Description,
        File_Attachment: url + '/uploads/' + req.file.filename,
        Date:req.body.Date,
        NextCall_Date_Comment:req.body.NextCall_Date_Comment,
        Status:req.body.Status
    });
    addProposal.save(function (err, result) {
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


  router.get('/getallProposal',function(req,res){
    ProposalModel.find({}).exec(function(err,result){
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
  

router.put('/updateproposal/:id',upload.single('file'),function(req,res){
    update = {
      $set: {
        Title:req.body.Title,
        Amount:req.body.Amount,
        Description:req.body.Description,
        Date:req.body.Date,
        NextCall_Date_Comment:req.body.NextCall_Date_Comment,
        Status:req.body.Status
      }
    };
    ProposalModel.findByIdAndUpdate(req.params.id,update, function (err, result) {
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
  
  router.get("/ProposalPdfdownload", function (req, res) {
    ProposalModel.find({}).exec(function (err, proposal) {
      if (err) throw err;
      const jsonproposal = JSON.parse(JSON.stringify(proposal));
      console.log(jsonproposal);
  
      var result = jsonproposal;    
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr > Proposal";
table += "<th >Id</th>";
table += "<th >Title";
table += "<th >Amount";
table += "<th >Description";
table += "<th >File_Attachment";
table += "<th >Date";
table += "<th >NextCall_Date_Comment";
table += "<th >Status";
table += "</tr>";
result.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row._id+"</td>";
    table += "<td>"+row.Title+"</td>";
    table += "<td>"+row.Amount+"</td>";
    table += "<td>"+row.Description+"</td>";
    table += "<td>"+row.File_Attachment+"</td>";
    table += "<td>"+row.Date+"</td>";
    table += "<td>"+row.NextCall_Date_Comment+"</td>";
    table += "<td>"+row.Status+"</td>";
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

pdf.create(table, options).toFile('public/Proposal.pdf', function(err, result) {
  if (err) return console.log(err);
  console.log("pdf create");
  res.download('public/Proposal.pdf');
});
  });
  });


 
  router.get('/ProposalExceldownload', function (req, res) {
    
    ProposalModel.find({}).exec(function (err, proposal) {
        if (err) throw err;
        const jsonproposal = JSON.parse(JSON.stringify(proposal));
        console.log(jsonproposal);
    
        var result = jsonproposal;  
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Proposals'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          { header: 'Title', key: 'Title', width: 30 },
          { header: 'amount', key: 'Amount', width: 30},
          { header: 'description', key: 'Description', width: 30},
          { header: 'file', key: 'File_Attachment', width: 30 },
          { header: 'date', key: 'Date', width: 30},
          { header: 'next call-date/comment', key: 'NextCall_Date_Comment', width: 30},
          { header: 'status', key: 'Status', width: 30, outlineLevel: 1}
        ];
        
        for (const row of result) {
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

    const balDue = worksheet.getColumn('Date')
    balDue.eachCell((cell, rowNumber) => {
        if (cell.value <= 'E1'  ) {
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
          "attachment; filename=" + `Proposals_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      
    })
      
    })

    router.get("/searchproposals/:Title", function(req, res){
       ProposalModel.find({Title:req.params.Title}).exec(function(err,result){
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
  
    router.post('/deleteproposal/:id',async(req,res)=>{
        var deletedata = await ProposalModel.findByIdAndRemove(req.params.id)
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
