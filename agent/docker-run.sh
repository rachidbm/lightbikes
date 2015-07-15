## Start in Docker
#$(boot2docker shellinit)

export HOST="ws://`boot2docker ip`:3000";



if [ "$1" == "" ]; then	
	docker run --name lightbikes-robot rachidbm/lightbikes-robot;
	#docker run -P --name lightbikes-robot --link lightbikes-server:lightbikes-server rachidbm/lightbikes-robot;
	exit;
fi
NR=$1

echo "nr of conatainers to start: $NR";
for (( c=1; c<=$NR; c++ )) do
	echo $c;
  #docker run rachidbm/lightbikes-client;
  docker run -d rachidbm/lightbikes-robot;
done



## docker ps -f "image=lightbikes-client"

## Stop all running containers: 
# docker stop `docker ps -q -f "status=running"`

## Stop container latest started: 
# docker stop `docker ps -q  -f "status=running" -n 1`


### Start in bash
#npm start;