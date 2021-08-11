const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const excel = require("exceljs");
var ContactSchema = require("../../../../app/models/Contact");
var ContactModel = mongoose.model("contact");
var PDFDocument = require("pdfkit");
const path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');
const csv=require('csvtojson')
const multer = require('multer');

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


 router.post('/uploadcontactcsv', upload.single("uploadcsv"), (req, res) =>{
  importCsvData2MongoDB('./uploads/' + req.file.filename);
  res.json({
      'msg': 'File uploaded/import succesfully!', 'file': req.file
  });
});

function importCsvData2MongoDB(filePath){
  csv()
      .fromFile(filePath)
      .then((jsonObj)=>{
          ContactModel.insertMany(jsonObj, (err, res) => {
                 if (err) throw err; 
              });
    
          fs.unlinkSync(filePath);
      })
}


router.post('/addContacts',function(req,res){
    var addContacts = new ContactModel({
        UserName:req.body.UserName,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Phone_No:req.body.Phone_No,
        City:req.body.City,
        Current_Occupation:req.body.Current_Occupation,
        Industry_Interest:req.body.Industry_Interest,
        Educational_Qualification:req.body.Educational_Qualification,
        Assigned_To:req.body.Assigned_To
       
    });
    addContacts.save(function (err, result) {
      if (err) {
        return res.status(400).json({
          message:err
        });
      } else {
        res.json({
          status: 200,
          data: result
        })
      }

    });

});

router.get('/getContacts',function(req,res){
    ContactModel.find({}).exec(function(err,result){
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
  
  
router.put('/updatecontacts/:id',function(req,res){
    update = {
      $set: {
        UserName:req.body.UserName,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        Phone_No:req.body.Phone_No,
        City:req.body.City,
        Current_Occupation:req.body.Current_Occupation,
        Industry_Interest:req.body.Industry_Interest,
        Educational_Qualification:req.body.Educational_Qualification,
        Assigned_To:req.body.Assigned_To
      }
    };
    ContactModel.findByIdAndUpdate(req.params.id,update, function (err, Contacts) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: Contacts
          })
        }
  
      });
  
  
  });
  
  router.get("/contactPdfdownload", function (req, res) {
    ContactModel.find({}).exec(function (err, contacts) {
      if (err) throw err;
      const jsoncontacts = JSON.parse(JSON.stringify(contacts));
  
      var result = jsoncontacts;    
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr > Contacts";
table += "<th >Id</th>";
table += "<th >UserName";
table += "<th >FirstName";
table += "<th >LastName";
table += "<th >Email";
table += "<th >Phone_No";
table += "<th >City";
table += "<th >Current_Occupation";
table += "<th >Industry_Interest";
table += "<th >Educational_Qualification";
table += "<th >Assigned_To";
table += "</tr>";
result.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row._id+"</td>";
    table += "<td>"+row.UserName+"</td>";
    table += "<td>"+row.FirstName+"</td>";
    table += "<td>"+row.LastName+"</td>";
    table += "<td>"+row.Email+"</td>";
    table += "<td>"+row.Phone_No+"</td>";
    table += "<td>"+row.City+"</td>";
    table += "<td>"+row.Current_Occupation+"</td>";
    table += "<td>"+row.Industry_Interest+"</td>";
    table += "<td>"+row.Educational_Qualification+"</td>";
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

pdf.create(table, options).toFile('public/Contacts.pdf', function(err, result) {
  if (err) return console.log(err);
  res.download('public/Contacts.pdf');
});
  });
  });

 
  router.get('/contactExceldownload', function (req, res) {
    ContactModel.find({}).exec(function(err,Contacts){
      if(err){
        console.error(err);
      }else{
       
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Contacts'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          // { header: 'Id', key: '_id', width: 30 },
          { header: 'UserName', key: 'UserName', width: 30 },
          { header: 'FirstName', key: 'FirstName', width: 30},
          { header: 'LastName', key: 'LastName', width: 30},
          { header: 'Email', key: 'Email', width: 30 },
          { header: 'Phone_No', key: 'Phone_No', width: 30},
          { header: 'City', key: 'City', width: 30 },
          { header: 'Current_Occupation', key: 'Current_Occupation', width: 30},
          { header: 'Industry_Interest', key: 'Industry_Interest', width: 30},
          { header: 'Educational_Qualification', key: 'Educational_Qualification', width: 30},
          { header: 'Assigned_To', key: 'Assigned_To', width: 30, outlineLevel: 1}
        ];
        
        for (const row of Contacts) {
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
          "attachment; filename=" + `Contacts_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
        });
      
});


router.get("/searchcontact/:Email", function(req, res){
 ContactModel.find({Email:req.params.Email}).exec(function(err,result){
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

router.post('/deletecontact/:id',async(req,res)=>{
  var deletedata = await ContactModel.findByIdAndRemove(req.params.id)
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
