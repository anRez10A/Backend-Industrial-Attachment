const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://Srezwana:u2zNhIFKjm9yCDYP@cluster0.zttubvy.mongodb.net/";
const client = new MongoClient(uri); 

router.get('/', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('recipeBook');
        const taskCollection = database.collection('recipe');
        const tasks = await taskCollection.find().toArray();
        return res.status(200).json(tasks);
    } finally {
        await client.close();
    }
});