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
  var mostRecentChange = readFromFile();
  var loginName = mostRecentChange.loginName;
  var agenda = mostRecentChange.agenda;
  var dateNtime = mostRecentChange.dateTime;

  res.render('index', { loginName: loginName, agenda: agenda, dateNtime: dateNtime });

});


//when " change " button gets pressed
app.get('/edit', function (req, res) {
  var something = readFromFile();
  var agenda = something.agenda;

  res.render('edit', { error: null, agenda: agenda });
});


// when " save "button gets pressed
app.post('/save', function (req, res) {
  var loginName = req.body.loginName;
  var password = req.body.pwd;
  var agenda = req.body.agenda;
  var dateNtime = new Date();

  console.log(req.body);
  //check login
  var passwordMatched = passwordMatcher(loginName, password);
  if (passwordMatched == true) {
    //save info
    saveInFile(agenda, loginName, dateNtime.toLocaleString());
    res.redirect('/');
  } else {
    res.render('edit', { error: 'NOT SUFFICIENT ENOUGH PASSWORD! DO BETTER!', agenda: agenda })
  }

});


//----------HELPER FUNCTIONS-----------
//function to save agenda data
function saveInFile(agenda, loginName, dateTime) {
  var obj = new Object();
  obj.agenda = agenda;
  obj.loginName = loginName;
  obj.dateTime = dateTime;
  var jsonString = JSON.stringify(obj);
  fs.writeFileSync('agenda.json', jsonString, function (err) {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Agenda saved!');
  });
  return true;
};

//function to read saved agenda data
function readFromFile() {
  var agendaData = null;
  fileData = fs.readFileSync('agenda.json', function (err, data) {
    if (err) throw err;
  });
  agendaData = JSON.parse(fileData);
  console.log(agendaData);
  return agendaData;
};

// function to match password with login
function passwordMatcher(name, pwd) {
  fileData = fs.readFileSync('login.json', function (err, data) {
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
