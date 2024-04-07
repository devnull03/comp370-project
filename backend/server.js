const express = require('express');
// const { MongoClient, ServerApiVersion } = require('mongodb');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { process_image } = require('./openai');
const { find_places } = require('./places');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const saltRounds = 10;  
const app = express();
app.use(cookieParser());
require('dotenv').config();
const uri = process.env.URI || " ";
const PORT = process.env.PORT || 1345;
const frontend = process.env.FRONTEND_URL || "https://comp370-project-frontend.vercel.app/";

app.use(express.json({ limit: '50mb' }));

const secretKey = 'your-secret-key';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



// Error handling middleware
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://comp370-project-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === "OPTIONS") { 
    return res.sendStatus(204);
  }
  next();
});

const jwtAuthentication = (req, res, next) => {
    const token = req.cookies.access_token;
    try {
        const payload = jwt.verify(token, secretKey);
        console.log(payload);
        req.payload = payload
        next()
    } catch (err) {
        res.clearCookie('token');
        res.status(401).json({
            success: false,
            error: "error",
            message:"error"
        });
    }
}

app.post('/api/process_image', async (req, res) => {

  try {
    let api_res = await process_image(req.body.image);
    res.json(api_res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/get_locations', async (req, res) => {
  try {
    let api_res = await find_places(req.body.bin, req.body.label, req.body.location);
    res.json(api_res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
