// this setup will go in "app.js"
// (only once per application)


const mongoose = require("mongoose");

// tells Mongoose which database to connect to (URL and name of database)
//                                use adopt-a-cat
//                                          |
mongoose.connect("mongodb://localhost/adopt-a-cat",  { useMongoClient: true });
//                                                             |
//                                        settings object (avoids deprecation warning)


// Tell Mongoose to use regular JavaScript promises for our callback
// (promises are a way to organize callbacks)
mongoose.Promise = Promise;

// -----------------------------------------------------------------------------


// this setup will go in its own file ("cat-model.js")
// this needs to happen once per collection

const Schema = mongoose.Schema;

// create the schema for cat documents
// - the "Schema" is the structure of the document
// - it can also include validation rules
const catSchema = new Schema({
    name: { type: String },
    owner: { type: String },
    age: { type: Number },
    favoriteFoods: [
      { type: String }
    ]
});


// create our first Mongoose model for saving cats
const CatModel = mongoose.model("Cat", catSchema);
//                                |
//                              "Cat" -> "cat" -> "cats"
//                                                   |
//                  the name of the collection is "cats"
//       (by convention model names are singular, collection names are plural)
//         "kiss"  -> "kisses"
//         "entry" -> "entries"


// MONGOOSE MODEL:
// A constructor function that gives us methods
// to interact with a specific MongoDB collection.

// The model defines the collection name
// and what kind of information will be stored there.


//------------------------------------------------------------------------------


// this code we will run inside our routes
// (whenever a user submits a form or something like that)




// CREATE using Mongoose-------------------------------------------
// Inserting a new document with Mongoose

// db.cats.insertOne({ name: "Dooby" })

// 1) create an instance of the model
const arielsKitty = new CatModel({
    name: "Dooby",
    owner: "Ariel",
    age: 8,
    favoriteFoods: [
      "treats",
      "catnip"
    ]
});

// 2) save the instance to send it to the database
arielsKitty.save()
  .then(() => {
      console.log("Dooby save successful!");
  })
  .catch((err) => {
      console.log("Dooby Error!");
      console.log(err);
  });


// db.cats.insertOne({ name: "Momo" })

// 1) create an instance of the model
const jessKitty = new CatModel({
    name: "Momo",
    owner: "Jessica",
    age: 7,
    favoriteFoods: [
        "wet food",
        "everything"
    ],

    // "breed" will be ignored because it's not in the schema
    breed: "blah"
});

// 2) save the instance to send it to the database
jessKitty.save()
  .then(() => {
      console.log("Momo save successful!");
  })
  .catch((err) => {
      console.log("Momo Error!");
      console.log(err);
  });




// READ using Mongoose-------------------------------------------
// Retrieving documents with Mongoose

// db.cats.find()
// ("find()" always gets an ARRAY of documents)
CatModel.find(
    // 1st argument -> criteria object (optional)
    { name: "Dooby" },

    // 2nd argument -> projection object (optional)
    { name: 1, _id: 0 }
  )
  // "exec()" tells Mongoose we are done creating the query
  //  and we are ready to execute or run it
  .exec()
  .then((allCats) => {
      console.log("find all cats SUCCESS!");
      console.log(allCats);
  })
  .catch((err) => {
      console.log("find cats ERROR!");
      console.log(err);
  });



// db.cats.findOne({ name: "Momo" })
// ("findOne()" always gets only one document)
//                criteria object
//                      |
CatModel.findOne({ name: "Momo" }).exec()
  .then((theMomo) => {
      console.log("One of the MOMOs");
      console.log(theMomo);
  })
  .catch((err) => {
      console.log("one MOMO ERROR!");
      console.log(err);
  });




// UPDATE using Mongoose-------------------------------------------
// Modifying an existing document with Mongoose

// 1) retrieve the document we want to update
CatModel.findOne({ name: "Dooby" }).exec()
  // 2) making the changes to the document and SAVING
  .then((theCat) => {
      theCat.set({ name: "Beans" });

      // return the next ASYNC command's promise
      return theCat.save();
  })
  .then((theCat) => {
      console.log("Update SUCCESS!");
      console.log(theCat);
  })
  .catch((err) => {
      console.log("Update ERROR!");
      console.log(err);
  });
