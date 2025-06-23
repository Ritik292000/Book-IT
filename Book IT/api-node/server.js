var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');

var fabricClient = require('./app.js');
var mongodb = require('./mongorepo.js');

var app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

//Initialize and connect to the blockchain network
fabricClient.init();

//Connect to MongoDB
//mongodb.init();

app.get('/api/movies', async function (req, res) {
    var name = req.query.title;
    if(name){
        console.log('getting search movie');
        //let response = await fabricClient.QueryMovieByName(name);
        response = mongodb.queryMovieByName(name);
        console.log(response);

        res.type('json');
        res.send(JSON.parse(response));
    }
    else{
        console.log('getting all movies');
        //let response = await fabricClient.queryAllMovies();
        //console.log(JSON.parse(response)[0].Record);
        let movies = [];

        //await JSON.parse(response).map(movie => {
        //    movies.push(movie.Record);
        //});

        //call mongodb.queryAllMovies
        movies = await mongodb.queryAllMovies();
        console.log(movies);

        //res.setHeader("content-type", "application/json");
        res.type('json');
        res.send(movies);
        //res.send(JSON.parse(response));

    }
    

});

//create express route to save movie
app.post('/api/movies', async function (req, res) {
    console.log('saving movie');
    //read movie title, description, language from request body
    var movieNumber= req.body.movieNumber;
    var title = req.body.title;
    var durationInMin = req.body.durationInMin;
    var language = req.body.language;
    var releaseDate = req.body.releaseDate;
    var country = req.body.country;
    var genre = req.body.genre;

    //create json movie object
    var movie = {
        movieNumber: movieNumber,
        title: title,
        durationInMin: durationInMin,
        language: language,
        releaseDate: releaseDate,
        country: country,
        genre: genre
    };
   
    console.log("Saving movie in the blockchain network");
    //call fabricClient.createMovie and pass the movie object
    let fabResponse = await fabricClient.CreateMovie(movieNumber, title, durationInMin, language, releaseDate, country, genre);
    console.log(fabResponse);
    //let dbResponse1 = await mongodb.queryAllMovies();
    //console.log("Saving movie in the database MongoDB");
    //call mongodb.saveMovie and pass the movie object
    let dbResponse = await mongodb.saveMovie(movie);
    console.log(dbResponse);

    
    //send response back to the client
    res.type('json');
    res.status(200).send(dbResponse);
});
//minting token
app.post('/api/mint', async function (req, res) {
    console.log('minting batch token');
    //minting token in blockchain
    var id= req.body.id;


    var amount = req.body.amount;
    var movie = req.body.movie;
    let fabResponse = await fabricClient.MintWithTokenURI(id, amount,movie);
    console.log(fabResponse);


    //update user balance in mongodb
    //let dbResponse = await mongodb.updateUserBalance(userId, nft[0]+'', amt[0]+'');

    //send response back to the client
    res.type('json');
    res.status(200).send(fabResponse);
});

//batch tranfer of token
app.post('/api/transfer', async function (req, res) {
    console.log('transfering batch token');
    var id= req.body.id;
    var amount = req.body.amount;

    let fabResponse = await fabricClient.BatchTransferFrom(id, amount);
    console.log(fabResponse);
    //send response back to the client
    res.type('json');
    res.status(200).send(fabResponse);
});

//burning token
app.post('/api/burn', async function (req, res) {
    console.log('burning batch token');
    var id= req.body.id;
    var amount = req.body.amount;

    let fabResponse = await fabricClient.Burn(id, amount);
    console.log(fabResponse);
    //send response back to the client
    res.type('json');
    res.status(200).send(fabResponse);
});

//create express route to get user details
app.get('/api/users', async function (req, res) {
    console.log('getting user details');
    //read user id from request body
    var userId = req.query.userId;
    var tokenId = req.query.tokenId;

    console.log(tokenId);
    var tokens = new Array(tokenId);
    console.log(tokens);

    //call mongodb get user details
    let response = await mongodb.queryUserById(userId);
    console.log(response);

    //TODO: call fabric client to fetch user account balance
    //tokens.forEach(element => {
        //console.log(element);
        let balance = await fabricClient.GetBalance(userId, tokenId);
        console.log(balance);
        response[0]['ticketId'] = balance;
        response[0].ticketId = balance;
        console.log(JSON.stringify(response));
    //});
    
    //response.balance = balance;
    //send response back to the client
    res.type('json');
    res.status(200).send(JSON.stringify(response));


});

//create express route to get user account balance
app.get('/api/balance', async function (req, res) {
    console.log('getting user account balance');
    //read user id from request body
    var userId = req.query.userId;
    var tokenId = req.query.id;

    //call fabricClient.getBalance and pass the user id
    let response = await fabricClient.GetBalance(userId, tokenId);
    console.log(response);

    //send response back to the client
    res.type('json');
    res.status(200).send(response);
});

//create express route to book tickets
app.post('/api/tickets/book', async function (req, res) {
    console.log('booking movie tickets');

    //TODO: call fabricClient.bookTicket and pass the ticket object hash with unique id
    //This method will also mint NFTs for each ticket
    //let response = await fabricClient.BookMovie(movieId, numberOfTickets);
    //console.log(response);

    //read movie id and number of tickets from request body
    var ticket = {
        showId : req.body.showId,
        numberOfTickets : req.body.numberOfTickets,
        userId : req.body.userId,
        ticketId: 202304261002202,
        uri: req.body.uri   //TODO: Generate a unique URI for each ticket
    };

    //call mongodb book movie tickets
    let response = await mongodb.bookTickets(ticket);
    console.log(response);
    
    //send response back to the client
    res.type('json');
    res.status(200).send(response);
});

//create express route to get movie tickets
app.get('/api/tickets', async function (req, res) {
    console.log('getting movie tickets');
    //read user id from request body
    var userId = req.query.userId;

    //call mongodb get movie tickets
    let response = await mongodb.queryTicketByUser(userId);
    console.log(response);

    //TODO: call fabricClient.getTickets and pass the user id
    //let response = await fabricClient.GetTickets(userId);
    //console.log(response);

    //send response back to the client
    res.type('json');
    res.status(200).send(response);

});



app.listen(9001, 'localhost');
console.log('Running on http://localhost:9001');