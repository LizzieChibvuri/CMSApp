var dbconn=require("./dbconn.js");
var LocalStrategy   = require('passport-local').Strategy;
var sql=require('mssql')
var crypto=require('crypto')
var base64url=require('base64url')
var passwordHash=require('password-hash')
var nodemailer=require('nodemailer');

const email=require('./emailconfig.js');

let emailsender=new email();

class Members 
{

    selectMembers(callback)
    {
       // connect to your database
    dbconn.connect.then(function(err){
    
        if (err) console.log(err);

        // create Request object
        var request = dbconn.request;
           
        // query to the database and get the records
        request.query('select * from members', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            console.log(recordset);
            callback(null,recordset['recordset']);
        });
      });
    }

  
    insertMember(data,callback)
    {
        var firstname=data.firstname;
        var lastname=data.lastname;
        var username=data.username;
        var email=data.email;
        var password=data.password;
        var activatekey=base64url(crypto.randomBytes(20));

        
        const ps=dbconn.prepared;
        
         //declare input 
        ps.input('firstname',sql.VarChar(50));
        ps.input('lastname',sql.VarChar(50));
        ps.input('username',sql.VarChar(50));
        ps.input('email',sql.VarChar(50));
        //ps.input('dateregistered',sql.DateTime);
        ps.input('activatekey',sql.VarChar(150));
        ps.input('password',sql.VarChar(80));
           
          //query db to get records
        ps.prepare('insert into members(firstname,lastname,username,email,passwrd,activatekey) values(@firstname,@lastname,@username,@email,@password,@activatekey)', err=> {
          if(err){
            console.log('Failed to prepare members query:' + err);
            callback(err)
            return;
          }

            ps.execute({firstname: firstname,lastname: lastname,username: username,email: email,password:passwordHash.generate(password),activatekey:activatekey},(err,result)=>{
            if(err){
                    callback(err,null);
                return;

             }

            else if(result){
                // setup email data with unicode symbols
                // setup email data with unicode symbols
               var link="http://localhost:8080/activate?email="+email+"&key="+activatekey;
                var mailoptions = {
                from: '"Liz" lizdevtest@gmail.com',// sender address
                to: email, // list of receivers
                subject: 'Confirm Registration', // Subject line
                text: 'Hi '+firstname+' Please use this one time link to activate your account:', //, // plaintext body
                html: '<a href="'+link+'">Click here to activate account</a>' // You can choose to send an HTML body instead
                };


                emailsender.sendMail(mailoptions,function(err,result){
                    if(err){
                        console.log("Message sending error")
                        callback(err,null)
                    }

                    else if(result){
                        console.log("Message sent successfully")
                        callback(null,result)
                        
                    }


                })
                
                
               
                // console.log("user added successfuly");
                // callback(null,link);
            }

            ps.unprepare(err=> {
               if(err)
                console.log('error unpreparing statement' + err)

            });

           });
        });
    }


    updateMember(data,callback)
    {

        var firstname=data.firstname;
        var lastname=data.lastname;
        var username=data.username;
        var email=data.email;
        var password=data.password;

        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
        ps.input('firstname',sql.VarChar(50));
        ps.input('lastname',sql.VarChar(50));
        ps.input('username',sql.VarChar(50));
        ps.input('email',sql.VarChar(50));
        ps.input('password',sql.VarChar(80));

        //query db to get records
        ps.prepare('update members set firstname=@firstname, lastname=@lastname,username=@username,passwrd=@password where email=@email', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                callback(err,null)
                return;
            }
           
           ps.execute({firstname: firstname,lastname: lastname,username: username,password:passwordHash.generate(password),email: email},(err,result)=>{
                if(err){
                console.log('failure updating data',err);
                callback(err,null);
                return;
                }
            
                
                if(result.rowsAffected>0){
                    console.log('data updated successfully');
                    callback(null,result)
                }

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });           
    }


    activateMember(data,callback)
    {

        var key=data.key;
        var email=data.email;
        

        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
      
        ps.input('email',sql.VarChar(50));
        ps.input('key',sql.VarChar(100));

        //query db to get records
        ps.prepare('update members set status=1 where email=@email and activatekey=@key', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                callback(err,null)
                return;
            }
           
           ps.execute({email: email,key:key},(err,result)=>{
                if(err){
                console.log('failure updating data',err);
                callback(err,null)
                return;
                }
            

                if(result.rowsAffected>0){

                    //send email with link here
                    console.log('data updated successfully');
                    callback(null,result)
                }

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });           
    }


    forgotPassword(data,callback)
    {

        var key=base64url(crypto.randomBytes(5));
        var email=data.email;
      

        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
      
        ps.input('email',sql.VarChar(50));
        ps.input('key',sql.VarChar(100));
       

        //query db to get records
        ps.prepare('update members set forgetkey=@key where email=@email and status=1 ', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({email:email, key:key},(err,result)=>{
                if(err){
                console.log('failure updating data',err);
                callback(err,null)
                return;
                }
            

                if(result.rowsAffected>0){
                // setup email data with unicode symbols
                // setup email data with unicode symbols
               var link={link:"http://localhost:3000/resetpass.html",token:key};
               /*var mailoptions = {
                from: '"Liz" echibvuri4@gmail.com',// sender address
                to: email, // list of receivers
                subject: 'Confirm Registration', // Subject line
                text: 'Hi from'+firstname+' Please use this one time link to activate your account:' //, // plaintext body
                //html: '<a href="'+link+'">Click here to activate account</a>' // You can choose to send an HTML body instead
                };


                email.Send(emailoptions,function(err,result){
                    if(err){
                        console.log("Message sending error")
                        callback(err,null)
                    }

                    else if(result){
                        console.log("Message sent successfully")
                        callback(null,result)
                        
                    }


                })
                */
                    console.log('data updated successfully');
                    callback(null,'<p>Enter token:'+link.token+' to reset password </p><a href="'+link.link+'" id="get" onclick="document.getElementById(this.id).removeAttribute("href");">Click here link to activate account  </a>')
                }

                else{callback(null,'Error!Make sure account is activated or email supplied is correct ');}

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });           
    }



    



     passwordReset(data,callback)
    {

        var key=data.key;
        var email=data.email;
        var password=data.password;

        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
      
        ps.input('email',sql.VarChar(50));
        ps.input('key',sql.VarChar(100));
        ps.input('password',sql.VarChar(80));



        //query db to get records
        ps.prepare('update members set passwrd=@password where email=@email and status=1 and forgetkey=@key', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                callback(err,null);
                return;
            }
           
           ps.execute({email: email,password:passwordHash.generate(password),key:key},(err,result)=>{
                if(err){
                console.log('failure updating data',err);
                callback(err,null)
                return;
                }
            

                if(result.rowsAffected>0){
                    console.log('data updated successfully');
                    callback(null,'<h1>Congrats</h1><p>Password has been reset successfully</p>')
                }

                else{callback(null,'Error!Password could not be reset.Either email not activated/registered or invalid token!');}

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });           
    }



    deleteMember(email)
    {
        var email=email;
       
        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
        ps.input('email',sql.VarChar(50));

        //query db to get records
        ps.prepare('delete from members where email=@email', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({email: email},(err,result)=>{
                if(err){
                console.log('failure deleting data',err);
                return;
                }
            
                console.log(result);
                return result.rowsAffected;

                if(result.rowsAffected>0)console.log('data deleted successfully');

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });    
    }



    filterMembers(email)
      {
        var email=email;
       
        //create prepareStatement object 
        const ps=dbconn.prepared;
       
        //declare input 
        ps.input('email',sql.VarChar(50));

        //query db to get records
        ps.prepare('select * from members where email=@email', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({email: email},(err,result)=>{
                if(err){
                console.log('Failure executing query',err);
                return;
                }
            
                console.log(result);
                return result;

                if(result.rowsAffected>0)console.log('Search was successful');

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });    
        
    }




    authenticateMember(data,callback)
    {
        var email=data.email;
        var password=data.password;
        var verify=0;
       
        //create prepareStatement object 
        const ps=dbconn.prepared;


        
        //declare input 
        ps.input('email',sql.VarChar(50));
        //ps.input('password',sql.VarChar(80));


        //query db to get records
        ps.prepare('select email,passwrd from members where email=@email and status=1', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({email: email},(err,result)=>{
                if(err)
                {
                    callback(err,null)
                    return;
                }
                else if(result)
                {
                    var res=result.recordset[0].passwrd;
                    console.log('result from else if:' + res );

                    if(passwordHash.verify(password,res))
                    {
                       verify=1;
                       console.log('success');
                        callback(null,verify);
                    }
                    else{
                        console.log('failure');
                        callback(null,verify);
                     }

                   

                }
                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });    
        
    }
}


module.exports=Members;
