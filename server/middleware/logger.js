// const requestLogger = (req, res, next) => {
//     const StrartTime = new Date().toString()
//         const methods = req.method;
//         const url = req.url
//         const userAgent = req.headers['User-Agent'];// Get the User-Agent headeadd
//         console.log(`[${StrartTime}] ${methods} ${url} - User-Agent: ${userAgent}`);
//         next();
    
//     }

//     const addTimeStampt = (req,res,next )=>{
//             req.StrartTime = new Date().toISOString();
//             next();

//     }

//     module.exports= requestLogger