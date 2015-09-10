#docker run -p 3000:3000 rachidbm/lightbikes-server
echo "IP address of Docker containers: `boot2docker ip`";
#docker --tlsverify=false run -p 3000:3000 rachidbm/lightbikes-server
docker --tlsverify=false run -p 3000:3000  \
	-v "$PWD/../3d-client":/usr/src/3d-client \
	-v "$PWD/../client":/usr/src/client \
	rachidbm/lightbikes-server 

## Run the server on a different port : -p 9000:3000
