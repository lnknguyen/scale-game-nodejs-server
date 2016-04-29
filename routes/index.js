var express = require('express');
var router = express.Router();
var baseUrl = "/api/v1";
var pg = require('pg');
var hardString = process.env.DATABASE_URL || "postgres://localhost:5432/android-dictionary";
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
router.put(baseUrl + "/word/:dict_id", function(req,res){
        var result = [];

        //grab id
        var id = reg.params.dict_id;

        //data from body
        var data = { url: req.body.url};

        var sql = "update dicionary set img_url=($1) where id=($2)";
       
        
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

router.get(baseUrl + "/scale", function(req,res){
        var result = [];
        
        var sql = "select * from scale"
        
        
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



router.post(baseUrl + "/scale", function(req,res){
        var result = [];
        var sql = "insert into scale(date,timestamp,value,username,goal_weight,goal_height,goal_day) values($1,$2,$3,$4,$5,$6,$7)";
        
        var data = { date: req.body.date, timestamp: req.body.timestamp
            , val: req.body.val,username: req.body.username,goalweight: req.body.goalweight
            , height: req.body.goalheight,day: req.body.goalday};

       
        
        pg.connect(hardString,function(err,client,done){
                if(err){
                        done();
                        console.log(error);
                        return res.status(500).json({success: false, data: err});
                }
             
                var query = client.query(sql,
                    [data.date,data.timestamp,data.val,data.username,data.goalweight,
                    data.height,data.day]);
                query.on('row',function(row){
                        result.push(row);   
                });

                query.on('end',function(){
                        done();
                        return res.json(result);
                });
        });
});

module.exports = router;
