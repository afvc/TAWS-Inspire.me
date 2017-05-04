 resultsmax = 3;
 var inc = 1;



 $(function () {
     // console.log("função main");
     var botoes = $("#checkApis");
     $("form").on("submit", function (e) {
         var check = 0;
         e.preventDefault(); //the default is sumbission
         //console.log(check);
         //console.log("Entrei no form")

         if ($("#CheckYoutube").is(":checked")) {
             check++;
             // console.log("verifica youtube");
         }
         if ($("#CheckBehance").is(":checked")) {
             check++;
             //console.log("verifica behance");
         }
         if ($("#CheckPixabay").is(":checked")) {
             check++;
             // console.log("verifica unsplash");
         }


         // console.log("chama pedidos");

         //YOUTUBE----------------------------------------------
         if ($("#CheckYoutube").is(":checked")) {
             var request = gapi.client.youtube.search.list({
                 part: "snippet",
                 type: "video",
                 q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"), //search input value
                 maxResults: resultsmax + 5,
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
                             "title": item.snippet.title,
                             "videoid": item.id.videoId,
                             "url": item.url
                             }]));

                     });
                 });

             });


         }

         //BEHANCE-------------------------------------------------------
         function PedidoBehance(numpag) {
             var tatas = searchLink_Behance + "?tags=" + encodeURIComponent($("#search").val()).replace(/%20/g, "+");
             $.ajax({

                 dataType: "jsonp",
                 data: {
                     api_key: clientID_Behance
                 },
                 timeout: 1500,
                 url: tatas + "&per_page=" + resultsmax + "&page=" + numpag,
                 //jsonpCallback: processaDadosB,
                 success: processaDadosB,
                 error: ErroBehance
             });
             // CriaBot();
         }


         if ($("#CheckBehance").is(":checked")) {

             PedidoBehance(inc);


         }
         

         //BE-NEXTPAGE-------------------------------------------------------
         $(".button__behance").click(function () {
             inc++;
             PedidoBehance(inc);
             console.log("batata");
             console.log(inc);



         });



     });



 });




 function CriaBot() {
     //BE-BUTTON-------------------------------------------------------
     $("#resultsBehance").append('<button type="button" class="btn-purple text text-lightest text-bold button__behance">Show me more!</button>');

 }

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



 function init() {
     gapi.client.setApiKey("AIzaSyAX9MNHEELUlStowPlfYfbzpCoIwUBgx2M");
     gapi.client.load("youtube", "v3", function () {
         // yt api is ready
     });
 }


 //BEHANCE-------------------------------------------------------
 var searchLink_Behance = "https://api.behance.net/v2/projects";
 var clientID_Behance = "65L6CsPc3nuLXkaXxRVb2eZ9HKgRHrJE";



 function processaDadosB(response) {

     console.log(response);
     var results = response.result;
     $("#resultsBehance").html("");
     $.each(response.projects, function (index, item) {
         $.get("tpl/itemBehance.html", function (data) {
             $(tplawesome(data, [{
                 "title": item.name,
                 "url": item.url,
                 "imagem": item.covers.original,
                 "criador": item.owners[0].display_name,
                 "visualizacoes": item.stats.views + " Views"
                }])).appendTo("#resultsBehance");


         });

     });
     CriaBot();




 }


 function ErroBehance(response) {
     /* if(response==null){  */
     $("#resultsBehance").html("O Behance não conseguiu encontrar projectos");
     //}
 }






 //UNSPLASH-------------------------------------------------------
 var searchLink_Pixabay = "http://source.unsplash.com/featured/?";

 function processaDadosU(response) {
     console.log(response);
     console.log("batata");
     var results = response.result;
     $("#resultsUnsplash").html("");
     $.each(response.photos, function (index, item) {
         $.get("tpl/itemPixabay.html", function (data) {
             $(tplawesome(data, [{
                 "imagem": item.urls.regular,
                 "criador": item.user.name,

                }])).appendTo("#resultsPixabay");

         });
     });

 }


 function ErroPixabay(response) {
     if (response == null) {
         $("#resultsPixabay").html("O Unsplash não conseguiu encontrar fotografias");
     }
 }