var resultsmax = 4;
var inc=1;
var pag=1;
var  nextPageToken = "";

 $(function () {
     var botoes = $("#checkApis");
     $("form").on("submit", function (e) {
         
         var check = 0;
         e.preventDefault(); //the default is sumbission
         //console.log(check);
         //console.log("Entrei no form")

         if ($("#CheckYoutube").is(":checked")) {
             check++;
             PedidoYoutube(nextPageToken);
             // console.log("verifica youtube");
         }
         if ($("#CheckBehance").is(":checked")) {
             check++;
             PedidoBehance(inc);
             //console.log("verifica behance");
         }
         if ($("#CheckPixabay").is(":checked")) {
             check++;
             // console.log("verifica pixabay");
         }


         //YOUTUBE----------------------------------------------
            function PedidoYoutube(pageToken) {

             var request = gapi.client.youtube.search.list({
                 part: "snippet",
                 type: "video",
                 q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"), //search input value
                 maxResults: resultsmax + 4,
                 order: "viewCount",
                 publishedAfter: "1999-01-01T00:00:00Z",
                  "pageToken": nextPageToken 
             });

             if (pageToken) {
                 request.pageToken = pageToken;

             }
             // execute the request
             request.execute(function (response) {
                 console.log(response);
                 var results = response.result;
              nextPageToken = response.nextPageToken;
                 $("#resultsYoutube").html("");
                 $.each(results.items, function (index, item) {

                     $.get("tpl/itemYoutube.html", function (data) {


                         $("#resultsYoutube").append(tplawesome(data, [{
                             "title": item.snippet.title,
                             "videoid": item.id.videoId,
                             "url": item.url
                             }]));
                         console.log(nextPageToken);
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
                 success: processaDadosB,
                 error: ErroBehance
             });
         }
         
          //PIXABAY-----------------------------------------------------
         function PedidoPixabay(pag) {
                $.get(searchLink_Pixabay1+encodeURIComponent($("#search").val()).replace(/%20/g, ",")+searchLink_Pixabay2+pag ,processaDadosU); 
            } 
         
           if($("#CheckPixabay").is( ":checked" )){
            PedidoPixabay(pag);
             $(".button__pixabay").removeClass("hidden");
           }
         
         //NEXT PAGE -------------------------------------------------
           $(".button__more").click(function () {
                window.scrollTo(0, 0);
                if ($("#CheckYoutube").is(":checked")) {
                    PedidoYoutube(nextPageToken);
                }
                if ($("#CheckBehance").is(":checked")) {
                    inc++;
                    PedidoBehance(inc);
                }
                if ($("#CheckPixabay").is(":checked")) {
                     pag++;
                     PedidoPixabay(pag);
                }
         });
         
     
     $(".button__more").removeClass("hidden");
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
     });
}


 function ErroBehance(response) {
     /* if(response==null){  */
     $("#resultsBehance").html("O Behance não conseguiu encontrar projectos");
     //}
 }

//Pixabay-------------------------------------------------------
var searchLink_Pixabay1 = "https://pixabay.com/api/?key=3698801-7c998e5768fefdb62fc5f90fc&q=";
var searchLink_Pixabay2 = "&image_type=photo&per_page=6&page=";

function processaDadosU(response){
    console.log(response);
    var results = response.result;
    $("#resultsPixabay").html("");
        $.each(response.hits, function (index, item) {
            $.get("tpl/itemPixabay.html", function (data) {
                $(tplawesome(data, [{
                    "imagem":item.webformatURL,
                    "criador":item.user,
                    "url":item.pageURL          
                }])).appendTo("#resultsPixabay");

            });
        });
;}

function ErroPixabay(response){
        $("#resultsPixabay").html("O Pixabay não conseguiu encontrar fotografias");
}

//DICIONARIO -----------------------------------------------
var linkSinonimos1 = "https://words.bighugelabs.com/api/2/b6ac1104a170525e3a731dcc57bbb275/";
var linkSinonimos2 = "/json?callback=ProcessaSugestoes";

 $(function () {
     $("form").on("submit", function (e) {
        $.get(linkSinonimos1+ encodeURIComponent($("#search").val()).replace(/%20/g, "+") +linkSinonimos2);
    });
 });

function ProcessaSugestoes(response){
    console.log(response);
    //var ind = 0;
    
    $("#sugestoes").html("Suggestion for the next search: " + response.noun.syn[0] + ",     "+ response.noun.syn[1] + ",     "+ response.noun.syn[2]);
    
     /*$.each(response.nouns.syn, function (index, item) {
          console.log("1");
        $.get("tpl/itemSinonimos.html", function (data) {
            console.log("2");
            $(tplawesome(data, [{
                "palavra":item 
            }])).appendTo("#sugestoes");
            
                console.log(item);
        });
         
        ind++;
        if(ind==3){
            break;
        }
     });
}

function SugestaoPalavras(word){
    $("form").submit(word);
}*/
}