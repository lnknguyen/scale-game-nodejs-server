var express = require('express');
var router = express.Router();
var baseUrl = "/api/v1";
var pg = require('pg');
var hardString = process.env.DATABASE_URL || "postgres://localhost:5432/test-db";
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
    Dictionary table
*/

//query word
router.get(baseUrl + "/word", function(req,res){
        var result = [];
        //var sql = "SELECT * FROM images ORDER BY id ASC;";
        //var sql ="select * from images inner join location on images.location_id=location.location_id;";
        
        //var sql = "select id,url,user_id,timestamp,location->'lat' as lat,location->'lon' as lon,location->'city' as city from images;";
        var sql = "select * from dictionary";
        // var sql = "select row_to_json(i) from (select id,url,user_id,timestamp , (select row_to_json(l) from(select * from location )l) as location from images where images.url='lalala')i;"
        pg.connect(hardString, function(err,client,done){
                if(err){
                        done();
                        console.log(err);
                        return res.status(500).json({success: false, data:err});
                }
                var query = client.query(sql);
                query.on('row', function(row){

                        result.push(row);
                });
                query.on('end',function(){
                        done();
                        
                        return res.json(result);
                });
        });
});


//query for post word
router.post(baseUrl + "/word", function(req,res){
        var result = [];
        var sql = "insert into dictionary(fin,en,img_url) values($1,$2,$3)";
        
        var data = { fin: req.body.fin, en: req.body.en, url: req.body.url};

       
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,[data.fin,data.en,data.url]);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

//update url
router.put(baseUrl + "/word/:id", function(req,res){
        var result = [];

        //grab id
        var id = reg.params.id;

        //data from body
        var data = { url: req.body.url};

        var sql = "update dictionary set img_url=($1) where id=($2)";
       
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,[data.url,id]);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

/*
    Scale table
*/


//GET
//Fetch all data from scale table
router.get(baseUrl + "/scale", function(req,res){
        var result = [];
        
        var sql = "select * from scale_data"
        
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

//GET
//Get scale data from user id
//Params: user_id
//Return: list of scale data sorted by user id
router.get(baseUrl + "/scale/:user_id", function(req,res){
        var result = [];
        
        //grab user id
        var id = req.params.user_id;
        var sql = "select * from scale_data where user_id=($1)"
        
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,[id]);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

//POST
//Upload scale value based on user id 
//Params: user_id, time, value
//Return: nothing
router.post(baseUrl + "/scale", function(req,res){
        var result = [];
        var sql = "insert into scale_data (user_id,time_stamp,value) values($1,$2,$3)";
        
        var data = { user_id: req.body.user_id, 
            time_stamp: req.body.time_stamp
            , value: req.body.value};

       
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
            client.query(sql,
                    [data.user_id
                    ,data.time_stamp
                    ,data.value],function(err,result){
                        if (err){
                            var body = 'Error uploading data';
                            var message = 'Error';
                            res.writeHead(500,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
                            res.end(message);     
                        }
                        else{
                            var body = 'Successful';
                            var message = 'Successful';
                            res.writeHead(200,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
                            res.end(message);   
                        }
                    });

            
        });
});

/*
    Query for user table
*/

//GET
//All users
//Return: all users
router.get(baseUrl + "/user", function(req,res){
        var result = [];
        var sql = "select username,height,goal_day,goal_weight,register_day,status from user_data";
            
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

//GET
//User by name
//Param: Username
//Return: user data by Username
router.get(baseUrl + "/user/:username", function(req,res){
        var result = [];

        var username = req.params.username;
         
            
        var sql = "select username,height,goal_day,goal_weight,register_day,status from user_data where username=($1)";
            
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,[username]);

                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

//GET
//QUery user by username and password
//Return: user with username and password, error if nothing found
router.get(baseUrl + "/user/login", function(req,res){
        var result = [];

        var data = { username: req.body.username 
            , password: req.body.password};
        var sql = "select username,height,goal_day,goal_weight,register_day,status from user_data where username=($1), password=($2)";
            
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,[username]);

                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });

        });
});

//POST
//Upload user profile
//Params: name, height, goal_day, goal_weight
router.post(baseUrl + "/user", function(req,res){
        var result = [];
        var sql = "insert into user_data(username,height,goal_day,goal_weight,register_day,password,status) values ($1,$2,$3,$4,$5,$6,$7)";
            
        var data = { name: req.body.name, 
                height: req.body.height
                , goal_day: req.body.goal_day
                , weight: req.body.weight
                , register_day: req.body.register_day
                , password: req.body.password
                , status: req.body.status};

        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                 client.query(sql,
                    [data.name
                    ,data.height
                    ,data.goal_day
                    ,data.weight
                    ,data.register_day
                    ,data.password
                    ,data.status],function(err,request,result,data){
                        if (err){
                            var body = 'Error';
                            var message = 'Error';
                            res.writeHead(500,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
                            res.end(message);     
                        }
                        else{
                            var body = 'Successful';
                            var message = 'Successful';
                            res.writeHead(200,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
                            res.end(message);   
                        }
                        
                    });
            client.on('end',function(){
                        done();
        
            });
                
        });
        
});

//PUT
//Update user's height, goal_day, goal_weight
//Params: username, height, goal day, goal weight
router.put(baseUrl + "/user/:username", function(req,res){
        var result = [];

        //grab id
        var username = req.params.username;
        var sql = "update user_data set height=($1), goal_day=($2), goal_weight=($3) where username=($4)";
            
        var data = {  height: req.body.height
                , goal_day: req.body.goal_day
                , weight: req.body.weight};

        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                client.query(sql,
                    [data.height
                    ,data.goal_day
                    ,data.weight,username],function(err,result){
                        if (err){
                            var body = 'Error updating user';
                            var message = 'Error';
                            res.writeHead(500,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
    
                            res.end(message);     
                        }
                        else{
                            var body = 'Successful';
                            var message = 'Successful';
                            res.writeHead(200,
                                {'Content-Length': body.length,
                                'Content-Type': 'text/html' });
                            res.end(message);   
                        }
                        });

                
        });
});
module.exports = router;


