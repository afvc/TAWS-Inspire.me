function tplawesome(e, t) {
     res = e;
     for (var n = 0; n < t.length; n++) {
         res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) {
             return t[n][r];
         });
     }
     return res;
 }

//YOUTUBE-------------------------------------------------------

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
           $("#resultsYoutube").html("")
              $.each(results.items, function (index, item) {

                 $.get("tpl/itemYoutube.html", function (data) {

                     $("#resultsYoutube").append(tplawesome(data, [{
                         "title":item.snippet.title,
                         "videoid":item.id.videoId,
                         "url":item.url
                     }]));

                 });
                 });
resetVideoHeight();
             });  
         });

         $(window).on("resize", resetVideoHeight);
     });

function resetVideoHeight(){
    $(".video").css("max-width", "500px");
    $(".video").css("width", "100%");
}

function init() {
     gapi.client.setApiKey("AIzaSyAX9MNHEELUlStowPlfYfbzpCoIwUBgx2M");
     gapi.client.load("youtube", "v3", function () {
         // yt api is ready
     });
 }
     

//BEHANCE-------------------------------------------------------
var searchLink_Behance = "https://api.behance.net/v2/projects";
var clientID_Behance = "zn1ciCoCTafTzNRQBV7EwhO1BiEMLLP8";


$(function () {
     $("form").on("submit", function (e) {
         $.ajax({
            url: searchLink_Behance+"?tags="+encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            dataType: "jsonp",
            data: {api_key: clientID_Behance},
            timeout: 1500,
            success: processaDadosB,
            error: console.log("Erro Behance")
        });
     })
});

function processaDadosB(response){
    console.log(response);
    var results = response.result;
    $("#resultsBehance").html("")
        $.each(response.projects, function (index, item) {
            $.get("tpl/itemBehance.html", function (data) {
                $(tplawesome(data, [{
                    "title":item.name,
                    "url":item.url,
                    "imagem":item.covers.original
                }])).appendTo("#resultsBehance");

            });
        });
}

//UNSPLASH-------------------------------------------------------

//COLOURLOVERS---------------------------------------------------
var searchLink_ColourL="http://www.colourlovers.com/api/palettes/keywords/search/";

$(function (){
     $("form").on("submit", function (e) {
         $.ajax({
            url: searchLink_ColourL+encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            dataType: "jsonp",
            success: processaDadosC,
            error: console.log("Erro ColourLovers")
        });
     });
});
    
function processaDadosC(response){
    console.log(response);
    var results = response.result;
    $("#resultsColours").html("")
        $.each(response, function (index, item) {
            $.get("tpl/itemColour.html", function (data) {
                $(tplawesome(data, [{
                    "title":item.title,
                    "url":item.url,
                    "imagem":item.covers.original
                }])).appendTo("#resultsBehance");

            });
        });
}

