#!/usr/bin/env node -r dotenv/config

const http = require("http");
const { tokenWeather, urlWeatherstack, region } = require("./config");

const weatherRegion = process.argv[2] ? process.argv[2] : region;
const url = `${urlWeatherstack}access_key=${tokenWeather}&query=${weatherRegion}`;

http.get(url, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
        console.log(`statusCode: ${statusCode}`);
        return;
    }

    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => {
        return (rawData += chunk);
    });
    res.on("end", () => {
        let apiResponse = JSON.parse(rawData);
        if (apiResponse.error) {
            console.log(apiResponse.error.info);
        } else {
            console.log(
                `Current temperature in ${apiResponse.location.name} is ${apiResponse.current.temperature}℃`,
            );
        }
    });
}).on("error", (err) => {
    console.error(err);
});
