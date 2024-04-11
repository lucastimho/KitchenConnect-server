// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Define Schema and Model for Recipe
const recipeSchema = new mongoose.Schema({
    title: String,
    chef: String,
    ingredients: [String],
    directions: String,
    prep_time: Number,
    image_url: String
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// Routes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.json(recipe);
    } catch (err) {
        res.status(404).json({ message: "Recipe not found" });
    }
});

app.post('/recipes', async (req, res) => {
    const recipe = new Recipe({
        title: req.body.title,
        chef: req.body.chef,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        prep_time: req.body.prep_time,
        image_url: req.body.image_url
    });
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (req.body.title) {
            recipe.title = req.body.title;
        }
        if (req.body.chef) {
            recipe.chef = req.body.chef;
        }
        if (req.body.ingredients) {
            recipe.ingredients = req.body.ingredients;
        }
        if (req.body.directions) {
            recipe.directions = req.body.directions;
        }
        if (req.body.prep_time) {
            recipe.prep_time = req.body.prep_time;
        }
        if (req.body.image_url) {
            recipe.image_url = req.body.image_url;
        }
        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/recipes/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndRemove(req.params.id);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});