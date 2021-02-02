function ping(url) {
    var encodedURL = encodeURIComponent(url);
    var startDate = new Date();
    var endDate = null;
    $.ajax({
      url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodedURL + "%22&format=json",
      type: "get",
      async: false,
      dataType: "json",
      success: function(data) {
        if (data.query.results != null) {
            endDate = new Date();
        } else {
            endDate = null;
        }
      },
      error: function(){
        endDate = null;
      }
    });

    if (endDate == null) {
        throw "Not responsive...";
    }

    return endDate.getTime() - startDate.getTime();
}
