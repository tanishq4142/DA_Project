import "./UserInfo.css";
import axios from "axios";
import React, {useEffect,useState} from 'react';
import logo from './logo1.png';




const UserInfo=()=>{
    var usr_nm=localStorage.getItem('username');

    const [user,setUser]=useState({
        artistname:'',
        location:'',
        favsong:'',
        genderpref:''
    });

    useEffect(() => {
        find_all();
    }, []);

    const logout_func = () =>{
        window.location.href="loginpage";
    }





    const find_all=()=>{
        const url = `http://localhost:9995/getuserinfo?type=register&username=${usr_nm}&lastone=last`;
        axios.get(url).then(resp=>{
            if(resp.status==200){
                console.log(resp);
                
                for(var i=0;i<resp.data.length;i++){
                    let newOption = new Option(resp.data[i].ArtistName,resp.data[i].ArtistName);
                    document.getElementById("favartist").add(newOption,undefined);
                }
            }
            else{alert("Internal Server Error: Couldn't Fetch your Info..");}
        });    
        
    }

    const getsongs = (event) =>{
        var selectedfavartist=document.getElementById('favartist').value;
        if(selectedfavartist!='Please Select Your Favourite Artist'){
            user.artistname=selectedfavartist;
            
            const url = `http://localhost:9995/getsongs?type=register&username=${usr_nm}&artistname=${user.artistname}&lastone=last`;
            axios.get(url).then(resp=>{
                if(resp.status==200){
                    console.log(resp);
                    
                    for(var i=0;i<resp.data.length;i++){
                        let newOption = new Option(resp.data[i].SongName,resp.data[i].SongName);
                        document.getElementById("favsong").add(newOption,undefined);
                    }
                }
                else{alert("Internal Server Error: Couldn't Fetch your Info..");}
            });


        }
    }
    




    const handleSubmit=(e)=>{
        var selectedfavartist=document.getElementById('favartist').value;
        if(selectedfavartist=='Please Select Your Favourite Artist'){alert("Please Select Your Favourite Artist");return;}
        user.favartist=selectedfavartist;


        var selectedfavsong=document.getElementById('favsong').value;
        if(selectedfavsong=='Please Select Your Favourite Song'){alert("Please Select Your Favourite Song");return;}
        user.favsong=selectedfavsong;

        var selectedgender=document.getElementById('genderpref').value;
        if(selectedgender=='Please Select Your Gender Preference'){alert("Please Select Your Gender Preference");return;}
        
        user.genderpref="MALE";
        if(selectedgender=="Female"){
            user.genderpref="FEMALE";
        }
        

        e.preventDefault();
        if(user.favartist!="" && user.favsong!="" && user.genderpref!=""
        ){
        if(true){
            console.log(user);
        let headers = new Headers();
        
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
           
            headers.append('Origin','http://localhost:1086');
            headers.append('Access-Control-Allow-Origin', '*');
        


        const url = `http://localhost:9995/addmoreinfo?type=register&username=${usr_nm}&favartist=${user.favartist}&favsong=${user.favsong}&gender=${user.genderpref}&lastone=last`;
        axios.post(url,user).then(
            response => {
        console.log(response.status);
        if(response.status==200){
        alert("You have Added you Info successfully !");
        window.location.href='dashboard';
        }
        else{
            alert("Internal Server Error: Could not add your info !");
        }

        }
        ).then(
            html => console.log(html)
        );
        
        
        }else{
        alert("Re-Entered Password Doesn't Match the Password..");
        }
        
        
        
        }
        else{
        alert("Empty Feilds Are Not Allowed..");
        }
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

                   
                    
                    <div id="menus1"><a id="a22" href="/userinfo">Add Your Information</a></div>
                    
                    
                    
                </div>
                
                <h1 className="nwpadmin"> Hey! Excited to find the right person for you?</h1>

                <div id="sideimage">
                <img src={logo} alt="Logo" height="500px" width="850px"/>;
                     </div>
            
                <h1 className="nwpadminminor"> Tell us more about your preferences, So we can<br/>&nbsp;help you find your ideal match!</h1>
                
                <div id="takeinputs">
                <select id="favartist" onClick={getsongs}><option selected='true' hidden disabled='disabled' value='Please Select Your Favourite Artist'>Please Select Your Favourite Artist</option></select>
                <select id="favsong"><option selected='true' hidden disabled='disabled' value='Please Select Your Favourite Song'>Please Select Your Favourite Song</option></select>
                <select id="genderpref"><option selected='true' hidden disabled='disabled' value='Please Select Your Gender Preference'>Please Select Your Gender Preference</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                
                </select>
                
                </div>
                

                
                
                <button onClick={handleSubmit} id="find2" className="but_stylerersub">Submit</button>
                
        
        
                
        
                <div id="footerpggg">
                Copyright &copy; 2022 - Match (IT)
                </div>
            </div>
            </div>
        
    )
}
export default UserInfo;