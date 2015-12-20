#include <semaphore.h>
#include <fcntl.h>
#include <stdio.h>
#include <time.h>
main(){
	int locker;
	struct timespec tw = {1, 020000000}, tr;

	for (;;) {
		if ((locker = open("maze.lock", O_EXCL | O_CREAT)) != -1) {
			close(locker);
			fprintf(stdout, "locked");
			return 0;
		}
		nanosleep (&tw, &tr);
	}
}
