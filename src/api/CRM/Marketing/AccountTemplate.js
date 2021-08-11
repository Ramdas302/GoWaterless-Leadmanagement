const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const excel = require("exceljs");
var AccountSchema = require("../../../../app/models/Account");
var AccountModel = mongoose.model("account");
var PDFDocument = require("pdfkit");
const path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');

router.post('/addAccounts',function(req,res){
    var addAccounts = new AccountModel({
        Account_Name:req.body.Account_Name,
        Account_Number:req.body.Account_Number,
        Website:req.body.Website,
        Industry:req.body.Industry,
        Phone:req.body.Phone,
        Address:req.body.Address,
        Email:req.body.Email,
        Assigned_To:req.body.Assigned_To,
       
    });
    addAccounts.save(function (err, result) {
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

router.get('/getAccounts',function(req,res){
  AccountModel.find({}).exec(function(err,result){
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
  
  
router.put('/updateAccounts/:id',function(req,res){
    update = {
      $set: {
        Account_Name:req.body.Account_Name,
        Account_Number:req.body.Account_Number,
        Website:req.body.Website,
        Industry:req.body.Industry,
        Phone:req.body.Phone,
        Address:req.body.Address,
        Email:req.body.Email,
        Assigned_To:req.body.Assigned_To,
      }
    };
    AccountModel.findByIdAndUpdate(req.params.id,update, function (err, Accounts) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: Accounts
          })
        }
  
      });
  });
  
  router.get("/accountPdfdownload", function (req, res) {
    AccountModel.find({}).exec(function (err, Accounts) {
      if (err) throw err;
      const jsonaccount = JSON.parse(JSON.stringify(Accounts));
      console.log(jsonaccount);
  
      var result = jsonaccount;    
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr > Contacts";
table += "<th >Id</th>";
table += "<th >Account_Name";
table += "<th >Account_Number";
table += "<th >Website";
table += "<th >Industry";
table += "<th >Phone";
table += "<th >Address";
table += "<th >Email";
table += "<th >Assigned_To";
table += "</tr>";
result.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row._id+"</td>";
    table += "<td>"+row.Account_Name+"</td>";
    table += "<td>"+row.Account_Number+"</td>";
    table += "<td>"+row.Website+"</td>";
    table += "<td>"+row.Industry+"</td>";
    table += "<td>"+row.Phone+"</td>";
    table += "<td>"+row.Address+"</td>";
    table += "<td>"+row.Email+"</td>";
    table += "<td>"+row.Assigned_To+"</td>";
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

pdf.create(table, options).toFile('public/Accounts.pdf', function(err, result) {
  if (err) return console.log(err);
  console.log("pdf create");
  res.download('public/Accounts.pdf');
});
  });
  });

 
  router.get('/accountExceldownload', function (req, res) {
    AccountModel.find({}).exec(function(err,Accounts){
      if(err){
        console.error(err);
      }else{
       
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Accounts'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          // { header: 'Id', key: '_id', width: 30 },
          { header: 'Account Name', key: 'Account_Name', width: 30 },
          { header: 'Account number', key: 'Account_Number', width: 30},
          { header: 'website', key: 'Website', width: 30},
          { header: 'industary', key: 'Industry', width: 30 },
          { header: 'phone', key: 'Phone', width: 30},
          { header: 'address', key: 'Address', width: 30 },
          { header: 'email', key: 'Email', width: 30},
          { header: 'assigned to', key: 'Assigned_To', width: 30, outlineLevel: 1}
        ];
        
        for (const row of Accounts) {
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

    const balDue = worksheet.getColumn('Email')
    balDue.eachCell((cell, rowNumber) => {
        if (cell.value >= 'G1'  ) {
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
          "attachment; filename=" + `Accounts_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
        });
      
});


router.get("/searchaccount/:Account_Name", function(req, res){
 AccountModel.find({Account_Name:req.params.Account_Name}).exec(function(err,result){
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

router.post('/deleteaccount/:id',async(req,res)=>{
  var deletedata = await AccountModel.findByIdAndRemove(req.params.id)
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
