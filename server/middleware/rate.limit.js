const rateLimit = require('express-rate-limit');
const CreateRateLimiter =(maxRequests, time) => {

    return rateLimit({
        windowMs: time, // Time window in milliseconds
        max: maxRequests, // Maximum number of requests allowed within the time window
        message: 'Too many requests, please try again later.', // Response message when limit is exceeded
        //standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};


module.exports = CreateRateLimiter;