const mongoose = require("mongoose");


console.log('Connecting to MongoDB');
mongoose.connect('mongodb://127.0.0.1:27017/ReelDeal',
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: false
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
  let movies = db.collection("movies").find({}).toArray();
  console.log(movies);
});

//Movie schema
const schema = new mongoose.Schema({
    movieNumber: Number,
    title: String,
    durationInMin: Number,
    language: String,
    releaseDate: String,
    country: String,
    genre: String

  });

const MoviesModel = mongoose.model('movies', schema);

//Ticket schema
const ticketSchema = new mongoose.Schema({
  ticketId: Number,
  showId : Number,
  numberOfTickets : Number,
  userId : String,
  uri: String
});

const TicketsModel = mongoose.model('tickets', ticketSchema);

//User schema
const userSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  lastName: String,
  nft: [],
  nftId: String,
  nftBalance: String,
  nftSymbol: String,
  ticketId: String  


});

const UsersModel = mongoose.model('users', userSchema);

exports.queryAllMovies = function() {
    console.log("queryAllMovies mongodb");
    //let response = await db.collection("movies").find({}).toArray();
    
    let response = MoviesModel.find({});
    
    console.log(response);
    return response;
}

exports.queryMovieByName = function(name) {
    let response = MoviesModel.find({title:name});
    console.log(response);
    return response;
}

exports.saveMovie = function(movie) {
    console.log("saveMovie mongodb");
    MoviesModel.create(movie);
    return movie;
}

exports.bookTickets = function(ticket) {
  console.log("bookTickets to MongoDB");
  TicketsModel.create(ticket);
  return ticket;
}

exports.queryAllTickets = function() {
  console.log("queryAllTickets to MongoDB");
  let response = TicketsModel.find({});
  console.log(response);
  return response;
}

exports.queryTicketByUser = function(userId) {
  let response = TicketsModel.find({userId:userId});
  console.log(response);
  return response;
}

exports.saveUser = function(user) {
  console.log("saveUser to MongoDB");
  UsersModel.create(user);
  return user;
}

exports.queryAllUsers = function() {
  console.log("queryAllUsers to MongoDB");
  let response = UsersModel.find({});
  console.log(response);
  return response;
}

exports.queryUserById = function(userId) {
  let response = UsersModel.find({userId:userId});
  console.log(response);
  return response;
}

exports.updateUserBalance = function(userId, nftId, nftBalance) {
  console.log("updateUserBalance to MongoDB");
  let response = UsersModel.findOneAndUpdate({userId:userId}, {$push: {nftId:nftId, nftBalance:nftBalance}});
  console.log(response);
  return response;
}


