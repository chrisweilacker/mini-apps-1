// The server must flatten the JSON hierarchy, mapping each item/object in the JSON to a single line of CSV report
//(see included sample output), where the keys of the JSON objects will be the columns of the CSV report.

// You may assume the JSON data has a regular structure and hierarchy (see included sample file).
// In other words, all sibling records at a particular level of the hierarchy will have the same set of properties, but child objects might not contain the same properties.
// In all cases, every property you encounter must be present in the final CSV output.

// You may also assume that child records in the JSON will always be in a property called `children`.

var express = require('express');
var app = express();
var fs = require('fs');
app.listen(3000);

app.use(express.static('client'));

app.get('/post*', function (req, res) {
  csv = '';

  if (!req.query.JSON && !req.query.JSONFILE) {
    res.redirect('/');
  }

  if (req.query.JSON && req.query.JSON.trim !== '') {
    csv = processJSON(req.query.JSON);
    if (csv === '') {
      res.redirect('/');
    } else {
      res.send(createPage(csv));
    }

  }

  if (csv === '' && req.query.JSONFILE && req.query.JSONFILE.trim !== '') {
    fs.readFile(req.query.JSONFILE, function (err, data) {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        csv = processJSON(data);
        console.log(csv);
        if (csv === '') {
          res.redirect('/');
        } else {
          res.send(createPage(csv));
        }
      }
    });
  }

  //save csv to file

  //send file to user

  //redirect user back to page

});

var processJSON = function (JSONString) {
  try {
      //convert JSON to Object
    var obj = JSON.parse(JSONString);
    var arrayOfObjects = [obj];
    var headers = [];
    //build headers and the full list of objects
    for (var i = 0; i<arrayOfObjects.length; i++) {
      for (key in arrayOfObjects[i]) {
        if (arrayOfObjects[i].hasOwnProperty(key)) {
          if (key === 'children') {
            if (Array.isArray(arrayOfObjects[i]['children'])) {
              arrayOfObjects = arrayOfObjects.concat(arrayOfObjects[i]['children']);
            }
          } else {
            if (!headers.includes(key)) {
              headers.push(key);
            }
          }
        }
      }
    }

    var returnCSV = headers.join(',') + '\n';
    //build CSV
    for (var i = 0; i<arrayOfObjects.length; i++) {
      for (var header = 0; header<headers.length; header++) {
        if (arrayOfObjects[i][headers[header]]) {
          returnCSV += arrayOfObjects[i][headers[header]];
        }
        header === headers.length - 1 ? returnCSV += '\n' : returnCSV += ',';
      }
    }
    return returnCSV;

  } catch (err) {
    console.log(err);
  }
  return '';
}

var createPage = function (csv) {
  console.log(csv);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>CSV Report Generator</h1>
  <form action="/post">
    <textarea name="JSON"></textarea><br/><br/>
    <input type="File" name="JSONFILE"></input><br/><br/>
    <input type="submit">
  </form>
  <br/>
  <p>
  ${csv.replace(/(\r\n|\n|\r)/gm,'<br />')}
  </p>
</body>
</html>`
}