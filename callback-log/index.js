
const redis = require('redis');
const moment = require('moment-timezone');

const cacheKey = 'callback-' + moment().tz("Asia/Seoul").format('YYYYMMDD');
const cachePort = process.env.CACHE_PORT ? process.env.CACHE_PORT : 6379;
const cacheHost = process.env.CACHE_HOST ? process.env.CACHE_HOST : '127.0.0.1';
const cacheClient = redis.createClient(cachePort, cacheHost);

exports.handler = async (event) => {

    console.log('retrieving cache of ' + cacheKey);
    let responseData = {};

    // async function func (cacheKey) {
    //     return cacheClient.lrange(cacheKey, 0, 100, function (err, data) {
    //         if (err) {
    //             console.log("error: " + err);
    //             return;
    //         }
    //         console.log("data: " + data);
    //         responseData = data;
    //     });
    // };
    function squareOfNumberAfter2Seconds(number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(number * number)
            }, 2000)
        })
    }
    async function calculate() {
        try {
            let responseOne = await squareOfNumberAfter2Seconds(10);
            return responseOne;
        }
        catch(error) {
            return error;
        }
    }

    //for checking on Dev Console
    const result = await calculate();

    console.log("result: " + result);

    return responseData;
};
