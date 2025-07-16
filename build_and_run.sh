#!/bin/bash
set -eou pipefail



npm install --prefix client
npm install

npm run build --prefix client


echo "Searching for mongodb in the network"
export SERVICEIP=`for i in {0..255} ; do result=$(curl -s --connect-timeout 0.05 10.0.1.$i:27017) ; if [[ "$result" == *"MongoDB"* ]] ; then echo $i ; break ; fi ; done`
echo "Found at 10.0.1.$SERVICEIP"

. /opt/devconnectorSecrets
echo "Found jwt secret: $JWT_SECRET"

myip=`curl ifconfig.me`

curl -f -u ${NOIP_USERNAME}:${NOIP_PASSWORD} "http://dynupdate.no-ip.com/nic/update?hostname=christianschenk.freedynamicdns.net&myip=$myip"

export NODE_CONFIG="{\"jwtSecret\":\"$JWT_SECRET\",\"mongoURI\": \"mongodb://10.0.1.$SERVICEIP:27017/?retryWrites=true&w=majority&appName=DevConnector\",\"githubClientId\":\"${GITHUB_CLIENTID}\",\"githubSecret\":\"${GITHUB_SECRET}\"}"

/usr/bin/node /opt/devconnector/repo/server.js



