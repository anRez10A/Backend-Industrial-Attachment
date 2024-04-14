const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware.js');

var jwt = require('jsonwebtoken');
const JWT_SECRET = "toDo";


dotenv.config();
const app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



module.exports = app;

const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://Srezwana:u2zNhIFKjm9yCDYP@cluster0.zttubvy.mongodb.net/";
const client = new MongoClient(uri); 

app.get('/recipes',authMiddleware, async (req, res, next) => {
   
        await client.connect();
        const database = client.db('recipeBook');
        const recipeCollection = database.collection('recipe');
        const recipes = await recipeCollection.find().toArray();
        return res.status(200).json(recipes);
   
});

app.post('/recipes',authMiddleware, async (req, res, next) => {
  const { recipeName,ingredients, description, category} = req.body;
  try {
      await client.connect();
      const database = client.db('recipeBook');
      const recipeCollection = database.collection('recipe');
      
      const recipe = await recipeCollection.insertOne({
        recipeName,
        ingredients,
        description,
        category
      });

      return res.status(200).json(recipe);
    } finally {
      // await client.close();
    }
});

app.delete('/recipes/:id', authMiddleware,async (req, res, next) => {
  const { id: recipeIdToDelete } = req.params;
  try {
      await client.connect();
      const database = client.db('recipeBook');
      const recipeCollection = database.collection('recipe');
      const query = {"_id": new ObjectId(recipeIdToDelete)};
      const deleteResult = await recipeCollection.deleteOne(query);
      return res.status(200).json(deleteResult);
  } finally {
      //await client.close();
  }
});

app.post('/users', async (req, res, next) => {
    const { userName, email, password} = req.body;
    try {
        await client.connect();
        const database = client.db('recipeBook');
        const userCollection = database.collection('users');
        
        const recipe = await userCollection.insertOne({
            userName,
            email,
            password
        });
  
        return res.status(200).json(recipe);
      } finally {
        //await client.close();
      }
  });

  // logIn Authentication

  const TOKEN_KEY = 'ABCXYZ';

app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        await client.connect();
        const database = client.db('recipeBook');
        const userCollection = database.collection('users');
        console.log(email);
        const user = await userCollection.findOne({email});
        if(user){
            console.log("success");
            if(user.password === password){
                console.log("Password Checked");
                const data = {
                    users:{id: user.id}
                };

                const authToken = jwt.sign(
                    data,
                    TOKEN_KEY,
  
                );

                console.log('Generated Token:', authToken); // Log the token

                return res.json({token: authToken, success: true});
                
            }
            else{
                return res.json({token: null, success: false});
            }
        }

        
        else{
            return res.json({massage: 'Invalid UserName or Password', success: false});
        }

      } finally {
        await client.close();
      }

      
});

app.get('/login/customer', authMiddleware, async (req, res, next) => {

     return res.json({checked: 'true'});

});
