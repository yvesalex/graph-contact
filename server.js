const express = require("express");
const graphql = require("express-graphql");
const mongoose = require('mongoose');
const cors = require('cors');
const schema = require('./graphql/schema');
const config = require('./.config')

// define configuration settings
const { mongoServer, nodeServer, DEPTH_LIMIT, COMPLEXITY_LIMIT } = config;
const app = express();

//pipeline
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(checkToken);
app.use('/graphql', 
    // (req, res, next) => auth.logOperation(req, res, next),
    // (req, res, next) => permissionService.checkPermission(req, res, next),
    graphql({
        schema,
        graphiql: true,
        customFormatErrorFn: (err) => ({ message: err.message, status: err.status }),
        validationRules: [ 
            // queryValidation.complexityLimitRule(COMPLEXITY_LIMIT),
            // queryValidation.depthLimitRule(DEPTH_LIMIT) 
        ]
    })
);

// Error handler
app.use(function(error, req, res, next) {
    console.log(req)
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(error.status || 500);
    if(!error.operationName) error.operationName = req.body;
    log(JSON.stringify(error));
    res.json({ error });
});

// mongoose.connect(`mongodb://${mongoServer.address}:${mongoServer.port}/${mongoServer.db}`, mongoServer.options).catch(error => console.log(`Error on DB: ${error}...`));
// mongoose.connect(`mongodb=srv://${mongoServer.address}/${mongoServer.db}?${mongoServer.params}`, mongoServer.options).catch(error => console.log(`Error on DB: ${error}...`));
// define ATLAS remote server
mongoose.connect(`mongodb+srv://admin:Madangougous84@graph-contact-db-hvvly.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    keepAlive: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(error => console.log(`Error on DB: ${error}...`));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { 
    console.log('connected to database...');
    // log('connected to database...');
});

/*
*******************************************
* this section ends the definition of app *
*******************************************
*/

// launching app
const initLog = `
*************************************************************
LOG ${new Date()}
ATA-POS Server         
Addr: http://${nodeServer.address}
Port: ${nodeServer.port}
*************************************************************
*************************************************************
`;

// log(initLog);

app.listen(nodeServer.port, () => {
    console.log('\n\n');
    console.log(`**********************************`);
    console.log(`          ATA-POS Server         `);
    console.log(`Address: http://${nodeServer.address}`);
    console.log(`Port: ${nodeServer.port}`);
    console.log(`**********************************`);
});
