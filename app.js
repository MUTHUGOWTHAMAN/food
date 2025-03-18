
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const saltRounds = 10;
const app = express();
console.log(process.env.API_kEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://muthugowthamanmca:muthugowthamanmca@cluster0.qv4u3.mongodb.net/Foodfantasy",{useNewUrlParser:true});

const adminSchema = new mongoose.Schema({
    email:String,
    password:String,
    productId:String,
    orderId:String,
    productName:String,
    foodamount: Number,
    productCategory:String
})
const cashierSchema = new mongoose.Schema({
    email:String,
    password:String,
    productId:String,
    orderId:String,
    productName:String,
    foodamount: Number,
    productCategory:String
})
const adminDataSchema = new mongoose.Schema({
    productId:String,
    productName:String,
    foodamount: Number,
    productCategory:String
})
const customerSchema = new mongoose.Schema({
    email:String,
    password:String
    
})
const customerDataSchema = new mongoose.Schema({
  
    customerPhNo:Number,
    productName:String,
    productCategory:String,
   
    
})
const cashierDataSchema = new mongoose.Schema({
    orderId:String,
    productId:String,
    productName:String,
    foodamount: Number,
    productCategory:String
})
const cashierOrderSchema = new mongoose.Schema({
    orderNo:Number,
    customerPhNo:Number,
    productId:Number,
    productName:String,
    foodamount: Number,
    productCategory:String,
    date: Date,
    paymentby: Number,
    paymentfor: Number,
    
})

const admin=new mongoose.model("admin",adminSchema)
const cashier = new mongoose.model("cashier",cashierSchema);
const adminData = new mongoose.model("adminData",adminDataSchema );
const customer = new mongoose.model("customer",customerSchema );
const customerData = new mongoose.model("customerData",customerDataSchema );
const cashierOrder = new mongoose.model("cashierOrder",cashierOrderSchema );


app.get("/",function(req,res){
    res.render("home")
})
app.get("/admin",function(req,res){
    res.render("admin");
})
app.get("/adminregister",function(req,res){
    res.render("adminReg");
})

app.post("/adminregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newAdmin = new admin({
        email:req.body.email,
        password:hash
    })
    newAdmin.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("adminlogin");
        }
    })
})
})


app.post("/adminData",function(req,res){
    const newdata = new adminData({
        productId: req.body.productId,
        productCategory:req.body.productCategory,
        productName:req.body.productName,
        foodamount:req.body.foodamount
    })
    newdata.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.send("Add Products successfully")
        }
    })
  })
  app.get("/cashier",function(req,res){
    res.render("cashier")
})
app.get("/cashierregister",function(req,res){
    res.render("cashierregister")
})
app.get("/cashierlogin",function(req,res){
    res.render("cashierlogin")
})


app.post("/cashierregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newCashier = new cashier({
        email:req.body.email,
        password:hash
    })
    newCashier.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("cashierlogin");
        }
    })
})
})
app.post("/cashierlogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password
    cashier.findOne({email:email},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("cashierhome")
                }
            })
        }
     }
})
})
app.get("/user",function(req,res){
    res.render("user");
})
app.get("/order",function(req,res){
    res.render("order");
})


app.get("/userlogin",function(req,res){
    res.render("userlogin")
})
app.get("/userregister",function(req,res){
    res.render("userregister")
})
app.post("/userregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newCustomer = new customer ({
        email:req.body.email,
        password:hash
    })
    newCustomer.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("userlogin");
        }
    })
})
})
app.post("/userlogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password
    customer.findOne({email:email},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("userhome")
                }
            })
        }
     }
})
})
app.get("/customer",function(req,res){
    res.render("customer");
})
app.get("/products", function(req, res) {
    adminData.find({}, function(err, productdata) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("products", { productdata: productdata });
      }
    });
  });
  app.post("/orderData",function(req,res){
    const newOrder = new customerData({
        customerPhNo: req.body.customerPhNo,
        productCategory:req.body.productCategory,
        productName:req.body.productName,
        
    })
    newOrder.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.send("Add Order successfully")
        }
    })
  })

  app.get("/addPayment",function(req,res){
    res.render("addpayment");
  })

  app.post("/addpayment",function(req,res){
    const newOrder = new cashierOrder({
        orderNo:req.body. orderNo,
        date:req.body.date,
        customerPhNo: req.body.customerPhNo,
        productId:req.body.productId,
        productCategory:req.body.productCategory,
        productName:req.body.productName,
        paymentby:req.body.paymentby,
        paymentfor:req.body.paymentfor,
        foodamount:req.body.foodamount
    })
    newOrder.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.send("Add Order successfully")
        }
    })
  })
  app.get("/getProducts", function(req, res) {
    cashierOrder.find({}, function(err, orderdata) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("getorders", { orderdata: orderdata });
      }
    });
  });
  app.get("/customerData", function(req, res) {
    customerData.find({}, function(err, customerData) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("customerdetails", { customerData:customerData });
      }
    });
  });

  app.get("/getonedata",function(req,res){
    res.render("getonedata");
  })
  app.post("/getparticulardata",function(req,res){
     const orderNo=req.body.orderNo
    
     cashierOrder.find({orderNo:orderNo}, function(err,orders) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal server error");
        } else {
          res.render("getoneorderdetail", { orders:orders ,orderNo:orderNo});
        }
      })

})
app.get("/getCustomer",function(req,res){
    res.render("getCustomer");
})
app.post("/history",function(req,res){
    const customerPhNo=req.body.customerPhNo;
   
    cashierOrder.find({customerPhNo:customerPhNo}, function(err,orders) {
       if (err) {
         console.log(err);
         res.status(500).send("Internal server error");
       } else {
         res.render("history", { orders:orders ,customerPhNo:customerPhNo});
       }
     })

})

app.get("/categorywise",function(req,res){
    res.render("category")
})
app.post("/getGategory",function(req,res){
    const  productCategory=req.body. productCategory;
   
    cashierOrder.find({productCategory: productCategory}, function(err,orders) {
       if (err) {
         console.log(err);
         res.status(500).send("Internal server error");
       } else {
         res.render("getCategory", { orders:orders , productCategory:productCategory});
       }
     })

})

 
app.listen(4000,function(){
    console.log("server is started at port 4000")
})