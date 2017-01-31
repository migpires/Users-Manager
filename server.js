var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic(__dirname))
app.listen(3000, function(){
    console.log('Server running on 3000');
});
