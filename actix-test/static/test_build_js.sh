#!/bin/bash

unset http_proxy
unset https_proxy

if [ $1 = "true" ];then
   npm install
fi

webpack index.js
echo "update js file is over!"
