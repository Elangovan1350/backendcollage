import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect("mongodb+srv://admin:admin@mern.yeiznam.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    if (res) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  });

const userData = new mongoose.Schema(
  {
    email: "string",
    password: "string",
    repassword: "string",
  },
  {
    versionKey: false,
  }
);

const user = mongoose.model("register", userData);

app.post("/register", (req, res) => {
  console.log(req.body);
  user.findOne({ email: req.body.email }).then((response) => {
    if (response) {
      res.send("your account is alredy exist");
      console.log("your account is alredy exist");
    } else if (req.body.password == req.body.repassword) {
      const newuser = new user({
        email: req.body.email,
        password: req.body.password,
      });
      newuser.save().then((response) => {
        if (response) {
          console.log("your account is successfully created");
          res.send("your account is successfully created");
        } else {
          console.log("error in registering account");
          res.send("error in registering your account");
        }
      });
    } else {
      console.log("check the password it doesn't match");
      res.send("check the password it doesn't match");
    }
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  user.findOne({ email: req.body.email }).then((response) => {
    if (response) {
      if ((req.body.password == response.password)) {
        console.log("you can log in now");
        res.send("true");
      }else{
        console.log("your password is worng");
        res.send("your password is worng");
      }
    } else {
      console.log("you don't have an account so create your account");
      res.send("you don't have an account so create your account");
    }
  });
});



const productSchema = mongoose.Schema(
  {
    title: String,
    price: Number,
    thumbnail: String,
    description: String,
    category: String,
  },
  {
    versionkey: false,
  }
);

const products = new mongoose.model("popo", productSchema);

app.get("/", async (req, res) => {
  const getAll = await products.find();
  res.json(getAll);
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getOne = await products.findById(id);
  res.status(200).json(getOne);
});

app.post("/", async (req, res) => {
  const { title, price, description, thumbnail, category } = req.body;
  const vandu = await new products({
    title,
    price,
    description,
    thumbnail,
    category,
  });
  vandu.save().then((resq) => {
    if (resq) {
      console.log("data saved");
      res.send( "data saved" );
    } else {
      console.log("data not saved");
      res.send("data not saved")
    }
  });
});

app.listen(5000, (err) => console.log(err));
