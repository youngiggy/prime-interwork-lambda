
const redis = require('redis');
const moment = require('moment-timezone');

const cacheKey = 'callback-' + moment().tz("Asia/Seoul").format('YYYYMMDD');
const cachePort = process.env.CACHE_PORT ? process.env.CACHE_PORT : 6379;
const cacheHost = process.env.CACHE_HOST ? process.env.CACHE_HOST : '127.0.0.1';
const cacheClient = redis.createClient(cachePort, cacheHost);

exports.handler = async (event) => {
    const requestData = JSON.stringify(event, null, 2);

    const responseDummies = {
        "core": {
            "default": {
                "result": "SUCCESS",
                "error_message": ""
            }
        }
    };

    //다른 response를 보내야 할 때 이곳을 수정할 것
    const responseData = responseDummies.core.default;

    const cacheValue = JSON.stringify({
        "created_at" : moment().tz("Asia/Seoul").format(),
        "request" : requestData,
        "response" : responseData
    }, null, 2);

    //for checking on CloudWatch
    console.log('Received event: ', requestData);

    //for checking on Dev Console
    cacheClient.lpush(cacheKey, cacheValue, function (err, data) {
        if (err) {
            console.log("error: " + err);
            return;
        }

        const expireAfter = 60 * 60 * 24 * 3;
        cacheClient.expire(cacheKey, expireAfter);

        console.log(expireAfter + "-second-life cached: " + cacheValue);
    });

    return responseData;
};
