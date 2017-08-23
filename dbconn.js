var sql=require('mssql')

       
var config={
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    server:process.env.DB_HOST,
    database:process.env.DB_NAME,

    options: 
    {
         trustedConnection: process.env.DB_TRUSTEDCONNECTION,
         instanceName: process.env.DB_INSTANCE
    }
 };


var connect = sql.connect(config);
var request = new sql.Request();
const prepared = new sql.PreparedStatement()

module.exports={connect,request,prepared}

