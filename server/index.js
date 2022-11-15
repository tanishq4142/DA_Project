var express=require('express');
var app=express();
var url=require('url');
var axios=require('axios');
var MongoClient=require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const formidable = require('formidable');
const http = require('http');
const FormData = require('form-data');
const { PassThrough } = require('stream');
const { exec } = require("child_process");


var cors=require("cors");
app.use(cors());
var mysql = require('mysql');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var con = mysql.createConnection({
  host: "0.0.0.0",
  user: "root",
  password: "tanishq",
  database:"DA_Project"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});







app.post('/register',function(req,res){
console.log('Registration Received');


console.log("Connected to Mysql");
var obj=url.parse(req.url,true).query;
console.log(obj);

var newsqql=`SELECT * FROM users where username="${obj.user_name}"`;
con.query(newsqql,function(errq,resq,fields){
if(errq){throw errq;}
if(resq.length!=0){
res.status(263).send('Username taken');
return;
}

var sql = `INSERT INTO users VALUES ("${obj.name}","${obj.phn}","${obj.email}","${obj.gender}","${obj.age}","${obj.user_name}","${obj.pass}","${obj.igacc}")`;

con.query(sql,function(err,res1){
if(err){throw err;}
console.log("1 record inserted in users table");
res.setHeader('Access-Control-Allow-Origin','*');
res.status(200).send('Registration Successful');

});
});

});




app.post('/getuserpreferencesong',function(req,res){
console.log("GET user preference info request received");
var obj=url.parse(req.url,true).query;

var sql=`SELECT * FROM user_preference where username="${obj.username}"`;
con.query(sql,function(err2,res2,fields){
if(err2){throw err2;}

var song_name=res2[0].fav_song;

var sql2=`SELECT * FROM songs WHERE SongName="${song_name}"`;
con.query(sql2,function(err3,res3,fields){
if(err3){throw err3;}
res.status(200).send(res3);
});

});


});


app.post('/updateprofile',function(req,res){
console.log("Update profile request received");
var obj=url.parse(req.url,true).query;

var sql=`UPDATE users SET phn_no=${obj.phn},age=${obj.age},igacc="${obj.igacc}" WHERE username="${obj.user_name}"`;
con.query(sql,function(err,res2){
if(err){throw err;}

var sql2=`UPDATE user_preference SET fav_artist="${obj.favartist}",fav_song="${obj.favsong}",gender_preference="${obj.genderpref}" WHERE username="${obj.user_name}"`;
con.query(sql2,function(err2,res3){
if(err2){throw err2;}
res.status(200).send("success");
});

});


});




app.get('/getuserinfo',function(req,res){
console.log("GET user info request received");
var obj=url.parse(req.url,true).query;
var sql=`SELECT DISTINCT(ArtistName) from songs ORDER BY ArtistName ASC`;
con.query(sql,function(err,res2,fields){
if(err){throw err;}
res.status(200).send(res2);
});
});

app.get('/getsongs',function(req,res){
console.log("GET songs info request received");
var obj=url.parse(req.url,true).query;
var sql=`SELECT DISTINCT(SongName) from songs WHERE ArtistName="${obj.artistname}" ORDER BY SongName ASC`;
con.query(sql,function(err,res2,fields){
if(err){throw err;}
res.status(200).send(res2);
});
});

app.post('/addmoreinfo',function(req,res){
console.log("GET songs info request received");
var obj=url.parse(req.url,true).query;
var sql=`INSERT INTO user_preference VALUES("${obj.username}","${obj.favartist}","${obj.favsong}","${obj.gender}")`;
con.query(sql,function(err,res2){
if(err){throw err;}
res.status(200).send("success");
});
});





app.post('/getuserdata',function(req,res){
console.log("GET user data request received");
var obj=url.parse(req.url,true).query;

var sql=`SELECT * FROM users,user_preference WHERE users.username="${obj.username}" AND users.username=user_preference.username`;
con.query(sql,function(err,res2,fields){
if(err){throw err;}
res.status(200).send(res2);
});


});









app.post('/login', function (req, res) {
  console.log('Login Request Received...');


  var obj = url.parse(req.url, true).query;
  console.log(obj);
  console.log('user is ');
  console.log(obj.users);
  console.log('pass is ');
  console.log(obj.pass);

  var sql = `SELECT * from users WHERE username="${obj.users}"`;
  
con.query(sql,function(err,res2,fields){
if(err){throw err;}
if(res2.length==0){
res.status(201).send('Have not registered');
return;
}

var found=0;

for(var i=0;i<res2.length;i++){
if(res2[i].password==obj.pass){
var found=1;
}
}

if(found==1){

var sql5=`SELECT * FROM user_preference WHERE username="${obj.users}"`;
con.query(sql5,function(err8,res8,fields){
if(err8){throw err8;}
if(res8.length==0){
console.log(234);
res.status(234).send("Go to userinfo");
return;
}
else{
console.log(200);
res.status(200).send("Go to dashboard");
return;
}
});


}else{
res.status(208).send('Incorrect password');
return;
}

});
});


app.post('/getmyinfo',function(req,res){
console.log('Login Request Received...');
var obj = url.parse(req.url, true).query;

var sql=`SELECT * FROM users,user_preference WHERE users.username="${obj.username}" AND users.username=user_preference.username`;
con.query(sql,function(err2,res2,fields){
if(err2){throw err2;}
res.status(200).send(res2);

});
});



app.post('/predictusers',function(req,res){
console.log('Login Request Received...');
var obj = url.parse(req.url, true).query;

var gen=`SELECT * FROM user_preference WHERE username="${obj.username}"`;
con.query(gen,function(err8,res8,fields){
if(err8){throw err8;}
var mygender=res8[0].gender_preference;



var sql=`SELECT * from users,user_preference WHERE user_preference.fav_song="${obj.usersong}" AND users.username=user_preference.username AND users.gender="${mygender}"`;
con.query(sql,function(err2,res2,fields){
if(err2){throw err2;}
res.status(200).send(res2);

});


});


});







app.post('/predict',function(req,res){
console.log('Predict Request Received...');
var obj = url.parse(req.url, true).query;

var favsong=obj.favsong;
var currcall=obj.currcall;

console.log("currcall is:");
console.log(currcall);
var cmd=`python3 Cosine_Similarity.py "${favsong}"`;

if(currcall=="dbscan"){
cmd=`python3 dbscan.py "${favsong}"`;
}

if(currcall=="knn"){
cmd=`python3 KNN_Similarity.py "${favsong}"`;
}

if(currcall=="euclidian"){
cmd=`python3 Euclidian.py "${favsong}"`;
}


console.log("Command to be executed is:");
console.log(cmd);

exec(cmd,(error,stdout,stderr)=>{

 if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
res.status(200).send(stdout);

});





});











console.log('server running at 9995..');
app.listen(9995);