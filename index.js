// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

//var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

//if (!databaseUri) {
//  console.log('DATABASE_URI not specified, falling back to localhost.');
//}


var api1 = new ParseServer({
    databaseURI: 'mongodb://test:test@ds051665.mlab.com:51665/parse1',
    //cloud: __dirname + '/cloud/main.js',
    verbose: true,
    appId: 'myAppId1',
    masterKey: 'key', //Add your master key here. Keep it secret!
    serverURL: 'https://safe-basin-38488.herokuapp.com/parse',
    //serverURL: 'http://localhost:1337/parse',
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    }
  , push: {
      android: {
          senderId: '423654199290', // The Sender ID of GCM
          apiKey: 'AIzaSyDdCNomOTvNpDEzAqBE4EWomNS5BNMcrXs' // The Server API Key of GCM  
      }
  }
});
var api2 = new ParseServer({
    databaseURI: 'mongodb://test:test@ds053196.mlab.com:53196/parse2',
    //cloud: __dirname + '/cloud/main.js',
    verbose: true,
    appId: 'myAppId2',
    masterKey: 'key', //Add your master key here. Keep it secret!
    serverURL: 'https://safe-basin-38488.herokuapp.com/parse',
    liveQuery: {
        classNames: ["Posts", "Comments"]
    },
    push: {
      android: {
          senderId: '1077532576696',
          apiKey: 'AIzaSyD_6h7I5uP3FqU_iOuURjCOJl2lLMZwM2c'
      }
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api1);
app.use(mountPath, api2);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/new', function (req, res) {
    console.log(req.param.appId);
    res.status(200).send('New App added');
    var newApi = new ParseServer({
        databaseURI: 'mongodb://test:test@ds053196.mlab.com:53196/parse2',
        //cloud: __dirname + '/cloud/main.js',
        verbose: true,
        appId: req.param.appId,
        masterKey: req.param.masterKey, //Add your master key here. Keep it secret!
        serverURL: 'https://safe-basin-38488.herokuapp.com/parse',
        liveQuery: {
            classNames: ["Posts", "Comments"]
        },
        push: {
            android: {
                senderId: '1077532576696',
                apiKey: 'AIzaSyD_6h7I5uP3FqU_iOuURjCOJl2lLMZwM2c'
            }
        }
    });
    app.use(mountPath, newApi);
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
