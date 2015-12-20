BEGIN {
	amountUsers = 0;

	STARTHP = 100;
	clientPort = ARGV[1];

	OFS = "";
	MAZE = "maze";
	DATA = "data";

	sizeX = 0;
	sizeY = 0;
	size = 0;

	srand();
#ID = serverPort;
	ID = 20;
	
	start();
}

function start() {
	loadMaze();
	addUser(ID);

	deleteUser(ID);
}

function addUser(id) {
	lock();
	updateInf();
	print(getFreeCell()" "STARTHP" "id) >> DATA;
	close(DATA);
	unlock();

	amountUsers++;
}

function updateInf(  i,j) {
	getline amountFruits < DATA;

	for(i = 0; i < amountFruits; i++) {
		getline mods[i] < DATA;
	}
	getline amountTraps < DATA;

	for(i = amountFruits; i < amountFruits + amountTraps; i++) {
		getline mods[i] < DATA;
	}
	amountUsers = 0;
	while(getline i < DATA > 0) {
		for(j = 1; j <= 3; j++) {
			users[amountUsers][j] = 0;
		}
		split(i, users[amountUsers], " ");
		amountUsers++;
	}

	close(DATA);
}

function writeMods(  i) {
	print(amountFruits) > DATA;
	for(i = 0; i < amountFruits; i++) {
		print(mods[i]) >> DATA;
	}
	print(amountTraps) >> DATA;
	for(i = amountFruits; i < amountFruits + amountTraps; i++) {
		print(mods[i]) >> DATA;
	}
	close(DATA);
}

function writeUsers(  i) {
	for(i = 0; i < amountUsers; i++) {
		print(users[i][1]" "users[i][2]" "users[i][3]) >> DATA;
	}
	close(DATA);
}

function deleteUser(ID, x,list) {
	lock();
	getline list < DATA;
	while(getline x < DATA > 0) {
		if(!match(x,".+ .+ "ID"\\>"))
			list = list"\n"x;
	}
	print(list) > DATA;
	close(DATA);
	unlock();
}

#!update+lock!!!
function replaceMod(cell, newCell,list) {
	newCell = getFreeCell();

	getline list < DATA;
	while(getline x < DATA > 0) {
		if(!match(x,cell))
			list = list"\n"x;
	}
	print(list) > DATA;
	close(DATA);
}

function randCell() {
	return int((size - 1) * rand());  
}

function getFreeCell( r,rep,i) {
	rep = 1;

	while(rep) {
		rep = 0;
		r = randCell();

		for(i = 0; i < amountFruits + amountTraps; i++) {
			if(mods[i] == r) {
				rep = 1;
				break;
			}
		}
		for(i = 0; i < amountUsers; i++) {
			if(users[i][1] == r) {
				rep = 1;
				break;
			}
		}
	}
	return r;
}

function loadMaze( x,y,i,bounds) {
	getline x < MAZE;
	y[1] = 0; y[2] = 0;
	split(x,y," "); 
	sizeX = y[1]; sizeY = y[2]; size = y[1] * y[2];

	getline x < MAZE;
	for(i = 0; i < size; i++){
		bounds = substr(x, i + 1, 1);
		bottomBound[i] = 0;
		rightBound[i] = 0;
		if(bounds >= 2) bottomBound[i]++;
		if((bounds == 3)||(bounds == 1)) rightBound[i]++;
	}
	print bottomBound[0]; print rightBound[0];
	print bottomBound[1599]; print rightBound[1599];
}

function lock( input) {
	"./lock" | getline input;
	close("./lock");
}

function unlock() {
	system("rm -f maze.lock");
}
