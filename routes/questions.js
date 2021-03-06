var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/treasure');

/* GET home page. */
router.post('/submit', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var firstName = req.body['firstName'];
    var lastName = req.body['lastName'];
    var fbid = req.body['fbid'];
    var level = req.body['level'];
    var usr_ans = req.body['ans'];
    var md5req = crypto.createHash('md5').update(fbid+"darsubhairocks").digest('hex');

    if(isNaN(level)){
        res.json({"error":"That ain't a level though","serverGenerated":1});
    }
    else{
        userdb.findOne({ hash : md5req, "firstName":firstName, "lastName":lastName}, function(err, usr){

            if (err) throw err;
            
            else if(usr){
                if(usr.currLevel<parseInt(level)){
                    res.json({"error":"Aukat se bahar nhp :'(","serverGenerated":1});
                }
                else if(usr.currLevel>parseInt(level)){
                    res.json({"error":"You've already answered this question!","serverGenerated":1});
                }
                else{
                    questiondb.findOne({ "level": parseInt(level) }, function(err, que){
                        if (err) throw err;
                        else if(usr_ans == que.ans){
                            userdb.update({"hash": md5req, "firstName":firstName, "lastName":lastName},
                            {
                                $set: {
                                    "answered_time": (new Date()).getTime(),
                                    "currLevel": parseInt(level)+1
                                }
                            });

                            res.json({"success":"Proceed to next level","serverGenerated":1});
                        }
                        else{
                            res.json({"error":"That wasn't quite right","serverGenerated":1});
                        }
                    });
                }
            }
            else{
                res.json({"error":"Request wasn't human. What're you upto mate?","serverGenerated":1});
            }
        });
    }
});

/*
router.put('/:id', function(req, res){
    var collection = db.get('questions');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video)
    });
});
*/

router.post('/levelFetch', function(req, res) {
    var userdb = db.get('users');
    var questiondb = db.get('questions');
    var firstName = req.body['firstName'];
    var lastName = req.body['lastName'];
    var fbid = req.body['fbid'];
    var levelReq = req.body['level'];
    var md5req = crypto.createHash('md5').update(fbid+"darsubhairocks").digest('hex');

    userdb.findOne({ hash : md5req, "firstName":firstName, "lastName":lastName }, function(err, usr){
        if (err) throw err;
        else if(usr){
            if(isNaN(levelReq) || levelReq>usr.currLevel){
                levelReq = usr.currLevel
            }

            questiondb.findOne({ level: levelReq }, function(err, que){
                if (err) throw err;
                res.json({"clue":que.clue, "storyline":que.storyline, "level":que.level});
            });   
        }
        else{
            res.json({"error":"Request wasn't human. What're you upto mate?","serverGenerated":1});
        }
    });  
});

module.exports = router;
