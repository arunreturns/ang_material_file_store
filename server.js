var Express = require('express');

/*if ( process.env.NODE_ENV === 'production' ) {
    
    var Cluster = require('cluster');

    if (Cluster.isMaster) {
        
        var cpuCount = require('os').cpus().length;
        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i += 1) {
            Cluster.fork();
        }
        
        // Listen for dying workers
        Cluster.on('exit', function(worker) {
            // Replace the dead worker, we're not sentimental
            console.log('Worker %d died :(', worker.id);
            Cluster.fork();
        });
    } else {
        var App = new Express();
        
        var port = process.env.PORT || 8080; 
        
        require('./server/configServer.js')(App);
        
        require('./server/databaseConfig.js')(App);
        
        App.use(Express.static(__dirname + '/public'));
        App.set("appName", "file-storer.herokuapp.com");
        
        require('./server/expressRoutes.js')(App);
        
        App.listen(port, function() { 
            console.log('Worker %d running! Listening on port [%d]', Cluster.worker.id, port);
        });
    }
} else {
    var devApp = new Express();
    
    var devPort = process.env.PORT || 8080; 
    
    require('./server/configServer.js')(devApp);
    
    require('./server/databaseConfig.js')(devApp);
    
    devApp.use(Express.static(__dirname + '/public'));
    devApp.set("appName", "file-storer.herokuapp.com");
    
    require('./server/expressRoutes.js')(devApp);
    
    devApp.listen(devPort, function() { 
        console.log('Running in <%s>', process.env.NODE_ENV);
        console.log('Listening on port [%d]', devPort);
    });
}*/
/**/

var App = new Express();
        
var port = process.env.PORT || 8080; 

require('./server/configServer.js')(App);

require('./server/databaseConfig.js')(App);

App.use(Express.static(__dirname + '/public'));
App.set("appName", "file-storer.herokuapp.com");

require('./server/expressRoutes.js')(App);

App.listen(port, function() { 
    console.log('Listening on port [%d]', port);
});


module.exports = App;