 resultsmax = 3;

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
             console.log("verifica youtube");
         }
         if ($("#CheckBehance").is(":checked")) {
             check++;
             console.log("verifica behance");
         }
         if ($("#CheckPixabay").is(":checked")) {
             check++;
             // console.log("verifica unsplash");
         }
         if ($("#CheckColours").is(":checked")) {
             check++;
             console.log("verifica colours");
         }

         if (check > 3) {
             $("#erros").html("You cannot search so many sources at once.");
             console.log("erro + que 3 selecionadas");
         } else {
             // console.log("chama pedidos");

             //YOUTUBE----------------------------------------------
             if ($("#CheckYoutube").is(":checked")) {
                 var request = gapi.client.youtube.search.list({
                     part: "snippet",
                     type: "video",
                     q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"), //search input value
                     maxResults: resultsmax+5,
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
             if ($("#CheckBehance").is(":checked")) {
                 $.ajax({
                     url: searchLink_Behance + "?tags=" + "&api_key=" + clientID_Behance + "&per_page=" + resultsmax + encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
                     dataType: "jsonp",
                     timeout: 1500,
                     //jsonpCallback: processaDadosB,
                     success: processaDadosB,
                     error: ErroBehance
                 });
             }

             //UNSPLASH-------------------------------------------------------
             if ($("#CheckPixabay").is(":checked")) {


                 /*                $.ajax({
                                     url: searchLink_Pixabay+encodeURIComponent($("#search").val()).replace(/%20/g, ","),
                                     dataType: "json",
                                     timeout: 1500,
                                     success: processaDadosU,
                                     error: ErroUnsplash
                                 }); */




                 var url = "http://source.unsplash.com/featured/?" + encodeURIComponent($("#search").val()).replace(/%20/g, ",");
                 $.get(url).done(processaDadosU).fail(
                     function () {
                         console.log("erro");
                     });


             }
         }
     });
 });


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
     });;
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
     });;
 }


 function ErroPixabay(response) {
     if (response == null) {
         $("#resultsPixabay").html("O Unsplash não conseguiu encontrar fotografias");
     }
 }