const mongoose = require("mongoose")
const Campground = require('../models/campground')
const cities = require("./cities")
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error" , console.error.bind(console,"Connection Error"));
db.once("open", ()=>{
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description: 'Mollit nostrud quis aute proident anim ad ullamco nostrud sunt Lorem. Dolor magna fugiat id sunt. Est aliquip irure quis excepteur non amet laboris mollit enim culpa. Esse do deserunt adipisicing enim magna cillum labore nostrud fugiat excepteur irure nulla.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log("Connection Closed from seed side")
})