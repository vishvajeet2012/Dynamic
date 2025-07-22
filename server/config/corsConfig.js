const cors = require('cors');

const configureCors= (app)=>{
        return cors({

            origin:(origin , callback)=>{
                const allowedOrigins = [`http://localhost:5173`, `https://dynamicvstore.vercel.app`,`https://dynamicvstore-git-main-vishuus-projects.vercel.app`,`https://dynamicvstore-vishuus-projects.vercel.app`];
                if(!origin || allowedOrigins.indexOf(origin) !== -1){
                    callback(null, true);
                }
                else{
                    callback(new Error(`CORS policy does not allow access from origin ${origin}`));
                }
            },
            methods:['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With',"Accept-Version"],
            exposedHeaders:[`X-Total-Count`, `X-Pagination-Page`, `X-Pagination-Page-Size`],
          //  credentials:true,// Allow cookies to be sent with requests,// enable support fo cookies
            preflightContinue:false, // Pass the CORS preflight response to the next handler
            maxAge: 600, // Cache preflight response for 10 minutes ->avoid  sending option  requests multiople times
            optionsSuccessStatus: 204 // Use 204 for successful OPTIONS requests


        })



}

module.exports= configureCors;