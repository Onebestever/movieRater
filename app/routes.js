const user = require("./models/user");

module.exports = function (app, passport, db) {

  const {
    ObjectId
  } = require('mongodb') //gives access to _id in mongodb
  //Collection variable
  // const collectionName = 'movies'
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  //req.user if user is logged in and makigng a request, you can see everything bout that user also passed in.. Good for making profile pgs
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('movies').find().toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)


      res.render('profile.ejs', {
        user: req.user,
        movies: result
      })
    })
  });

  //   app.get('/profile', isLoggedIn, function(req, res) {
  //     db.collection('plants').find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       console.log(result)

  //       let bigPlants = result.filter(doc => doc.plantInfo.name === req.user.local.email)

  //       res.render('profile.ejs', {
  //         user : req.user, 
  //         plants: result,
  //         bigPlants: myPlants
  //       })
  //     })
  // });
  // {name: req.user.local.email}
  // profile SECTION =================================
  //************** */   app.get('/profile', isLoggedIn, function(req, res) {
  //     db.collection(collectionName).find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       console.log('result', result)

  //       //update find to filter out/
  //       // let myWorkLogs = result.filter(doc => doc.name === req.user.local.email)
  //       // console.log('myWorkLogs', myWorkLogs)

  //       res.render('profile.ejs', {
  //         user : req.user, 
  //         orders: result
  //       })
  //     })
  // });********************************

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // profile Page Routes ===============================================================

  app.post('/movies', (req, res) => {
    db.collection('movies').findOne({
      name: req.body.name,
      rate: req.body.rate,
      recommend: req.body.recommend,
      genre: req.body.genre,
      movietNotes: req.body.movieNotes,
      thumbUp: 0, 
      thumbDown:0
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('already exist', result)
      if (result === null) {

        db.collection('movies').save({
          name: req.body.name,
          rate: req.body.rate,
          recommend: req.body.recommend,
          genre: req.body.genre,
          movietNotes: req.body.movieNotes,
          thumbUp: 0,
          thumbDown:0
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(result)
          console.log('saved to database')
          res.redirect('/profile')
        })
      }
    })
  })

  app.put('/movies', (req, res) => {
    db.collection('movies')
      .findOneAndUpdate({
       name:req.body.name,
       rate: req.body.rate,
       recommend: req.body.recommend,
       genre: req.body.genre,
       movietNotes: req.body.movieNotes,
      }, {
        $set: {
          thumbUp: req.body.thumbUp + 1
        }
      }, {
        sort: {
          _id: -1
        }, //Sorts documents in db ascending (1) or descending (-1)
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.put('/moviesTDown', (req, res) => {
    db.collection('movies')
      .findOneAndUpdate({
        name: req.body.name,
        rate: req.body.rate,
        recommend: req.body.recommend,
        genre: req.body.genre,
        movietNotes: req.body.movieNotes,
      }, {
        $set: {
          thumbUp: req.body.thumbUp - 1

        }
      }, {
        sort: {
          _id: -1
        }, //Sorts documents in db ascending (1) or descending (-1)
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })


  app.delete('/movies', (req, res) => {
    db.collection('movies').findOneAndDelete({
      name: req.body.name,
      rate: req.body.rate,
      recommend: req.body.recommend,
      genre: req.body.genre,
      movietNotes: req.body.movieNotes,
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  //Order System Routes ===============================================================

  // app.get('/orderSystem', function(req, res) {
  //   res.render('orderSystem.ejs');
  // });

  // app.post('/submitOrder', (req, res) => {
  //   db.collection(collectionName)
  //   .insertOne({customerName: req.body.customerName, 
  //     size: req.body.size, 
  //     beverage: req.body.beverage, 
  //     temperature: req.body.temperature, 
  //     sugar: req.body.sugar, 
  //     flavor: req.body.flavor, 
  //     milkOptions: req.body.milkOptions, 
  //     note: req.body.note, 
  //     complete: false}, (err, result) => {
  //     if (err) return console.log(err)
  //     //console.log(result)
  //     console.log('saved to database')
  //     res.redirect('/orderSystem')
  //   })
  // })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}