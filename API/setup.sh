sudo apt-get install nfs-common
sudo mkdir efs
sudo mount -v -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport fs-0d534c34.efs.ap-southeast-2.amazonaws.com:/ efs
