const express        = require('express');
const passport       = require('passport');
const { isLoggedIn } = require('./middlewares.js');
const adminDB = require('./models/adminDB.js');
      app            = express();
      path           = require('path');
      mongoose       = require('mongoose')
      Product        = require('./models/product.js')
      AdminDB        = require('./models/adminDB.js')
      User           = require('./models/user.js')
      flash          = require('connect-flash')
      bodyParser     = require("body-parser")
      methodOverride = require("method-override")
      LocalStrategy  = require('passport-local')
      Razorpay       = require('razorpay')
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));
app.use(express.urlencoded({extended:true}));
//For external css
app.use(express.static(__dirname + "/public"));
// app.use(bodyParser.json());
app.use(express.json())
app.use(methodOverride('_method'));

const instance = new Razorpay({
    key_id: "rzp_test_xyBx58x30SZePj",
    key_secret: "mwj1LaLBCGStjc3X4I6kQr7R",
});

var sessionE = require("express-session")({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
});

// passport config
app.use(sessionE);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.messages = req.flash('success');
    next();
})

mongoose.set('useFindAndModify', false);


//connecting with DB
mongoose.connect("mongodb+srv://kgk:kgk@nsksupermarket.xky1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex: true})
    .then(()=>{
        console.log("Connected with DB");
    })
    .catch(err=>{
        console.log(err);
    })

//Home Page Display category
app.get('/',(req,res)=>{
    res.render('home');
})


//Pdt of given Category
app.get('/category/:type',(req,res)=>{
    Product.find({category :req.params.type },(err,fromDB)=>{
        if(err)
            console.log(err)
        else    
            res.render('category',{pdt : fromDB})
    })
})

//show more details
app.get('/detail/:id/view',(req,res)=>{
    // res.send("Show more details"+req.params.id);
    Product.findById((req.params.id),(err,fromDB)=>{
        if(err)
            console.log(err);
        else
            res.render('show',{pdt : fromDB});
    });
    
})

app.get('/category/groceries/:val',(req,res)=>{
    Product.find({subCategory : req.params.val},(err,fromDB)=>{
        if(err)
            console.log(err)
        else
        res.render("category",{pdt : fromDB});
    })
    
})

//To add new product
app.get('/addPdtAdmin',isLoggedIn,(req,res)=>{
    res.render("addPdtAdmin");
})

app.get('/groceries',(req,res)=>{
    res.render('grocerySection');
})


//Storing new pdt in DB
app.post('/insertNew',(req,res)=>{
    var title= req.body.title;
    var price = req.body.price;
    var desc= req.body.desc;
    var brand = req.body.brand;
    var img= req.body.img;
    var quantity = req.body.quantity;
    var category = req.body.category;
    var subCategory = req.body.subCategory;
    var generalName = req.body.generalName;
    var stock  = req.body.stock;
    
    var newpdt=
            {
                    title:title,
                    price:price,
                    description:desc,
                    brand:brand,
                    category : category,
                    img: img,
                    quantity : quantity,
                    subCategory : subCategory,
                    generalName : generalName,
                    stock  : stock
            }; 
    Product.create(newpdt,(err,newpdt)=>{
        if(err)
            console.log("Error while Inserting");
        else
        {
            req.flash('success','New Product Inserted'); 
            res.redirect('/category/'+category)
        }    
    })
})

//PDT Edit  Form
app.get('/pdtEdit/:id/view',(req,res)=>{
    Product.findById((req.params.id),(err,fromDB)=>{
        if(err)
            console.log(err);
        else
        res.render('edit',{pdt : fromDB});
    });    
})

//make pdt update in DB
app.put('/mkchange/:id',(req,res)=>{
    var tofind = req.params.id;
    var updated =
            {
                    title:req.body.title,
                    price:req.body.price,
                    description:req.body.desc,
                    brand:req.body.brand,
                    category : req.body.category,
                    subCategory :req.body.subCategory,
                    generalName :req.body.generalName,
                    quantity : req.body.quantity,
                    img: req.body.img
            }; 
    
    Product.findByIdAndUpdate(tofind,updated,{useFindAndModify : false},(err,done)=>{
        if(err)
            console.log(err);
        else    
        {
            res.redirect('/')
        }    
    })
})

//Delete
app.get("/delete/:id",(req,res)=>{
    var todel =req.params.id;
    Product.findByIdAndDelete(todel,(err)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.redirect('/')
        }
    })
})




//new user  registration

//reg form
app.get('/signUp',(req,res)=>{
    res.render("signUpForm");
})

//reg store in DB
app.post('/signUp',async (req,res,next)=>{

    try
    {
        const {email,username,password,doorNo,street,area,Thanjavur,pincode,phNum} = req.body;
        const user = new User({email,username,doorNo,street,area,Thanjavur,pincode,phNum})
        const regUser = await User.register(user,password)
        req.login(regUser , err=> {
            if(err)
                return next(err);
            else
            res.redirect('/');

        })        
    }
    catch(err)
    {
        console.log(err);
        res.redirect('/signUp');
    }
})


//login  form
app.get('/login',(req,res)=>{
    res.render("loginForm");
})


app.post("/login",passport.authenticate("local",
	{
		failureRedirect:"/login"
	}), (req,res)=>
    {
        res.locals.currentUser = req.user;
        var uname  = res.locals.currentUser.username
        const redirectURL = req.session.returnTo || '/';
        delete req.session.originalUrl;
        req.flash('success','Successfully LoggedIn'); 
        res.redirect(redirectURL);
    })


//logout

app.get('/logout',(req,res)=>{
    req.logout();

    res.redirect('/');
})


// cart
app.get('/cart/:category/:id/',isLoggedIn,(req,res)=>{
    var uid  = res.locals.currentUser._id
    productIds = req.params.id
    var cat = req.params.category
    Product.findById(productIds,(err,addToCart)=>{
        if(err)
        {
            console.log("error while retriving product in cart route")
        }
        else
        {
            console.log(addToCart.title);
            var addItem = 
            {
                p_id  : addToCart._id,
                p_title : addToCart.title,
                p_generalName : addToCart.generalName,
                p_price : addToCart.price,
                p_brand : addToCart.brand,
                p_category : addToCart.category,
                p_subCategory : addToCart.subCategory,
                p_img : addToCart.img,
                p_quantity : addToCart.quantity,
                p_stock : addToCart.stock,
                p_req_quan : "1"

            }
            User.findById(uid,(err,activeUser)=>{
                if(err)
                {
                    console.log("Error while retriving user inside retriving product in cart route")
                }
                else
                {
                    console.log(activeUser.email)
                    activeUser.cartItems.push(addItem);
                    activeUser.save();
                    if(! (cat === 'groceries'))
                    {
                            res.redirect('/category/'+cat)
                    }
                    else
                    {
                        res.redirect('/category/groceries/'+addItem.p_subCategory)
                    }
                }
            })
        }
    })

})


//To show the cart of current User
app.get('/cart',isLoggedIn,(req,res)=>{
    User.findById(res.locals.currentUser._id,(err,activeUser)=>{
        res.render("cart",{activeUser : activeUser})
    })
})

//remove ITEM from cart
app.put('/removeFromCart/:id', async (req,res)=>{
    var cartPdtId = req.params.id;
    try
    {
        const active_User = await User.findById(res.locals.currentUser._id);
		const removeIndex = active_User.cartItems
			.map((item) => item.id)
			.indexOf(cartPdtId);
		active_User.cartItems.splice(removeIndex, 1);
		await active_User.save();
    }
    catch(err)
    {
        console.log(err);
    }
    req.flash('success','Removed from cart'); 
    res.redirect('/cart')
})
//To increase quantity of item in cart

app.post('/incrementQuantity/:pId',(req,res)=>{
    var pId = req.params.pId
    var quan = req.body.incre
    console.log(quan)
    // var total = 0;
    // var amt   = 0;
    User.findById(res.locals.currentUser._id, (err,fromDB)=>{
        if(err)
            res.send("error")
        else
        {
            var indexPos = fromDB.cartItems.map(item=>item.id).indexOf(pId)
            fromDB.cartItems[indexPos].p_req_quan = quan;
            fromDB.save();
            //to find amt and total pdts in cart
            // (fromDB.cartItems).forEach(element => {
            //     total = total + parseInt(element.p_req_quan)
            //     amt = parseInt(element.p_req_quan) * parseInt(element.p_price) + amt
            // });
            // console.log(total);
            // console.log(amt);
            res.send("Successful")
        }
        
    })
})

// To Buy items in loggedin user's cart

app.get('/placeOrder',isLoggedIn,(req,res)=>{
    User.findById(res.locals.currentUser._id,(err,activeUser)=>{
        res.render("placeOrder",{activeUser : activeUser})
    })
})


//selection payment method
app.get('/modeselection/:amt',(req,res)=>{
    var amt = req.params.amt;
    res.render("selectMode", {amt : amt , key : "rzp_test_xyBx58x30SZePj"})
})
//converting cartitems to confirm
app.get('/convertOrders',(req,res)=>{

    // res.send(res.locals.currentUser._id.cartItems)
    User.findById(res.locals.currentUser._id,(err,fromDB)=>{
        if(err)
            console.log(err)
        else
        {
            const Admin = new AdminDB();
            var sample = [];
            fromDB.cartItems.forEach(function(product) 
            {
                var order =
                {
                    p_title  : product.p_title,
                    p_price  : product.p_price,
                    p_req_quan : product.p_req_quan   
                }
                sample.push(order)   
            })
            const det = {
                userName :  fromDB.username,
                order_status : "Yet To Deliver",
                pdtInOrder : sample,
            }
            Admin.orderList.push(det)
            Admin.save();
            fromDB.cartItems =[];
            fromDB.save();
        }    
    })
    req.flash('success','Orders Placed');
    res.redirect("/")
    
})


// Orders received and its status
app.get('/adminDB',(req,res)=>{
    AdminDB.find((err,orders)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render("OrdersDB",{allOrders : orders});
        }
    })
})

app.post("/confirmOrder", (req, res) => {
    params = req.body.params;
    instance.orders
      .create(params)
      .then((data) => {
        res.send({ sub: data, status: "success" });
      })
      .catch((error) => {
        res.send({ sub: error, status: "failed" });
      });
  });

app.post("/delivered/:id",(req,res)=>{
    // res.send();
    AdminDB.findById((req.params.id),(err,fromDB)=>{
        if(err)
            console.log(err);
        else
        {
            fromDB.orderList[0].order_status = "Delivered";
            AdminDB.findByIdAndUpdate(req.params.id,fromDB,{useFindAndModify : false},(err,done)=>{
                if(err)
                    console.log(err);
                else    
                {
                    res.redirect('/adminDB')
                }    
            })
        }
    })
}) 

app.get('/return',(req,res)=>{
    res.render("return")
})

app.listen(process.env.PORT||3000,()=>{
    console.log('Server Started');
})      

