const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000; 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.listen(port, function () {
  console.log(`nap app listening on port ${port}!`);
});
// -------set up end----------------------


//when type " localhost "
app.get('/', function (req, res) {
  var mostRecentChange = readFromFile('6B');
  var loginName = mostRecentChange.loginName;
  var agenda = mostRecentChange.agenda;
  var dateNtime = mostRecentChange.dateTime;

  res.render('index', { loginName: loginName, agenda: agenda, dateNtime: dateNtime });

});

//when press 6A
app.get('/6A', function (req, res) {
  var mostRecentChange = readFromFile('6A');
  var loginName = mostRecentChange.loginName;
  var agenda = mostRecentChange.agenda;
  var dateNtime = mostRecentChange.dateTime;

  res.render('index6A', { loginName: loginName, agenda: agenda, dateNtime: dateNtime });

});

//when " change " button gets pressed
app.get('/edit', function (req, res) {
  var something = readFromFile('6B');
  var agenda = something.agenda;

  res.render('edit', { error: null, agenda: agenda });
});

//when " change " button gets pressed
app.get('/edit6A', function (req, res) {
  var something = readFromFile('6A');
  var agenda = something.agenda;

  res.render('edit6A', { error: null, agenda: agenda });
});


// when " save "button gets pressed
app.post('/save6A', function (req, res) {
  var loginName = req.body.loginName;
  var password = req.body.pwd;
  var agenda = req.body.agenda;
  var dateNtime = new Date();

  console.log(req.body);
  //check login
  var passwordMatched = passwordMatcher(loginName, password, '6A');
  if (passwordMatched == true) {
    //save info
    saveInFile(agenda, loginName, dateNtime.toLocaleString(), '6A');
    res.redirect('6A');
  } else {
    res.render('edit6A', { error: 'NOT SUFFICIENT ENOUGH PASSWORD! DO BETTER!', agenda: agenda })
  }

});



// when " save "button gets pressed
app.post('/save', function (req, res) {
  var loginName = req.body.loginName;
  var password = req.body.pwd;
  var agenda = req.body.agenda;
  var dateNtime = new Date();

  console.log(req.body);
  //check login
  var passwordMatched = passwordMatcher(loginName, password, '6B');
  if (passwordMatched == true) {
    //save info
    saveInFile(agenda, loginName, dateNtime.toLocaleString(), '6B');
    res.redirect('/');
  } else {
    res.render('edit', { error: 'NOT SUFFICIENT ENOUGH PASSWORD! DO BETTER!', agenda: agenda })
  }

});


//----------HELPER FUNCTIONS-----------
//function to save agenda data
function saveInFile(agenda, loginName, dateTime, className) {
  var obj = new Object();
  obj.agenda = agenda;
  obj.loginName = loginName;
  obj.dateTime = dateTime;
  var jsonString = JSON.stringify(obj);
  fs.writeFileSync('agenda'+className+'.json', jsonString, function (err) {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Agenda saved!');
  });
  return true;
};

//function to read saved agenda data
function readFromFile(className) {
  var agendaData = null;
  fileData = fs.readFileSync('agenda'+className+'.json', function (err, data) {
    if (err) throw err;
  });
  agendaData = JSON.parse(fileData);
  console.log(agendaData);
  return agendaData;
};

// function to match password with login
function passwordMatcher(name, pwd, className) {
  fileData = fs.readFileSync('login'+className+'.json', function (err, data) {
    if (err) throw err;
  });
  loginData = JSON.parse(fileData);
  // loop through the array to find the right one
  for (var i in loginData) {
    console.log(loginData[i]);
    if (loginData[i].name == name){
      return loginData[i].pwd == pwd;
    }
  }
  // if file does not have login name return false
  return false;
}






