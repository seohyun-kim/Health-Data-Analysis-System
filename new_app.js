var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const moment = require('moment');

app.locals.pretty =true;
app.set('view engine','jade');
app.set('views', './views');//템플릿 디렉토리 지정


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var db = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : '',
    dateStrings:'date'
});
db.connect();

app.get('/login', (req, res,next) => {

    db.query(`SELECT DISTINCT patient_id,group_id FROM measuretemp_202102
      `, function(err,topics){
      if(err){
        console.log(err);
      }
      else{
        var i=0;
        var p_list=[];
        var g_list=[];
        while(i < topics.length)//갯수만큼 반복
        {
          p_list.push(topics[i].patient_id);
          g_list.push(topics[i].group_id);
          i = i + 1;
        }
      }
      res.render('lg_form',{
          p_list: JSON.stringify(p_list),
          g_list: JSON.stringify(g_list)
      });
    });


});

app.post('/login', (req, res, next) => {
    var group = req.body.group_id;
    var patient = req.body.patient_id;
    var from = req.body.startDate;
    var to = req.body.endDate;

    var temp=[];
    var date=[];

    if((from.length <1)&& (to.length <1)) //날짜 지정 안한 경우
    {
      db.query(`SELECT * FROM measuretemp_202102
        WHERE patient_id='${patient}' AND group_id='${group}'`, function(err,topics){
        if(err){
          console.log(err);
        }
        else{
          var i=0;
          while(i < topics.length)//갯수만큼 반복
          {
            temp.push(topics[i].temp);//온도 데이터 저장
            date.push(topics[i].reg_date);
            i = i + 1;
          }
          res.render('chart', {
            p_id: patient,
            temp: JSON.stringify(temp),
            date: JSON.stringify(date)
          });
        }
      });

    }
    else{//날짜 지정한
      db.query(`SELECT * FROM measuretemp_202102
        WHERE (patient_id='${patient}' AND group_id='${group}') AND (reg_date BETWEEN '${from}' AND '${to}' )`, function(err,topics){
        if(err){
          console.log(err);
        }
        else{
          var i=0;
          while(i < topics.length)//갯수만큼 반복
          {
            temp.push(topics[i].temp);//온도 데이터 저장
            date.push(topics[i].reg_date);
            i = i + 1;
          }
          res.render('chart', {
            p_id: patient,
            temp: JSON.stringify(temp),
            date: JSON.stringify(date)
          });
        }
      });

    }//else


});


app.listen(8000, () => {
    console.log('server is listening');
})
