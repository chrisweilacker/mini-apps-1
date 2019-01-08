window.onload=function (){
  $('#submit').click(convertData)
};

var convertData = function () {
    var file = $('#file').prop('files')[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var data = reader.result.replace(/\s/g,'');
      console.log(JSON.parse(data));
      $.ajax({
        url: '/post',
        method: 'POST',
        dataType: 'text',
        data: {json: data},
        success: function (CSV) {
          console.log('success: ', CSV);
          $('#CSV').html(CSV);
        }
      });
    }

  }