// The server must flatten the JSON hierarchy, mapping each item/object in the JSON to a single line of CSV report
//(see included sample output), where the keys of the JSON objects will be the columns of the CSV report.

// You may assume the JSON data has a regular structure and hierarchy (see included sample file).
// In other words, all sibling records at a particular level of the hierarchy will have the same set of properties, but child objects might not contain the same properties.
// In all cases, every property you encounter must be present in the final CSV output.

// You may also assume that child records in the JSON will always be in a property called `children`.

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.listen(3000);

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/post*', function (req, res) {
  var csv = '';
  csv = processJSON(JSON.parse(req.body.json));
  if (csv === '') {
    res.send('<p>No Data Sent/Bad Format</p>');
  } else {
    //save csv to file
    var d = new Date();
    var path = '/reports/report-'+d.toISOString().replace(/[^0-9]/g, "") +'.csv';
    fs.writeFile('./client'+path, csv,'utf8', function(err) {
      if (err) {
        res.send(`<p>No Data Sent/Bad Format ${err}</p>`);
      } else {
        //redirect user back to page
        res.send(createPage(csv, path));
      }
    });

  }

});

var processJSON = function (obj) {
  try {
    var arrayOfObjects = [obj];
    var headers = ['id', 'parent_id'];

    //build headers and the full list of objects
    for (var i = 0; i<arrayOfObjects.length; i++) {
      arrayOfObjects[i].id = i;
      for (key in arrayOfObjects[i]) {
        if (arrayOfObjects[i].hasOwnProperty(key)) {
          if (key === 'children') {
            if (Array.isArray(arrayOfObjects[i]['children'])) {
              for (var child = 0; child<arrayOfObjects[i]['children'].length; child++) {
                var newItem = arrayOfObjects[i]['children'][child];
                newItem.parent_id = i;
                arrayOfObjects.splice(i+1+child, 0, newItem);
              };
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
        if (arrayOfObjects[i][headers[header]] !== undefined) {
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

var createPage = function (csv, fileLink) {
  return `
  <br/><br/><a href="${fileLink}">Your Report is Here.</a><br/>
  <p>You may right click and go to save link as to save your report.</p>
  <br/>
  <p>
  ${csv.replace(/(\r\n|\n|\r)/gm,'<br />')}
  </p>`
}