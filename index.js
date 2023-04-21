const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine",ejs);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

mongoose.connect("mongodb+srv://aravindben562:bye4lnIEW5bd0hGh@cluster0.o0an6jm.mongodb.net/productsDB");

const productSchema = new mongoose.Schema({
  Product_ID : {
    type : String,
    required : true,
    index : {
      unique : true,
      sparse : true
  }
  },
  Name : {
    type : String,
    required : true
  },
  Price: {
    type : Number,
    required : true
  },
  Featured : Boolean,
  Rating : Number,
  Created_At : {
    type: Date,
    required : true
  },
  Company : {
    type : String,
    required : true
  }
});

const product = mongoose.model("Product",productSchema);

app.route("/")

.get(async function(req,res){
  res.setHeader('Access-Control-Allow-Origin', 'https://prod-rest-c4cv.onrender.com/');
  try{
    const items = await product.find({});
    res.send(items);
  }
  catch(err){
    res.send(err);
  }
})

.post(async function(req,res){
  const product_id = req.body.product_id;
  const name = req.body.name;
  const price = req.body.price;
  const featured = req.body.featured;
  const created_at = req.body.created_at;
  const company = req.body.company;
  const rating = req.body.rating;
  console.log(req.body);
  const data = new product({
     Product_ID:product_id,
     Name : name,
     Price : price,
    Featured : featured,
    Rating : rating,
    Created_At : created_at,
    Company: company
  });
  try{
        await data.save();
        res.status(200).send("recorded successfully")
    }
    catch(err){
        res.status(404).send(err)
    }
});

app.route("/:prod_id")

.patch(async function(req,res){
  const key = Object.keys(req.body)[0];
  const value = Object.values(req.body)[0];
  var obj = {};
  obj[key] = value;
  await product.findOneAndUpdate({Product_ID : req.params.prod_id}, obj, {new : true});
  res.send("Success");
})

.delete(async function(req,res){
    await product.findOneAndDelete({Product_ID:req.params.prod_id});
    res.send("Deleted");
});

app.route("/featured")

.get(async function(req,res){
  try{
    const data = await product.find({Featured : true});
    res.send(data);
  }
  catch(err){
    res.send(err);
  }
});

app.route("/price/:value")

.get(async function(req,res){
  try{
    const data = await product.find({Price : {$lt : req.params.value}});
    res.send(data);
  }
  catch(err){
    res.send(err);
  }
});

app.route("/rating/:value")

.get(async function(req,res){
  try{
    const data = await product.find({Rating : {$gt : req.params.value}});
    res.send(data);
  }
  catch(err){
    res.send(err);
  }
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Running Successfully");
})
