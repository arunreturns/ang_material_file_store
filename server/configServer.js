var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');
var helmet          = require('helmet');
var compression     = require('compression');
var path            = require('path');
var favicon         = require("serve-favicon");

module.exports = function(app) {
    app.use(favicon(path.join(__dirname, 'favicon.ico')));
    
    /*
        Predefined Formats
        There are various pre-defined formats provided:
        
        combined
        Standard Apache combined log output.
        :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
        
        common
        Standard Apache common log output.
        :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
        
        dev
        Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
        :method :url :status :response-time ms - :res[content-length]
        
        short
        Shorter than default, also including response time.
        :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
        
        tiny
        The minimal output.
        :method :url :status :res[content-length] - :response-time ms
    */
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride('X-HTTP-Method-Override'));
    /* Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers */
    app.use(helmet());
    /* Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app */
    app.use(compression());
};