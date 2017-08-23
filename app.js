var dotenv = require('dotenv').load();
var express=require('express');
var session=require('express-session');
var passport=require('passport');
var cookieParser=require('cookie-parser')
var bodyParser=require('body-parser');
var expressValidator=('express-validator')


var app=express();

const DBConnect=require('./dbconn.js');
const Members=require('./members.js');
const Articles=require('./articles.js');
var authenticated = require('./authenticated');
require('./passport')(passport); // pass passport for configuration



let members=new Members();
let articles=new Articles();


//connecting to mssql database
app.set('views', __dirname + '/views');
app.use(express.static(__dirname +'/public')); //container of assets
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({limit:'52428800',extended:true}));
app.use(bodyParser.json());  //body parser uses json data
app.use(cookieParser());
//app.use(expressValidator);

//For Passport authentication
app.use(session({
	secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
    //cookie:{secure:true}          
             
    }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


var sess;


app.get('/',function(req,res)
{
	res.redirect('/login');
	

});



app.post('/insertuser',function(req,res)
{



    	firstname=req.body.firstname;
    	lastname=req.body.lastname;
    	username=req.body.username;
    	email=req.body.email;
    	password=req.body.password;
    	passwordmatch=req.body.passwordmatch;

	var datainput= {firstname:firstname ,lastname:lastname,username:username,email:email,password:password}
    //console.log(datainput.firstname)

    

	var data=members.insertMember(datainput,function(err,result)
	{
		if(err)
		{
			console.log(err);
			res.send('A user with this username or password already exists,')
		}
                 
		else if(result)
		{
		   res.send(result);
           //res.send('<a href="'+result+'" id="get" onclick="document.getElementById(this.id).removeAttribute("href");">Click here link to activate account  </a>');
           console.log(result);
		}
	});

    
   });


app.post('/forgotpass',function(req,res)
{

	var email=req.body.email;

	datainput={email:email}

	var data=members.forgotPassword(datainput,function(err,result)
	{
		if(err)
		{
			console.log(err);
			res.send('Error ocurred')
		}
                 
		else if(result)
		{
           res.send(result);
           console.log(result);
		}
	});
});



app.post('/resetpass',function(req,res)
{
    inputdata={email:req.body.email,password:req.body.password,key:req.body.token}
    console.log(inputdata);
    
    var data=members.passwordReset(inputdata,function(err,result)
	{
		if(err)
		{
			console.log(err);
			res.send(err)
		}
                 
		else if(result)
		{
           res.send(result);
           console.log(result);
		}
	});

});


app.get('/activate',function(req,res)
{
    inputdata={email:req.query.email,key:req.query.key}
    console.log(inputdata);
    
    var data=members.activateMember(inputdata,function(err,result)
	{
		if(err)
		{
			console.log(err);
			res.send(err)
		}
                 
		else if(result)
		{
           res.send('<h1>Welcome!</h1></br><p>Your account has been activated!</p>');
           console.log(result);
		}
	});	
});
		
	


app.get('/about',authenticated,function(req,res)
{

	sess=req.session;

		if(sess.email){

			res.redirect('index1.html');

		}
		else{
			res.sendFile('login.html')
		}
});


app.get('/profile',function(req,res)
{
  
 	res.send('<a href="http://localhost:8080/logout">logout</a><br/><h1>Welcome to your profile</h1>');

});


app.get('/login',function(req,res)
{
     //res.send("</h1>Wrong password,go back to login page</h1>")
 	res.sendFile('C:/Users/Elizabeth/Dropbox/Elizabeth/CMS/public/login.html');

});



  // process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
    }),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
                req.session.cookie.expires = false;
                }
            res.redirect('/');
        });



app.get('/logout',function(req,res)
{

	req.logout();
    res.redirect('/login');



});


app.post('/authenticate',function(req,res)
{
	 sess=req.session;

if(!req.body) return res.sendStatus(400);
    

    var email=req.body.email;
    var password=req.body.password;

    var datainput={email:email,password:password}
  
    console.log(datainput)
    
	members.authenticateMember(datainput,function(err,content){

		if(err)res.send('error authenticating user'+ err);
        else if(content==1){

        	sess.email=req.body.email;
        	//(content==1){res.send('<h1>user  successfully logged.Welcome: '+ email+'</h1>');}
            res.redirect('/home');

        }
        
        else{res.send('<h1>Please ensure username and password is correct</h1>')}

  });

	
});



var  server=app.listen(8080,function(){
	console.log('Server running on port 8080');
});

