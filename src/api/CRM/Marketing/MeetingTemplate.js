const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const excel = require("exceljs");
var MeetingSchema = require("../../../../app/models/Meeting");
var MeetingModel = mongoose.model("meeting");
var PDFDocument = require("pdfkit");
const path = require("path");
var fs = require("fs");
var pdf = require('html-pdf');

router.post('/addMeeting',function(req,res){
    var addMeeting = new MeetingModel({
        Date_Time:req.body.Date_Time,
        Title:req.body.Title,
        Comment:req.body.Comment,
        Invite_Email:req.body.Invite_Email,
        LeadId:req.body.Lead_Name
    });
    addMeeting.save(function (err, result) {
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

router.get('/getMeetings',function(req,res){
  var view_data=[];
  MeetingModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,meeting){
    if(err){
      console.error(err);
    }else if(meeting!='' || meeting!=undefined || meeting!='undefined' || meeting!=null){
      meeting.forEach(function(meetings){
      view_data.push({
        _id : meetings._id,
        Date_Time:meetings.Date_Time,
        Title:meetings.Title,
        Comment:meetings.Comment,
        Invite_Email:meetings.Invite_Email,
        LeadId:meetings.LeadId._id,
        Lead_Name:meetings.LeadId.Lead_Name,
        
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
  
  
router.put('/updatemeetings/:id',function(req,res){
    update = {
      $set: {
        Date_Time:req.body.Date_Time,
        Title:req.body.Title,
        Comment:req.body.Comment,
        Invite_Email:req.body.Invite_Email,
        LeadId:req.body.Lead_Name
      }
    };
    MeetingModel.findByIdAndUpdate(req.params.id,update, function (err, meeting) {
        if (err) {
          console.error("err"+err)
          return res.status(400).json({
            message: 'Bad Request'
          });
        } else {
          res.json({
            status: 200,
            data: meeting
          })
        }
  
      });
  });
  
  
  router.get("/meetingPdfdownload", function (req, res) {
    var view_data=[];
    MeetingModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,meeting){
      if(err){
        console.error(err);
      }else if(meeting!='' || meeting!=undefined || meeting!='undefined' || meeting!=null){
        meeting.forEach(function(meetings){
        view_data.push({
          MeetingId : meetings._id,
          Date_Time:meetings.Date_Time,
          Title:meetings.Title,
          Comment:meetings.Comment,
          Invite_Email:meetings.Invite_Email,
          LeadId:meetings.LeadId._id,
          Lead_Name:meetings.LeadId.Lead_Name,
          
        })
    
      })
var table 
table += "<table border='1' style='width:100%;word-break:break-word;'>";
table += "<tr >Meetings";
table += "<th >MeetingId</th>";
table += "<th >Date_Time";
table += "<th >Title";
table += "<th >Comment";
table += "<th >Invite_Email";
table += "<th >LeadId";
table += "<th >Lead_Name";
table += "</tr>";
view_data.forEach(function(row){
    table += "<tr>";
    table += "<td>"+row.MeetingId+"</td>";
    table += "<td>"+row.Date_Time+"</td>";
    table += "<td>"+row.Title+"</td>";
    table += "<td>"+row.Comment+"</td>";
    table += "<td>"+row.Invite_Email+"</td>";
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

pdf.create(table, options).toFile('public/Meetings.pdf', function(err, result) {
  if (err) return console.log(err);
  console.log("pdf create");
  res.download('public/Meetings.pdf');
})
}
})
  })

 
  router.get('/meetingExceldownload', function (req, res) {
    
    var view_data=[];
    MeetingModel.find({}).populate('LeadId', ['Lead_Name']).exec(function(err,meeting){
      if(err){
        console.error(err);
      }else if(meeting!='' || meeting!=undefined || meeting!='undefined' || meeting!=null){
        meeting.forEach(function(meetings){
        view_data.push({
          MeetingId : meetings._id,
          Date_Time:meetings.Date_Time,
          Title:meetings.Title,
          Comment:meetings.Comment,
          Invite_Email:meetings.Invite_Email,
          LeadId:meetings.LeadId._id,
          Lead_Name:meetings.LeadId.Lead_Name,
          
        })
    
      })
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Meetings'); 
        
        //  WorkSheet Header
        worksheet.columns = [
          // { header: 'meetingId', key: 'MeetingId', width: 30 },
          { header: 'Date Time', key: 'Date_Time', width: 30 },
          { header: 'title', key: 'Title', width: 30},
          { header: 'comment', key: 'Comment', width: 30},
          { header: 'Invite Email', key: 'Invite_Email', width: 30 },
          // { header: 'leadId', key: 'LeadId', width: 30},
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

    const balDue = worksheet.getColumn('Date_Time')
    balDue.eachCell((cell, rowNumber) => {
        if (cell.value <= 'A1'  ) {
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
          "attachment; filename=" + `Meetings_${Date.now()}.xlsx`
        );

        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
        });
      
    })

    router.get("/searchmeetings/:Title", function(req, res){
      MeetingModel.find({Title:req.params.Title}).exec(function(err,result){
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
    router.post('/deletemeeting/:id',async(req,res)=>{
      var deletedata = await MeetingModel.findByIdAndRemove(req.params.id)
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
