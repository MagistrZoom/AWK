#Documentation   

##Game-logic

###Maze
####Parameters 
 maze[] -- array of borders (global).
  
| Code  | Type  |
| ----- |:-----:|
| 0 |empty| 
| 1 |bottom| 
| 2 |right|
| 3 |both|

size -- size of maze (global)   
sizeX -- width (global)   
sizeY -- height (global)   

###Content 
mods[] -- array of mobs' position -- traps, fruits (global).     
amountFruits, amountTraps - count of fruits and trps (global).    


mods[from 0 to (amountFruits - 1)] - fruits   
mods[from amountFruits to (amountTraps - 1)] - traps   

###Players 
users[] - array of all players (global).    
amountUsers -- count of players.          


users[id][] -- array of each user's parameters.  
  users[id][0] - location of user   
  users[id][1] - HP   

###AJAX GET requests
init

get_statement:UID
  UID - integer

###AJAX POST Requests
move:DIRECTION UID
  DIRECTION: 0 to 3 NESW
  UID: integer
=======

###JSON
####Objects format 
1. Maze   
```JSON
{
  "params" : {
    "width" : VALUE,
    "hight" : VALUE
  },
  "area" : [ ARRAY ]
}
```

Params -- parameters of the maze    
  width -- width of the maze    
  hight -- hight of the maze    
Area -- array of maze's borders. Borders described above.    
2. Content  
```JSON 
{
  "user" : {
    "ID"     : ID,
    "health" : HP,
    "pos"    : CELL
  },
  "mobs" : {
    "traps" : {
      "pos" : [ ARRAY ]
    },
    "heals" : {
      "pos" : [ ARRAY ]
    }
  },
  "players" : {
    "pos"   : [ ARRAY ]
  }
}
```
User -- main user.   
 ID     -- user ID,   
 health -- health pointer   
 pos    -- position on the map   
 
Mobs -- mobile content    
  traps  -- reduced HP items    
     pos -- position of traps on the map    
  heals  -- increased HP items   
     pos -- position of heals on the map   

Players -- other players     
  pos   -- position on the map    

3. Init 
```JSON
{
   "maze"   : maze-json,
   "content": content-json
}
```
Maze -- serialized to JSON object 'maze'   

Content -- serialized to JSON object 'conent'

4. User-state
```JSON
{
   "ID"   : ID>,
   "move" : MOVE
}
```
ID -- user's ID   
Move -- code of the direction    

| Code  | Direction  |
| ----- |:----------:|
|0|up| 
|1|right| 
|2|down|
|3|left|
   

#### Functions 
#####Stringify
1. maze_to_json(maze,   json )   
  Return:    json-string (format described above).      
  Parameters:      
      maze -- array of maze's borders      
  Use global variables:       
      size  -- size of the array      
      sizeX -- width of the maze     
      sizeY -- height of the maze     
   
2. content_to_json(mods, users, UID,   json)     
   Return:  json-string (format described adove).    
   Parameters:     
      mods  -- array of mobiles (traps, heals).       
      users -- array of all players on the server.  
      UID   -- current user's ID.
   Use global variables:   
     amountUsers  -- count of users.    
     amountTraps  -- count of traps.    
     amountFruits -- count of heals.   

3. init_to_json( UID, users, maze, mods,     json)   
   Return:  json-string (format described adove).     
   Parameters:   
      Discribes above.   

#####Parse
1. from_json(json,     user_state )     
   Return: array of user's state    
      user_state[1] -- UID    
      user_state[2] -- direction    
   Parameters:    
      json -- json-string with a user-state format described above.    
