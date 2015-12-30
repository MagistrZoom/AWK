//============ Begin of global-object space =================

function SessionProperties( UID, maze ) {
   this.UID = UID;
   this.maze = maze;
}
/* Have to be created in the network space. */
var session; 

//============ End of global-object space    =================

//============ Begin of network space    =================
function load_page() {
   try {
      if( session === undefined ) {
            console.log( "Ugly" );
            sendInit( function() {
            var init = JSON.parse(this);                               
            var maze = JSON.parse(init.maze);
            var content = JSON.parse(init.content);
            session = new SessionProperties( content.user.ID, maze );
            initFrames( content ); 
            
         }); 
      }
   }
   catch( err ) {
      printErrorPage( err.message + "  in load_page()");
   }
}; 

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

function sendInit( callback ) {
   var req = getXmlHttp(); 
   req.onreaystatechange = function() {
      if( req.readyState == 4 ){
         callback.call( req.responseText );
      }
   };
   req.open( "GET", "/ajax_get/init", true );
   req.send();
}

function sendMove( move ) {
   var req = getXmlHttp();
   req.onreadychange = function() {
      callback.call( req.responseText );        
   };
   req.open( 'POST', true);
   req.setRequestHeader( "Content-type", "application/json");
   req.send('/move:' + move + session.UID + '\r\n\r\n');

}

/* Update under timeout for multiplayer mode. */
function getState( ) {
   var req = getXmlHttp();
   req.onreadychange = function() {
      
   };
   req.open( 'GET', '/ajax_get/get_statement:'+ session.UID, true);
}

//============ End of network space =================

//============ Begin of face-making =================

function initFrames( content ) {

   try{
      pageHeader( content.user );
      pageBody( session.maze, content  );
      addEvents();
   }
   catch( err ){
      printErrorPage( err.message + " in initFrames()");
   }
}

function changePageState( content ) {
   try{
      pageHeader( content.user );
      pageBody( session.maze, content );
   }
   catch( err ) {
      printErrorPage( err.message + " in changePageState" );
   }
}


function pageHeader( user ) {
  var html = document.getElementById("header");
  var str = html.innerHTML;
  var userName = (function getRandomName( ) {
            var names = [ "Asgaroth", "Gabriel", "Lilith", "Ishtar", "Hel", "Abaddon" ];
            return names[Math.floor(Math.random()*(names.length))];
  })();

  var newHTML  = str.replace(/@/, userName );
  newHTML = newHTML.replace(/\+/, function(match){ 
         var hp= ""; 
         for( i = 0, HP =  user.health/2; i < HP ; i++ ) 
               hp += "o";      
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

function pageBody( maze, content ) {
  

  var width       = maze.params.width,
      height      = maze.params.height,
      user        = content.user.pos, // scalar  

      area_array  = maze.area,
      mobs        = content.mobs;
   

  var wb, we, hb, he,
      BLOCKW = 40, BLOCKH = 20;
  
  var ph = Math.ceil( user / BLOCKW )-1,
      pw = user - ph*BLOCKW; 
   

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

  /* Oops. :) */
  for( i = 0,
     len = area_array.length,
      hl = mobs.heals.pos.length, 
      tl = mobs.traps.pos.length,
      pl = mobs.players.pos.length;
                                    i < len; i++) {
     if( i < hl)  { area_array[mobs.heals.pos[i]]   += 10;}
     if( i < tl)  { area_array[mobs.traps.pos[i]]   += 20;}
     if( i < pl)  { area_array[mobs.players.pos[i]] += 30;}
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
      var move;
      switch( event.keyCode ) {
         case  38 : move = 0; break;
         case  39 : move = 1; break;
         case  40 : move = 2; break;
         case  37 : move = 3; break;
         default : return;
       }
       sendMove( move, function() { 
         var content = JSON.parse(this);
         console.log( content );
         changePageState( content );
       });
   });
}
