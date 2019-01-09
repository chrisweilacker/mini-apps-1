window.onload=function (){
  $('#submit').click(convertData);
};

//View
var convertData = function (e) {
  e.stopPropagation();
  e.preventDefault();

  if ($('#file').prop('files')[0]) {


    var filter = $('#filter').val();
    var formData = new FormData();
    var file = $('#file').prop('files')[0];
    formData.append('JSON', file);
    formData.append('filter', filter);
    fetch('/post', {
      method: 'POST',
      body: formData
    }).then(function (response) {
      response.text().then(function (text){
        $('#CSV').html(text);
      });
    });

      // $.ajax({
      //   url: '/post',
      //   method: 'POST',
      //   dataType: 'text',
      //   data: {'json': data, 'filter': filter},
      //   success: function (CSV) {
      //     console.log('success: ', CSV);
      //     $('#CSV').html(CSV);
      //   }
      // });


    $('#JSONTOCVSFORM').trigger("reset");



  } else {
    alert('Please select a JSON file to Convert to CSV.')
  }


  }