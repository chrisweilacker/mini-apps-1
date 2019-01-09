window.onload=function (){
  $('#submit').click(convertData);
};

//View
var convertData = function (e) {
  e.stopPropagation();
  e.preventDefault();

  if ($('#file').prop('files')[0]) {


    var filter = $('#filter').val();
    var file = $('#file').prop('files')[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var data = reader.result.replace(/\n/g,'');
      console.log(JSON.parse(data));
      $.ajax({
        url: '/post',
        method: 'POST',
        dataType: 'text',
        data: {'json': data, 'filter': filter},
        success: function (CSV) {
          console.log('success: ', CSV);
          $('#CSV').html(CSV);
        }
      });
    }

    $('#JSONTOCVSFORM').trigger("reset");



  } else {
    alert('Please select a JSON file to Convert to CSV.')
  }


  }