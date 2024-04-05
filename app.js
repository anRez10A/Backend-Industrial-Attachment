const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');




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

app.get('/recipes', async (req, res, next) => {
   
        await client.connect();
        const database = client.db('recipeBook');
        const recipeCollection = database.collection('recipe');
        const recipes = await recipeCollection.find().toArray();
        return res.status(200).json(recipes);
   
});

app.post('/recipes', async (req, res, next) => {
  const { recipeName,ingredients, description, category} = req.body;
  try {
      await client.connect();
      const database = client.db('recipeBook');
      const recipeCollection = database.collection('recipe');
      
      const recipe = await recipeCollection.insertOne({
        recipeName,
        ingredients,
          description,
          category,
         
      });

      return res.status(200).json(recipe);
    } finally {
      // await client.close();
    }
});