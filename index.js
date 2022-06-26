const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
const requests = require('requests');
const port = process.env.PORT || 4000;

const file = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let arrdata  = tempVal.replace("{%tempval%}", orgVal.main.temp);
        arrdata  = arrdata.replace("{%tempmin%}", orgVal.main.temp_min);
        arrdata  = arrdata.replace("{%tempmax%}", orgVal.main.temp_max);
        arrdata  = arrdata.replace("{%location%}", orgVal.name);
        arrdata = arrdata.replace("{%country%}", orgVal.sys.country);
        arrdata = arrdata.replace("{%status%}", orgVal.weather.main);
        
        return arrdata;
};

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=ludhiana&appid=08d8d997dffab7bdfb367b1e8d3f00eb")
        .on('data',  (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            //console.log(arrdata[0].main.temp);
            const realTimeData = arrdata.map(val => replaceVal(file, val)).join("");
            console.log(realTimeData);
            res.write(realTimeData);
        })
        .on('end',  (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });

    }
});

server.listen(`${port}`)
