require('dotenv').config();

 const express = require('express')
 const app = express()
  const port = process.env.PORT_NO
const Router = require('./routes/auth/auth')
const mongoose = require('mongoose');

app.use(express.json())
app.use('/api', Router)

  const connectToDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Database connected successfully ❤️💙');
    } catch (err) {
      console.error('Database connection error: ', err);
      process.exit(1); 
    }
  };

  const startServer =  async() => {
        await connectToDatabase();
    app.listen(port, () => {

        console.log(`Server is running on port ${port}  🚀`);
    });


  }
  startServer();/// start the server
