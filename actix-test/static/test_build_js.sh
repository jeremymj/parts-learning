unset http_proxy
unset https_proxy

cd /home/jeremy/work/ClionProjects/self/demo/self-wlib
rm -rf self-wlib-1.0.0.tgz 
webpack index.js
npm pack
cp self-wlib-1.0.0.tgz /home/jeremy/work/ClionProjects/parts-learning/actix-test/static

cd /home/jeremy/work/ClionProjects/parts-learning/actix-test/static
npm install self-wlib-1.0.0.tgz
webpack index.js
echo "update js file is over!"
