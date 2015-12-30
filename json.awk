#   Map 
#   ===
#    JS-object:
#    var maze = {
#       params : {
#          width  : <VALUE>,
#          height : <VALUE>
#       },
#       area : [ <ARRAY> ]
#    }; 
# 
#    JSON string:
#    {
#       "params" : {
#          "width"  : <VALUE>,
#          "height" : <VALUE>
#       },
#       "area" : [ <ARRAY> ]
#    }
#
# Content 
# =======
#    JS-object:
# 
#    var content = {
#       user : {
#          pos    : <CELL>,
#          ID     : <ID>,
#          health : <HP>,
#       },
#       mobs : {
#          trap : {
#             pos : [ <ARRAY> ] 
#          },
#          heal : {
#             pos : [ <ARRAY> ] 
#          }
#       },
#       players : {
#          pos    : [ <ARRAY> ]      
#       }
#    };
# 
#    JSON-object: 
#    {
#       "user": {
#          "ID"       : <ID>,
#          "health"   : <HP>
#          "pos"      : <CELL>,
#       },
#       "mobs" :  {
#          "traps" : {
#                "pos" : [ <ARRAY> ]
#          },
#          "heals" : { 
#                "pos" : [ <ARRAY> ]
#          },
#          "players" : {
#                 "pos"      :  [ <ARRAY> ]
#           }
#       }
#    }
# 
#  Init_object
#  ===========
#  
#  var init = {   
#     maze    : <maze-object>,
#     content : <content-object> 
#  };
#
#  JSON 
#  {
#     "maze"   : "json-maze" 
#     "conent" : "json-conent"
#  }
#

# port     -- port of the main user
# filename -- name of file with data
# OR string is more suitable? 



# Use global: size, sizeX, sizeY 
function maze_to_json(maze ) {

   template = "{\"params\":{\"width\":\"%d\",\"height\":\"%d\"},\"area\": [%s]}"
   area = maze[0]
   for ( i = 1; i < size; i++)  
      area = area ","  maze[i]
   json = sprintf( template, sizeX, sizeY, area )
   
   return json
}

#Use global: amountUsers
function content_to_json(mods, users, UID ) {


   template_user = "{\"user\":{\"ID\":%d,\"health\":%d,\"pos\":%d},"
   template_mobs = "\"mobs\":{\"traps\":{\"pos\":[%s]},\"heals\":{\"pos\":[%s]},"
   template_players = "\"players\":{\"pos\":[%s]}"

   jplayers = ""
   juser = ""
   jtraps = ""
   jheals = ""
  
   print "\n1: " amountUsers "\n"
   print "2: " amountFruits "\n"
   print "3: " amountTraps "\n"
   print "4: " amountUsers "\n"


   for( i = 0; i < amountUsers; i++){
      if( i == UID) {
         juser = sprintf(template_user, i, users[i][1], users[i][0])
      }
      else {
         jplayers = users[i][0] "," jplayers         
      }
   }
   gsub(/,$/,"", jplayers); 

   # This condition correspond to the error:
   # either user's port is incocrrect or my algorithm failed. 
   if( juser == "" ) {
      juser = sprintf( template_user, -1, -1, -1)
   }
   # If there is only one user at the time.
   if( jplayers == "") {
      jplayers = sprintf(template_players, -1)
   }
   else {
      jplayers = sprintf( template_players, jplayers)
   }
   
   for( i = 0; i < amountFruits; i++ )
      jheals = mods[i] "," jheals 
   gsub(/,$/,"",jheals)
   for( i = amountFruits; i < amountTraps+amountFruits; i++)
      jtraps = mods[i] ","jtraps
   gsub(/,$/,"",jtraps)

   jmobs    = sprintf( template_mobs, jtraps, jheals)
   result  = juser  jmobs  jplayers "}"

   return result
}


function init_to_json( UID, users, maze, mods,     json){
   template_init = "{\"maze\":\"%s\",\"content\":\"%s\"}"
   maze_json = maze_to_json( maze )
   content_json = content_to_json(mods, users, UID) "}"
   gsub(/"/, "\\\"", content_json );
   gsub(/"/, "\\\"", maze_json );
   return sprintf(template_init, maze_json, content_json )
}

# From clients server gets the information about users' movements. 
#
#  
#  JS-object
#        var state = { 
#               ID   : <ID>, 
#               move : <MOVE>   
#  
#  JSON-object
#     { 
#        "ID"  : <ID>,
#        "move": <move> 
#     }
#
#     MOVE -> [ 0, 1, 2, 3]
#       --  0 - up
#       --  1 - right
#       --  2 - down 
#       --  3 - left
#

# user_state[1] -- UID
# user_state[2] -- direction
function from_json( json ) {
   json = "{\"ID\":2,\"move\":1}"
   if( match( json, /"ID":([0-9]*).*":([0-9]*)/, user_state) == 0 )
      print "Error: cannot parse JSON-string in function 'from_json'"
   return user_state  
}
