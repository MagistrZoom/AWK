//============ Begin of global-object space =================

function SessionProperties( user, maze ) {
   this.user = user;
   this.maze = maze;
}

/* Have to be created in the network space. */
var session; 

//============ End of global-object space    =================



//============ Begin of network space    =================
window.onload = function () {
   try {
      //TODO: Change json - players, escape-sequence 
      sendInit( function() {
         var init = JSON.parse(this);                               
         var maze = JSON.parse(init.maze);
         var content = JSON.parse(inti.content);
         session = new SessionProperties( content.user, maze ):
         initFrames( content ); 
      }); 
      
   }
   catch( err ) {
      printErrorPage( "Cannot load from server." );
   }
}; 

function sendInit( callback ) {
   var req = getXmlHttp(); 
   req.onreadychange = function() {
      if( req.readyState == 4 )
         callback.call( req.responseText );
   };
   req.open( "GET", "/init", true );
   req.send();
}

function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

function sendMove( json ) {
   var req = getXmlHttp();
   req.open( 'POST', '/move', true);
   req.setRequestHeader( "Content-type", "application/json");
   req.send(json+"\r\n\r\n");
   console.log(req.responseText);

}

/* Update under timeout. */
function update( ) {

}
//============ End of network space =================

//============ Begin of face-making =================

function initFrames( content ) {

   try{
      pageHeader( content.user );
      pageBody( session.maze, mobs );
      addEvents();
   }
   catch( err ){
      printErrorPage( "Cannot generate the page" );
   }
}

function pageHeader( user ) {
  var html = document.getElementById("header");
  var str = html.innerHTML;
  var userName = (function getRandomName( ) {
            var names = [ "Asgaroth", "Gabriel", "Lilith", "Ishtar", "Hel", "Abaddon" ];
            return names[Math.floor(Math.random()*(names.length))];
  })();

  var userHP   = user.health;
  var newHTML  = str.replace(/@/, userName );

  newHTML = newHTML.replace(/\+/, function(match){ 
            var hp= "o"; 
            for( i = 0 ; i < userHP-1 ; i++ ) hp += "o";      
         return hp;
  });
  html.innerHTML = newHTML;
}

/*
 * Codes :
 *    0 -- empty cell    "  "
 *                       "  "
 *    1 -- right cell  
 *                       " #"
 *                       " #"
 *    2 -- bottom cell 
 *                       "  "
 *                       "##"
 *    3 -- both
 *                       " #"
 *                       "##"
 *    10 -- heal-items   "!"
 *    20 -- trap-items   "."
 *    30 -- other-users  "W"
 *    40 -- main-user    "@"            
 */

function pageBody( maze, mobs ) {
  

  var width       = maze.params.width;
  var height      = maze.params.height;
  var user        = session.user.pos; // scalar  
  var area_array  = maze.area;
  var wb, we, hb, he;  
  var BLOCKW = 40, BLOCKH = 20;
  
  var ph = Math.ceil( user / BLOCKW )-1; 
  var pw = user - ph*BLOCKW; 
   

  if( (width - pw) < BLOCKW ) { we = width-1; wb = width - BLOCKW;}
  else if( pw < BLOCKW ) { wb = 0; we = BLOCKW-1;}
  else if((pw < 0) || (pw > width) ) { throw new Error(); }
  else { wb = pw-BLOCKW*Math.floor(pw/BLOCKW); we = wb + BLOCKW-1;}
  if( (height - ph) < BLOCKH ) { he = height-1; hb = height - BLOCKH-1;}
  else if( ph < BLOCKH ) { hb = 0; he = BLOCKH-1;}
  else if((ph < 0) || (ph > hight)) { throw new Error(); }
  else { hb = ph-BLOCKH*Math.floor(ph/BLOCKH); he = hb + BLOCKH-1;}


  var area_string = ( function getLine() {
                  var str = "";
                  for( i = 0; i < BLOCKW*2; i++){ str += "#"; }
                  return str + "#\n";
  })();
  for( i = 0, len = area_array.length; i < len; i++) {
     if( i < mobs.heals.pos.length)  { area_array[mobs.heals.pos[i]] += 10;}
     if( i < mobs.traps.pos.length)  { area_array[mobs.traps.pos[i]] += 20;}
     if( i < mobs.players.pos.length){ area_array[mobs.players.pos[i]] += 30; }
   }
  area_array[user] += 40;
  
  for( j = 0; j < height;  j++) {
      var str1="",str2="", tmp_str1="", tmp_str2="";
      for( i = 0; i < width; i++) {
          if((j<=he)&&(j>=hb)&&(i<=we)&&(i>=wb)) {
            var tmp = area_array[i+j*width];
                 if( tmp == 0){ str1="  ";str2="  ";}
            else if( tmp == 1){ str1=" #";str2=" #";}
            else if( tmp == 2){ str1="  ";str2="##";}
            else if( tmp == 3){ str1=" #";str2="##";}
            else if( tmp == 10){ str1="! ";str2="  ";}
            else if( tmp == 11){ str1="!#";str2=" #";}
            else if( tmp == 12){ str1="! ";str2="##";}
            else if( tmp == 13){ str1="!#";str2="##";}
            else if( tmp == 20){ str1=". ";str2="  ";}
            else if( tmp == 21){ str1=".#";str2=" #";}
            else if( tmp == 22){ str1=". ";str2="##";}
            else if( tmp == 23){ str1=".#";str2="##";}
            else if( tmp == 30){ str1="W ";str2="  ";}
            else if( tmp == 31){ str1="W#";str2=" #";}
            else if( tmp == 32){ str1="W ";str2="##";}
            else if( tmp == 33){ str1="W#";str2="##";}
            else if( tmp == 40){ str1="@ ";str2="  ";}
            else if( tmp == 41){ str1="@#";str2=" #";}
            else if( tmp == 42){ str1="@ ";str2="##";}
            else if( tmp == 43){ str1="@#";str2="##";}
            else { throw new Error();}
            tmp_str1 += str1;
            tmp_str2 += str2;
         }
      }
      if((j<=he)&&(j>=hb)) area_string += "#" + tmp_str1+"\n#"+tmp_str2+"\n";
  }

  area_string = area_string.replace(/@/g, "<span class=\"user\">@</span>");
  area_string = area_string.replace(/!/g, "<span class=\"heals\">!</span>");
  area_string = area_string.replace(/\./g, "<span class=\"traps\">.</span>");
  area_string = area_string.replace(/W/g, "<span class=\"players\">W</span>");
  document.getElementById("maze").innerHTML = area_string; 
}

function printErrorPage( message ) {
  var html = document.getElementById("maze");
  html.innerHTML = "<h1 style=\"color:red;\"> Error:"+message+"</h1>";
}

//============ End of face-making =================


//============ Events =================
function addEvents() {
   document.addEventListener( 'keydown', function(event) {
      switch( event.keyCode ) {
         case  38 : sendMove(JSON.stringify(0)); break;
         case  39 : sendMove(JSON.stringify(1)); break;
         case  40 : sendMobe(JSON.stringify(2)); break;
         case  37 : sendMobe(JSON.stringify(3)); break;
         default : return;
       }
   });
}


