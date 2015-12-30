#   Map 
#   ===
#    JS-object:
#    var maze = {
#       params : {
#          width  : <VALUE>,
#          heigth : <VALUE>
#       },
#       area : [ <ARRAY> ]
#    }; 
# 
#    JSON string:
#    {
#       "params" : {
#          "width"  : <VALUE>,
#          "heigth" : <VALUE>
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
#          }
#       },
#       "players" : {
#          "pos"      :  [ <ARRAY> ]
#       }
#    }
# 
#  Init_object
#  ===========
#  
#  var init = {   
#     maze    : <maze-object>
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



# Use global: size, sizeX, sizeY. Return: json
function maze_to_json(maze) {

   old_delim = FS
   FS=" "

   template = "{\"params\":{\"width\":\"%d\",\"heigth\":\"%d\"},\"area\": [%s]}"
   area = maze[0]
   for ( i = 1; i < size; i++)
      area = area RT "," RT maze[i]
   json = sprintf( template, sizeX, sizeY, area )

   FS = old_delim

   return json
}

#Use global: amountUser. Return: json
function content_to_json(mods, users, UID) {
 
   old_delim = FS
   FS = " "

   template_user = "{\"user\":{\"ID\":%d,\"health\":%d,\"pos\":%d},"
   template_items = "\"mobs\":{\"traps\":{\"pos\":[%s]},\"heals\":{\"pos\":[%s]},"
   
   template_others = "\"players\":{\"pos\":[%s]}"

   for( i = 0; i < amountUser; i++){
      if( i == UID) {
         user = sprintf(template_user, i, users[i][1], users[i][0])
      }
      else {
         players = users[i][0] RT "," players         
      }
   }
   gsub(/,$/,"", players); 

   # This condition correspond to the error:
   # either user's port is incocrrect or my algorithm failed. 
   if( user == "" ) {
      user = sprintf( template_user, -1, -1, -1)
   }
   # If there is only one user at the time.
   if( players == "") {
      players = sprintf(template_others, -1)
   }
   
   for( i = 0; i < amountFruits; i++ )
      heals = mods[i] RT "," heals 
   gsub(/,$/,"",heals)
   for( i = amountFruit; i < amountTraps+amountFruits; i++)
      traps = mods[i] RT ","traps
   gsub(/,$/,"",traps)

   mobs    = sprintf( template_items, traps, heals)
   players = sprintf( template_others, players)
   result  = user RT mobs RT players RT "}"

   FS = old_delim
   return result
}

function init_to_json( UID, users, maze, mods,     json){
   template_init = "{\"maze\":\"%s\",\"content\":\"%s\"}"
   maze_json = maze_to_json( maze )
   content_json = content_to_json(mods, users, UID)

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
      print "Error: cannot parse JSON-string in function 'from_jsob'"
   return user_state  
}
