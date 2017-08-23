var LocalStrategy   = require('passport-local').Strategy;
var passport=require('passport');
var dbconn=require("./dbconn.js");
var LocalStrategy   = require('passport-local').Strategy;
var sql=require('mssql')
var crypto=require('crypto')
var base64url=require('base64url')
var passwordHash=require('password-hash')
var nodemailer=require('nodemailer');

const email=require('./emailconfig.js');

let emailsender=new email();


module.exports = function(passport) 
{

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(email, done) 
    {
        done(null, email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) 
    {
    	console.log('Email:'+email);

    	ps=dbconn.prepared;
    	
    	ps.input('email',sql.VarChar(50));

        ps.prepare("select * from members where email=@email",err=>{

        	if(err)
        	{
        		done(err,null);
        		return;
        	}

        	
        	ps.execute({email:email},(err,result)=>{
        		if(err)
        	    {
        			done(err,null)
        			return;
                }


        		else(result)
        		{ 
        			console.log('this is the deserialised user '+ result)
        			done(null,result.recordset[0])
        		}


        		 ps.unprepare(err=>{
        			if(err){
        				done(err);
        			}
        		
        	    });
            });
        });  
   
    });


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function(req, email, password, done) { // callback with email and password from our form
        	var email=email;
        	var password=password;
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
                done("Failed to prepare query",null);
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({email: email},(err,result)=>{
                if(err)
                {
                    done("Failed to execute query",null)
                    return;
                }

                else if(result)
                {

                	if(!result.recordset.length){
                		done("<h1>No matching user found!</h1>");
                        return
                      }

                    var pass=result.recordset[0].passwrd;
                    var email=result.recordset[0].email;
                    var res={email:email,pass:pass};

                    console.log(result);

                    if(passwordHash.verify(password,pass))
                    {
                       verify=1;
                       console.log('success');
                        done(null,result.recordset[0].email);
                    }
                    else{
                        console.log('failure');
                        done(err,null);
                     }   
                }
                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });    
    }));
}