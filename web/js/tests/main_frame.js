import{ getMap, getUser} from 'query';
function pageHeader( ) {
  var html = document.getElementById("header");
  var str = html.innerHTML;
  var userName = getRandomName( );
  var userHP   = getUserHP( user );
  var newHTML  = str.replace(/@/, userName );

  newHTML  = newHTML.replace(/\+/, function(match){ 
                     var hp= "#"; 
                     for(i=0;i<userHP-1;i++){
                        hp += "#";      
                     }
                     return hp;
                  });
  html.innerHTML = newHTML;
}
function getRandomName( ) {
   return "Asgaroth";
}
function getUserHP( ) {
   return 40;
}


function pageBody( ) {


}

function init_frames( ) {
   var map  = query.getMap();
   pageHeader( );
   pageBody();
}
