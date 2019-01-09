// The server must flatten the JSON hierarchy, mapping each item/object in the JSON to a single line of CSV report
//(see included sample output), where the keys of the JSON objects will be the columns of the CSV report.

// You may assume the JSON data has a regular structure and hierarchy (see included sample file).
// In other words, all sibling records at a particular level of the hierarchy will have the same set of properties, but child objects might not contain the same properties.
// In all cases, every property you encounter must be present in the final CSV output.

// You may also assume that child records in the JSON will always be in a property called `children`.

var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
app.listen(3000);

app.use(express.static('client'));

app.post('/post*', upload.single('JSON'), function (req, res) {
  var csv = '';
  var theJSON = String(req.file.buffer);
  console.log(req.body.filter);
  if (req.body.filter && req.body.filter !== '') {
    csv = processJSON(JSON.parse(theJSON), req.body.filter);
  } else {
    csv = processJSON(JSON.parse(theJSON));
  }

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

//Model
var processJSON = function (obj, filter) {
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
            if (filter && String(arrayOfObjects[i][key]).includes(filter)) {
              //remove any children that may have already been added
              for (var next = i+1; next<arrayOfObjects.length; next++) {
                if (arrayOfObjects[next].parent_id && arrayOfObjects[next].parent_id === i) {
                  arrayOfObjects.splice(next,1);
                  next--;
                }
              }
              arrayOfObjects.splice(i,1);
              i= i-1;
              break;
            } else if (!headers.includes(key)) {
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

//View
var createPage = function (csv, fileLink) {
  return `
  <br/><br/><a href="${fileLink}">Your Report is Here.</a><br/>
  <p>You may right click and go to save link as to save your report.</p>
  <br/>
  <table>
  <tr>
  <td>
  ${csv.replace(/\n/gm,'</td></tr><tr><td>').replace(/,/g, ',</td><td>')}
  </table>`
}