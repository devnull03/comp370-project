const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { process_image } = require('./openai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const saltRounds = 10;  
const app = express();
app.use(cookieParser());
require('dotenv').config();
const uri = process.env.URI || " ";
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

const secretKey = 'your-secret-key';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



// Error handling middleware
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://sustain-snap-frontend.vercel.app");
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


app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username + email, password);
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Invalid data. Please provide username, email, and password.' });
  }

  try {
    // Connect the client to the MongoDB server (optional starting in v4.7)
    await client.connect();

    // Insert user data into the "Users" collection in the "NWHacks" database
    const database = client.db('NWHacks');
    const usersCollection = database.collection('Users');
    // Check for exisiting username
    const existingUserName = await usersCollection.findOne({ username });
    if (existingUserName) {
      console.log('Username already exists');
      return res.status(400).json({ error: 'Username already in use. ', message: "Username already in use" });
    }
    // Check for exisiting email
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return res.status(400).json({ error: 'Email already in use. ', message: "Email already in use" });
    }
   
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt)
    const newUser = { username, email, password: hashedPassword };
    const result = await usersCollection.insertOne(newUser);
    console.log(`User data inserted with ID: ${result.insertedId}`);
    // Respond with success message and user data
    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {

    await client.close();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid data. Please provide email and password.' });
  }

  try {
    // Connect to MongoDB
    await client.connect();

    // Find the user in the "Users" collection based on email and password
    const database = client.db('NWHacks');
    const usersCollection = database.collection('Users');

    const user = await usersCollection.findOne({ email });
 
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // If no user is found, return an authentication error
      return res.status(401).json({ error: 'Invalid email or password.', message: 'Invalid email or password.' });
    }

    const access_token = jwt.sign({username: user.username}, secretKey, {
        expiresIn: '1hr',
        algorithm: 'HS256'
    });
    res.cookie('access_token', access_token, {
        path:"/",
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 3600000,
    })
    return res.status(200).json({ message: 'Login successful!', user });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
})

app.post('/create_entry', jwtAuthentication, async (req, res) => {
    const {label, pts, image, bin} = req.body;
    const entry = {username: req.payload.username, label, points:pts, image, bin};
    try {
        // Connect to MongoDB
        await client.connect();
        const database = client.db('NWHacks');
        const entryCollection = database.collection('Entries');
        const result = await entryCollection.insertOne(entry);

        const scoreCollection = database.collection('Scores');
        
        await scoreCollection.updateOne(
            {username: req.payload.username}, 
            {$inc: {score: parseInt(pts)}}, 
            {upsert: true});
        return res.status(201).json({ message: 'Entry created successfully!' });
      }
        catch (error) {
        console.error('Error during entry creation:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      } finally {
    
        await client.close();
    } 
})

app.get('/get_user_entries', jwtAuthentication, async (req, res) => {
    try {
        const username = req.payload.username;
        // Connect to MongoDB
        await client.connect();
    
        // Access the "Entries" collection
        const database = client.db('NWHacks');
        const entryCollection = database.collection('Entries');
    
        // Retrieve all entries from the collection
        const entries = await entryCollection.find({username}).toArray();
    
        // Close the MongoDB connection
        await client.close();
    
        // Send the entries as JSON response
        return res.json(entries);
      } catch (error) {
        console.error('Error while fetching entries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.get('/get_leaderboard', async (req, res) => {
    try {
        // Connect to MongoDB
        await client.connect();
    
        // Access the "Entries" collection
        const database = client.db('NWHacks');
        const scoreCollection = database.collection('Scores');
    
        // Retrieve all entries from the collection
        const scores = await scoreCollection.find({}).toArray();
    
        // Close the MongoDB connection
        await client.close();
    
        // Send the entries as JSON response
        return res.json(scores);
      } catch (error) {
        console.error('Error while fetching scores:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.get('/logout', async (req, res) => {
    res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0) 
    });
    return res.status(200).json({ message: "Logout success" });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
