const restify = require('restify');
const mongojs = require('mongojs');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const connection_string = '127.0.0.1:27017/myapp';
const db = mongojs(connection_string, ['myapp']);
const jobs = db.collection("jobs");

function findAllJobs(req, res , next){
    jobs.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }
    });
}

function postNewJob(req , res , next){
    var job = {};
    // req.body 代替 req.params
    job.title = req.body.title;
    job.description = req.body.description;
    job.location = req.body.location;
    job.postedOn = new Date();

    jobs.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}

const path = '/jobs';
server.get(path, findAllJobs);
server.post(path, postNewJob);


server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
