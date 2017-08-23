var dbconn=require("./dbconn.js");

var sql=require('mssql')

class Articles
{
    selectArticles(callback)
    {
       // connect to your database
    dbconn.connect.then(function(err){
    
        if (err) console.log(err);

        // create Request object
        var request = dbconn.request;
           
        // query to the database and get the records
        request.query('select * from articles', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            console.log(recordset);
            callback(null,recordset['recordset']);
        });
      });
    }


    insertArticle(title,article,statusid,categoryid,email)
    {
        var title=title;
        var article=article;
        var statusid=statusid;
        var categoryid=categoryid;
        var email=email;

        const ps=dbconn.prepared;
        // create Request object
        //var request = new sql.Request();
        ps.input('title',sql.VarChar(200));
        ps.input('article',sql.VarChar(10000));
        ps.input('statusid',sql.Int);
        ps.input('categoryid',sql.Int);
        ps.input('email',sql.VarChar(50));

        //query db to get records
        ps.prepare('insert into articles (title,article,statusid,categoryid,email) values(@title,@article,@statusid,@categoryid,@email)', err=> {
            if(err)
            {
                console.log('Failed to insert data:' + err);
                return;
            }
           
            ps.execute({title: title,article: article,statusid: statusid,categoryid: categoryid,email:email},(err,result)=>{
                if(err)
                {
                    console.log('failure executing qurey',err);
                    return;
                }
                
                console.log(result);
                return result.rowsAffected;

                if(result.rowsAffected>0)console.log('data inserted successfully');

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });
    }


     updateArticle(title,article,datemodified,statusid,categoryid,email,articleid)
    {

        var title=title;
        var article=article;
        var datemodified=datemodified;
        var statusid=statusid;
        var categoryid=categoryid;
        var email=email;

        const ps=dbconn.prepared;
        // create Request object
        //var request = new sql.Request();
        ps.input('title',sql.VarChar(200));
        ps.input('article',sql.VarChar(max));
        ps.input('statusid',sql.Int);
        ps.input('datemodified',sql.Date);
        ps.input('categoryid',sql.Int);
        ps.input('email',sql.VarChar(50));

        //query db to get records
        ps.prepare('update articles set title=@title, article=@article,datemodified=@datemodified, statusid=@statusid, categoryid=@categoryid,email=@email where articleid=@articleid', err=> {
            if(err)
            {
                console.log('Failed to update data:' + err);
                return;
            }
           
            ps.execute({title: title,article: article,datemodified:datemodified,statusid: statusid,categoryid: categoryid,email:email,articleid:articleid},(err,result)=>{
            if(err)
            {
                console.log('failure executing qurey',err);
                return;
            }
            
             console.log(result);
             return result.rowsAffected;

             if(result.rowsAffected>0)console.log('data updated successfully');

                ps.unprepare(err=> {
                    if(err)console.log('error unpreparing statement' + err)

                });

           });
        });
    }


     deleteArticle(articleid)
    {
        var articleid=articleid;
       
        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
        ps.input('articleid',sql.Int);

        //query db to get records
        ps.prepare('delete from articles where articleid=@articleid', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
           
           ps.execute({articleid: articleid},(err,result)=>{
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

    filterArticles(articleid)
    {
        var articleid=articleid;
           
        //create prepareStatement object 
        const ps=dbconn.prepared;

        //declare input 
        ps.input('articleid',sql.Int);

        //query db to get records
        ps.prepare('select * from articles where articleid=@articleid', err=> {
            if(err)
            {
                console.log('Failure preparing statement data:' + err);
                return;
            }
               
            ps.execute({articleid: articleid},(err,result)=>{
                if(err)
                {
                    console.log('Failure executing query',err);
                    return;
                }
                
                console.log(result);
                return result;

                if(result.rowsAffected>0)console.log('Search was successful');

                    ps.unprepare(err=> 
                    {
                        if(err)console.log('error unpreparing statement' + err)

                    });

            });
        });    
            
    }


}

module.exports=Articles;