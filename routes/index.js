var express = require('express');
const passport = require('passport');
const localStrategy=require('passport-local');
var router = express.Router();
const PostModel = require('./Post');
const UserModel = require('./users'); // Adjust the path to your UserModel file
const upload = require('./multer');
passport.use(new localStrategy(UserModel.authenticate()));

router.post('/register', function(req, res) {
  const userData = new UserModel({
    ...req.body,
    passwordHash: req.body.password,
  });
  
  UserModel.register(userData, req.body.password, function(err) {
    if (err) {
      console.error(err);
      return res.redirect('/register'); // Redirect to registration page on error
    }
    
    passport.authenticate('local')(req, res, function() {
      res.redirect('/profile');
    });
  });
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await UserModel.findOne({
    username: req.session.passport.user
  })
  .populate('post')
  // .populate("posts")
  console.log(user);
  res.render('profile.ejs', {user}); 
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: 'login',
  failureFlash:true,
}),function(req,res){

});

router.get('/logout', function(req, res) {
  req.logout(function(err){
    if(err){return next(err)}
  });
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.session.passport.user);
    return next();
    
  }
  res.redirect('/');
}

router.get('/',function(req,res){
  res.render('index.ejs')
})
 
router.get('/login',function(req,res){
  console.log(req.flash('error'));
  res.render('login.ejs',{error: req.flash('error')});
})

router.get('/feed',function(req,res){
  res.render('feed.ejs')
})

router.post('/upload',upload.single('file') ,isLoggedIn,async function(req,res){
  if(!req.file){
    return res.status(404).send('file not uploaded')
  }
  console.log(req.user._id);
  const user= await UserModel.findOne({username:req.session.passport.user});
  const post=  new PostModel({
    image:req.file.filename,
    postText:req.body.captions,
    user:user._id
  });

  user.post.push(post._id);
  await user.save();
  res.send('file uploaded')
})

module.exports = router
