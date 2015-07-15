
## Set the environment for docker with: 
echo 'Having problems? Try again after running: ';
echo '$(boot2docker shellinit)';

export HOST="ws://`boot2docker ip`:3000";
#export HOST="ws://localhost:3000";


if [ "$1" == "" ]; then	
	#docker run --name lightbikes-robot rachidbm/lightbikes-robot;
	docker run -e "HOST=$HOST" rachidbm/lightbikes-robot;
	exit;
fi
NR=$1

echo "nr of conatainers to start: $NR";
for (( c=1; c<=$NR; c++ )) do
	echo $c;
  docker run -d -e "HOST=$HOST" rachidbm/lightbikes-robot;
done



## docker ps -f "image=lightbikes-client"

## Stop all running containers: 
# docker stop `docker ps -q -f "status=running"`

## Stop container latest started: 
# docker stop `docker ps -q  -f "status=running" -n 1`


### Start in bash
#npm start;