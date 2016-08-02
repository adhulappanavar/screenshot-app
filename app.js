var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// route: post: /process_url
app.post('/process_url', function (req, res) {

    // get url to process
  var url_to_process = req.body.url;
  if (url_to_process === undefined || url_to_process == '') {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404 Not Found");
  }

  // phantomjs screenshot
  var phantom = require('phantom');
  phantom.create(function(ph){
    ph.createPage(function(page){
      page.open(url_to_process).then(function(status){
        if (status == "success") {
          // put images in public directory
          var image_file_name = url_to_process.replace(/\W/g, '_') + ".png"
          var image_path = public_dir + "/" + image_file_name
          page.render(image_path, function(){
            // redirect to static image
            res.redirect('/'+image_file_name);
          });
        }
        else {
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end("404 Not Found");
        }
        page.close();
        ph.exit();
      });
    });
  });
});


// route: post: /process_url
app.post('/process_url2', function (req, res) {

    // get url to process
  var url_to_process = req.body.url;
  if (url_to_process === undefined || url_to_process == '') {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404 Not Found");
  }

  //Phantom Start
  var phantom = require('phantom');
 
var sitepage = null;
var phInstance = null;
var url_to_process = "https://stackoverflow.com/";
phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        return page.open('https://stackoverflow.com/');
    })
    .then(status => {
        console.log(status);
        return sitepage.property('content');
    })
    .then(content => {
        console.log(content);
                  // put images in public directory
          var public_dir = __dirname + '/public';
          var image_file_name = url_to_process.replace(/\W/g, '_') + ".png"
          var image_path = public_dir + "/" + image_file_name
          sitepage.render(image_path, function(){
            // redirect to static image
            res.redirect('/'+image_file_name);
        sitepage.close();
        phInstance.exit();
          })
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
  //Phantom End

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




// start server
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});


module.exports = app;
