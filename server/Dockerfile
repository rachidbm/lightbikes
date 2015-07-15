# To build:
# 1. Install docker (http://docker.io)
## Build the container with: 
# docker build -t rachidbm/lightbikes-server .
## Forward ports of Virtual Box (needed for boot2docker in osx)
# VBoxManage modifyvm "boot2docker-vm" --natpf1 "guestnginx,tcp,,3000,,3000"
## Run:
# docker run rachidbm/lightbikes-server
## Try: eval "$(boot2docker shellinit)"
## And: export DOCKER_TLS_VERIFY=0

## Build and run: 

# $(boot2docker shellinit) && docker build -t rachidbm/lightbikes-server . && docker run rachidbm/lightbikes-server

FROM node:0.10-onbuild
EXPOSE  3000 
#9000
