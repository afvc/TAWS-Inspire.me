 function tplawesome(e, t) {
     res = e;
     for (var n = 0; n < t.length; n++) {
         res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) {
             return t[n][r]
         })
     }
     return res
 }

 $(function () {
             $("form").on("submit", function (e) {
                 e.preventDefault(); //the default is sumbission
                 // prepare the request
                 var request = gapi.client.youtube.search.list({
                     part: "snippet",
                     type: "video",
                     q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"), //search input value
                     maxResults: 10,
                     order: "viewCount",
                     publishedAfter: "1999-01-01T00:00:00Z"
                 });
                 // execute the request
                 request.execute(function (response) {
                     console.log(response);
                     var results = response.result;
                     console.dir(results);

                      $.each(results, function (index, item) {

                         console.log("is showing" + item.snippet.title + "  " + videoID);

                         $.get("tpl/item.html", function (data) {

                             $("#results").append(tplawesome(data, [{
                                 "title": item.snippet.title,
                                 "videoid": id.videoID
                             }]));

                         });

                     }); 
                 });

                 $(window).on("resize", resetVideoHeight);
             });
 });


             function init() {
                 gapi.client.setApiKey("AIzaSyAX9MNHEELUlStowPlfYfbzpCoIwUBgx2M");
                 gapi.client.load("youtube", "v3", function () {
                     // yt api is ready
                 });
             }