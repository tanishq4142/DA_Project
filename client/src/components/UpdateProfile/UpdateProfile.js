import "./UpdateProfile.css";
import axios from "axios";
import React, {useEffect,useState} from 'react';



const UpdateProfile=()=>{
    var usr_nm=localStorage.getItem('username');

    const [user,setUser]=useState({
        artistname:'',
        genderpref:'',
        favsong:'',
        fav_song:'',
        name:'',
        gender:'',
        age:'',
        email:'',
        username:'',
        password:'',
        phn_no:'',
        igacc:''

    });

    useEffect(() => {
        init_func();
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
            user.username=response.data[0].username;
            
            user.password=response.data[0].password;

            user.phn_no=response.data[0].phn_no;
            user.email=response.data[0].email;
            user.igacc=response.data[0].igacc;

            document.getElementById("name").value=response.data[0].name;
            document.getElementById("gender").value=response.data[0].gender;
            document.getElementById("age").value=response.data[0].age;
            document.getElementById("phn_no").value=response.data[0].phn_no;
            document.getElementById("email").value=response.data[0].email;
            document.getElementById("igacc").value=response.data[0].igacc;
            document.getElementById("username").value=response.data[0].username;
            document.getElementById("password").value=response.data[0].password;
            
        
        }
        else{
            alert("Internal Server Error: Could not add your info !");
        }

        }
        ).then(
            html => console.log(html)
        );
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


        if(user.name!="" && user.email!="" && user.phn_no!="" && 
        user.username!="" &&
        user.password!="" &&
        user.gender!="" &&
        user.age!="" &&
        user.igacc!="" &&
        user.favartist!="" &&
        user.favsong!="" &&
        user.genderpref!=""
        ){
        if(true){
            
        let headers = new Headers();
        
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
           
            headers.append('Origin','http://localhost:1086');
            headers.append('Access-Control-Allow-Origin', '*');
        

           

        const url = `http://localhost:9995/updateprofile?type=register&igacc=${user.igacc}&name=${user.name}&gender=${user.gender}&phn=${user.phn_no}&email=${user.email}&pass=${user.password}&favartist=${user.favartist}&favsong=${user.favsong}&genderpref=${user.genderpref}&lastest=ooop&age=${user.age}&user_name=${user.username}&lastone=last`;
        axios.post(url,user).then(
            response => {
        console.log(response.status);
        if(response.status==200){
        alert("You have Updated Your Profile successfully");
        window.location.href='dashboard';
        }else{
            alert("Internal Server Error: Could not update your info!");
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
       

const handleChange=(event)=>{
       
    var name1=event.target.id;
    var value1=event.target.value;

    setUser({
        ...user,
        [name1]: value1
    })


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

                    <div id="menus1userprofile"><a id="a22" href="/dashboard">Dashboard</a></div>

                    <div id="menus2userprofile"><a id="a22" href="/updateprofile">Update Profile</a></div>
                </div>
                <div id="inlinuserprofile">
                <h1 id="getterlineuserprofile">Update Your Profile Below!</h1>
                </div>


                
        <table id="mno">
            <tr id="mnorows">
            <td><label>Your Name:</label></td><td>
            <input type="text" id="name" onChange={handleChange} value={user.company_name} disabled></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Gender:</label></td><td>
            <input type="text" id="gender" onChange={handleChange} value={user.company_website} disabled></input></td>
            </tr>
            <tr id="mnorows">
            <td>
            <label>Your Email:</label></td><td>
            <input type="text" id="email" onChange={handleChange} value={user.sector} disabled></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Username:</label></td><td>
            <input type="text" id="username" onChange={handleChange} value={user.test_mode} disabled></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Password:</label></td><td>
            <input type="text" id="password" onChange={handleChange} value={user.final_selection} disabled></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Age:</label></td><td>
            <input type="text" id="age" onChange={handleChange} value={user.accept_offer_in_days}></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Phone Number:</label></td><td>
            <input type="text" id="phn_no" onChange={handleChange} value={user.reg_link}></input></td>
            </tr>
            <tr id="mnorows">
            <td><label>Your Instagram Handle:</label></td><td>
            <input type="text" id="igacc" onChange={handleChange} value={user.job_description}></input></td>
            </tr>
            
            <tr id="mnorows">
            <td><label>Your Favourite Artist:</label></td><td>
            <select id="favartist" onClick={getsongs}><option selected='true' hidden disabled='disabled' value='Please Select Your Favourite Artist'>Please Select Your Favourite Artist</option></select>
            </td>
            </tr>

            <tr id="mnorows">
            <td><label>Your Favourite Song:</label></td><td>
            <select id="favsong"><option selected='true' hidden disabled='disabled' value='Please Select Your Favourite Song'>Please Select Your Favourite Song</option></select>
            </td>
            </tr>
                        
            <tr id="mnorows">
            <td><label>Your Gender Preference:</label></td><td>
            <select id="genderpref"><option selected='true' hidden disabled='disabled' value='Please Select Your Gender Preference'>Please Select Your Gender Preference</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                </select></td>
            </tr>
            <tr>
                <button onClick={handleSubmit} className="but_stylererdashupdate">Update Profile</button>
            </tr>


            
                



            </table>





                <div id="footerpggg">
                Copyright &copy; 2022 - Match (IT)
                </div>
            </div>
            </div>
        
    )
}
export default UpdateProfile;