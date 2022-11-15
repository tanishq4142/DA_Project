import "./Dashboard.css";
import axios from "axios";
import React, {useEffect,useState} from 'react';
import logo from './logo5.png';
import { useResolvedPath } from "react-router-dom";


const Dashboard=()=>{
    var usr_nm=localStorage.getItem('username');

    const [user,setUser]=useState({
        artistname:'',
        location:'',
        favsong:'',
        fav_song:'',
        name:'',
        gender:'',
        age:'',
        predictedsongs:'',
        count:0,
        predictedusers:'',
        alredypredicted:'',
        curr_call:-1,
        users_arr:[]
    });

    useEffect(() => {
        init_func();
    }, []);

    const logout_func = () =>{
        window.location.href="loginpage";
    }



    const init_func = () => {
            
        const url = `http://localhost:9995/getmyinfo?type=register&username=${usr_nm}&lastone=last`;
        axios.post(url,user).then(
            response => {
        console.log(response.status);
        if(response.status==200){
        console.log(response.data);
            user.name=response.data[0].name;
            user.gender=response.data[0].gender;
            user.age=response.data[0].age;
            user.location=response.data[0].location;
            user.artistname=response.data[0].fav_artist;
            user.favsong=response.data[0].fav_song;

            var phn_no=response.data[0].phn_no;
            var email=response.data[0].email;
            var igacc=response.data[0].igacc;
            if(user.gender=="MALE"){
            document.getElementById("leftcard").innerHTML=`<div id='mycards'><span id="newspanname">${user.name}</span><span id="tierspanadmin"></span><span id="s18name">${user.gender}</span><p><span id="s1name">${user.age}</span></p><span id="s299name">Interests: &nbsp; ${user.favsong}</span><span id="s399name">${user.artistname}</span><span id="myspanig">IG : ${igacc}</span><span id="myspanphn">Phn : ${phn_no}</span><br/><br/></div>`;
            }else{
                document.getElementById("leftcard").innerHTML=`<div id='mycards'><span id="newspanname">${user.name}</span><span id="tierspanadmin"></span><span id="s18namefemale">${user.gender}</span><p><span id="s1namefemale">${user.age}</span></p><span id="s299name">Interests: &nbsp; ${user.favsong}</span><span id="s399name">${user.artistname}</span><span id="myspanigfemale">IG : ${igacc}</span><span id="myspanphnfemale">Phn : ${phn_no}</span><br/><br/></div>`;
             
            }
        user.curr_call=-1;
        }
        else{
            alert("Internal Server Error: Could not add your info !");
        }

        }
        ).then(
            html => console.log(html)
        );
    }


    const print_func = () =>{

        window.scrollTo({top: 1750, behavior: 'smooth'});
        document.getElementById("Predictionheading").style.display="block";
        console.log("Inside Print Function");
        document.getElementById("toshowpredictions").innerHTML=``;
        
        var pred_users=user.predictedusers.split(";");
        if(pred_users.length==0 || pred_users.length==1){
            document.getElementById("toshowpredictions").innerHTML=`<span id="noconnections">No matches Found!<br/></span><span id="noconnections2">Please change your preferences and try again!</span>`;
        }
        user.count=1;
        for(var t=0;t<pred_users.length-1;t++){

            const url4 = `http://localhost:9995/getuserdata?type=register&username=${pred_users[t]}&lastone=last`;

            axios.post(url4,user).then(
                response => {
            console.log(response.status);
            if(response.status==200){
                console.log(response.data);
                
                for(var cnt=0;cnt<response.data.length;cnt++){
                document.getElementById("toshowpredictions").innerHTML+=`<div id='cards${user.count+1}'><span id="cardnum">${user.count}</span><span id="newspanpredict">${response.data[cnt].name}</span><span id="tierspanadmin"></span><span id="s18predict">${response.data[cnt].gender}</span><p><span id="s1predict">${response.data[cnt].age}</span></p><span id="s299predict">Interests: &nbsp; ${response.data[cnt].fav_song}</span><span id="s399predict">${response.data[cnt].fav_artist}</span><span id="newspanig">IG : ${response.data[cnt].igacc}</span><span id="newspanphn">Phn : ${response.data[cnt].phn_no}</span><br/><br/></div>`;               
                    user.count=user.count+1;
            } }
            else{
                alert("Internal Server Error: Could not add your info !");
            }
    
            }
            ).then(
                html => console.log(html)
            );



        }

    }


    const handleSubmit=()=>{
            console.log(user);
            let headers = new Headers();
        
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('Origin','http://localhost:1086');
            headers.append('Access-Control-Allow-Origin', '*');
        

        

        const url = `http://localhost:9995/getuserpreferencesong?type=register&username=${usr_nm}&lastone=last`;
        axios.post(url,user).then(
            response => {
        console.log(response.status);
        if(response.status==200){
        console.log(response.data);
            console.log(response.data);
            user.fav_song=response.data[0].SongName;


//Cosine Similarity begin

user.users_arr=[];

            const url2 = `http://localhost:9995/predict?type=register&username=${usr_nm}&favsong=${user.fav_song}&currcall=cosine&lastone=last`;


            axios.post(url2,user).then(
                response => {
            console.log(response.status);
            if(response.status==200){
            console.log(response.data);
                console.log(response.data.split("\n"));
                var arr=response.data.split("\n");
                user.predictedsongs='';
                for(var i=0;i<arr.length-1;i++){
                    var str=arr[i];
                    var found=1;
                    for(var g=0;g<str.length-1;g++){
                        if(str.charCodeAt(g)<32 || str.charCodeAt(g)>126){found=0;break;}
                        else if(str.charCodeAt(g)==34 || str.charCodeAt(g)==39 || str.charCodeAt(g)==96){
                            found=0;break;
                        }
                    }
                    console.log(found);
                    if(found==1){
                    user.predictedsongs=user.predictedsongs+arr[i]+";";}
                }



                console.log(user.predictedsongs);


                var similar_songs=user.predictedsongs.split(";");
                user.predictedusers="";

                for(var j=0;j<similar_songs.length-1;j++){
        
                const url3 = `http://localhost:9995/predictusers?type=register&username=${usr_nm}&usersong=${similar_songs[j]}&lastone=last`;
        
                axios.post(url3,user).then(
                    response => {
                console.log(response.status);
                if(response.status==200){
                    console.log(response.data);
                    for(var p=0;p<response.data.length;p++){
                    if(user.users_arr.includes(response.data[p].username)==false){
                    user.predictedusers=user.predictedusers+response.data[p].username+";";}
                    console.log(user.predictedusers);
                    user.users_arr.push(response.data[p].username);}
                }
                else{
                    alert("Internal Server Error: Could not add your info !");
                }
        
                }
                ).then(
                    html => console.log(html)
                );
        
        
        
                }





    
            }
            else{
                alert("Internal Server Error: Could not add your info !");
            }
    
            }
            ).then(
                html => console.log(html)
            );


var pred_users=user.predictedusers.split(";");
if(pred_users.length>=4){
    return;
}
//cosine similarity end

//dbscan start
user.users_arr=[];
user.predictedsongs="";
user.predictedusers="";


const url4 = `http://localhost:9995/predict?type=register&username=${usr_nm}&favsong=${user.fav_song}&currcall=dbscan&lastone=last`;


            axios.post(url4,user).then(
                response => {
            console.log(response.status);
            if(response.status==200){
            console.log(response.data);
                console.log(response.data.split("\n"));
                var arr=response.data.split("\n");
                user.predictedsongs='';
                for(var i=0;i<arr.length-1;i++){
                    var str=arr[i];
                    var found=1;
                    for(var g=0;g<str.length-1;g++){
                        if(str.charCodeAt(g)<32 || str.charCodeAt(g)>126){found=0;break;}
                        else if(str.charCodeAt(g)==34 || str.charCodeAt(g)==39 || str.charCodeAt(g)==96){
                            found=0;break;
                        }
                    }
                    console.log(found);
                    if(found==1){
                    user.predictedsongs=user.predictedsongs+arr[i]+";";}
                }



                console.log(user.predictedsongs);


                var similar_songs=user.predictedsongs.split(";");
                user.predictedusers="";

                for(var j=0;j<similar_songs.length-1;j++){
        
                const url3 = `http://localhost:9995/predictusers?type=register&username=${usr_nm}&usersong=${similar_songs[j]}&lastone=last`;
        
                axios.post(url3,user).then(
                    response => {
                console.log(response.status);
                if(response.status==200){
                    console.log(response.data);
                    for(var p=0;p<response.data.length;p++){
                        if(user.users_arr.includes(response.data[p].username)==false){
                    user.predictedusers=user.predictedusers+response.data[p].username+";";}
                    console.log(user.predictedusers);
                    user.users_arr.push(response.data[p].username);}
                }
                else{
                    alert("Internal Server Error: Could not add your info !");
                }
        
                }
                ).then(
                    html => console.log(html)
                );
        
        
        
                }





    
            }
            else{
                alert("Internal Server Error: Could not add your info !");
            }
    
            }
            ).then(
                html => console.log(html)
            );





            var pred_users2=user.predictedusers.split(";");
            if(pred_users2.length>=4){
                return;
            }



// dbscan end

//KNN start
user.users_arr=[];
user.predictedsongs="";
user.predictedusers="";



const url5 = `http://localhost:9995/predict?type=register&username=${usr_nm}&favsong=${user.fav_song}&currcall=knn&lastone=last`;


            axios.post(url5,user).then(
                response => {
            console.log(response.status);
            if(response.status==200){
            console.log(response.data);
                console.log(response.data.split("\n"));
                var arr=response.data.split("\n");
                user.predictedsongs='';
                for(var i=0;i<arr.length-1;i++){
                    var str=arr[i];
                    var found=1;
                    for(var g=0;g<str.length-1;g++){
                        if(str.charCodeAt(g)<32 || str.charCodeAt(g)>126){found=0;break;}
                        else if(str.charCodeAt(g)==34 || str.charCodeAt(g)==39 || str.charCodeAt(g)==96){
                            found=0;break;
                        }
                    }
                    console.log(found);
                    if(found==1){
                    user.predictedsongs=user.predictedsongs+arr[i]+";";}
                }



                console.log(user.predictedsongs);


                var similar_songs=user.predictedsongs.split(";");
                user.predictedusers="";

                for(var j=0;j<similar_songs.length-1;j++){
        
                const url3 = `http://localhost:9995/predictusers?type=register&username=${usr_nm}&usersong=${similar_songs[j]}&lastone=last`;
        
                axios.post(url3,user).then(
                    response => {
                console.log(response.status);
                if(response.status==200){
                    console.log(response.data);
                    for(var p=0;p<response.data.length;p++){
                        if(user.users_arr.includes(response.data[p].username)==false){
                    user.predictedusers=user.predictedusers+response.data[p].username+";";}
                    console.log(user.predictedusers);
                    user.users_arr.push(response.data[p].username);}
                }
                else{
                    alert("Internal Server Error: Could not add your info !");
                }
        
                }
                ).then(
                    html => console.log(html)
                );
        
        
        
                }





    
            }
            else{
                alert("Internal Server Error: Could not add your info !");
            }
    
            }
            ).then(
                html => console.log(html)
            );




            var pred_users3=user.predictedusers.split(";");
            if(pred_users3.length>=4){
                return;
            }


//KNN end 





//Euclidian start
user.users_arr=[];
user.predictedsongs="";
user.predictedusers="";

const url6 = `http://localhost:9995/predict?type=register&username=${usr_nm}&favsong=${user.fav_song}&currcall=euclidian&lastone=last`;


            axios.post(url6,user).then(
                response => {
            console.log(response.status);
            if(response.status==200){
            console.log(response.data);
                console.log(response.data.split("\n"));
                var arr=response.data.split("\n");
                user.predictedsongs='';
                for(var i=0;i<arr.length-1;i++){
                    var str=arr[i];
                    var found=1;
                    for(var g=0;g<str.length-1;g++){
                        if(str.charCodeAt(g)<32 || str.charCodeAt(g)>126){found=0;break;}
                        else if(str.charCodeAt(g)==34 || str.charCodeAt(g)==39 || str.charCodeAt(g)==96){
                            found=0;break;
                        }
                    }
                    console.log(found);
                    if(found==1){
                    user.predictedsongs=user.predictedsongs+arr[i]+";";}
                }



                console.log(user.predictedsongs);


                var similar_songs=user.predictedsongs.split(";");
                user.predictedusers="";

                for(var j=0;j<similar_songs.length-1;j++){
        
                const url3 = `http://localhost:9995/predictusers?type=register&username=${usr_nm}&usersong=${similar_songs[j]}&lastone=last`;
        
                axios.post(url3,user).then(
                    response => {
                console.log(response.status);
                if(response.status==200){
                    console.log(response.data);
                    for(var p=0;p<response.data.length;p++){
                        if(user.users_arr.includes(response.data[p].username)==false){
                    user.predictedusers=user.predictedusers+response.data[p].username+";";
                    user.users_arr.push(response.data[p].username);
                }
                    console.log(user.predictedusers);}
                }
                else{
                    alert("Internal Server Error: Could not add your info !");
                }
        
                }
                ).then(
                    html => console.log(html)
                );
        
        
        
                }





    
            }
            else{
                alert("Internal Server Error: Could not add your info !");
            }
    
            }
            ).then(
                html => console.log(html)
            );


//Euclidian end






        }
        else{
            alert("Internal Server Error: Could not add your info !");
        }

        }
        ).then(
            html => console.log(html)
        );
        
        }



const scroll_func = () =>{
    window.scrollTo({top: 775, behavior: 'smooth'});
}




    

    return(
        <div id="highest"> 
        <div id="rootdiv">
                <div id="topmenu">
                    <div id="tagname">Match (IT)</div>
                    <div className="dropdown">Hello, {usr_nm}!
                    <div className="dropdown-content" onClick={logout_func}>
                    <p>Log Out</p>
                    </div></div>

                    <div id="menus1user"><a id="a22" href="/dashboard">Dashboard</a></div>

                    <div id="menus2user"><a id="a22" href="/updateprofile">Update Profile</a></div>
                </div>
                <div id="inlin">
                <h1 id="getterline">Excited to Find Your<br/> Ideal Match ?</h1>
                <h2 id="secondline">Find Someone who is as crazy as you, as funny<br/> as you, but not as perfect as you. Coz<br/> you two together define perfect !</h2>
                <button onClick={scroll_func} id="getstartedbtn" className="but_stylerergetstarted">Get Started</button>
                </div>
                
                <div id="dashimage">
                <img src={logo} alt="Logo" height="550px" width="950px"/>;
                     </div>
                <h1 id="middlehead">Find Your Match!</h1>
                <div id="middle">
                    <div id="leftcard"></div>
                    <div id="matchdiv">
                     <h2 id="myinfo">Don't waste time in finding your soulmate !<br/> Who knows if the soulmates might also <br/>change if you delay !<br/>You have filled the fuel in the car,<br/> Now is the time to accelerate my friend !</h2>   
                    </div>
                </div>
                <button onClick={handleSubmit} id="find2" className="but_stylererdash">Predict</button>
                <button onClick={print_func} id="find2" className="but_stylererdashprint">Print</button>
                
                <h1 id="Predictionheading">Find Your Ideal Matches Below!</h1>

                <div id="toshowpredictions"></div>
        
                <div id="footerpggg">
                Copyright &copy; 2022 - Match (IT)
                </div>
            </div>
            </div>
        
    )
}
export default Dashboard;