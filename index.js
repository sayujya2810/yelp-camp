const { urlencoded } = require('express')
const express = require('express')
const mongoose = require("mongoose")
const path = require('path')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error" , console.error.bind(console,"Connection Error"));
db.once("open", ()=>{
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/', (req,res)=>{
    res.render("home")
})
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index" , {campgrounds})
})

app.get("/campgrounds/new" , (req,res) => {
    res.render("campgrounds/new");
})
app.post("/campgrounds" , async (req,res) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // res.render("campgrounds/new");
})

app.get('/campgrounds/:id', async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", {campground})
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", {campground})
})

app.put('/campgrounds/:id', async (req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
    // Campground.findByIdAndUpdate(id , {title:"req.body.campground", location:""})
})

app.delete('/campgrounds/:id', async(req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})




// app.get('/makecampground' , async (req,res) => {
//     const camp = new Campground({ title: 'My Backyard', description: "Cheap camping"})
//     await camp.save();
//     res.send(camp);
// })





app.listen(3000, () =>{
     console.log("Lsitening port 3000")
} )
