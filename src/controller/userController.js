const controller = {}
const path = require('path');
const User = require('../models/userModels');
controller.login = function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/login.html'));
}
controller.savelogin = async function (req, res, next) {
 const { name_user } = req.body;
 const { pass_user } = req.body;
 const usDB = await User.find({$and: [{name_user: {$eq: name_user}}, {pass_user: {$eq: pass_user}}]});
 if (usDB.length > 0) {
    usDB.forEach(function(user) {
      req.session._id = user._id;
      req.session.name_user = user.name_user;
      req.session.loggedin = true;
    });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
}
controller.register = function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/register.html'));
}
controller.saveregister = async function (req, res, next) {
  const { name_user } = req.body;
  const { pass_user } = req.body;
  const { conf_pass_user } = req.body;
  if (pass_user.length != 8 && conf_pass_user.length != 8) {
    res.redirect('/register');
  } else if (pass_user != conf_pass_user) {
    res.redirect('/register');
  } else {
    const fusDB = await User.aggregate([{$match: {name_user: name_user}}]);
    if (fusDB.length > 0) {
      fusDB.forEach((fus) => {
        if (fus.name_user == name_user || fus.pass_user == pass_user) {
          res.redirect('/register');
        }
      }); 
    } else {
      const newUser = {name_user, pass_user}
      const usDB = await User.create(newUser);
      req.session._id = usDB._id;
      req.session.name_user = usDB.name_user;
      req.session.loggedin = true;
      res.redirect('/');
    }
  }
}
controller.logut = function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.json(err);
    }
     res.redirect('/login');
  });
}
controller.sessionname = function (req, res, next) {
  res.send(req.session.name_user);
}
controller.resetuser = async function (req, res, next) {
  const { user } = req.query;
  const usDB = await User.findOne({name_user: user});
  if (usDB == null) {
    res.send(false);
  } else {
    res.send(usDB);
  }
}
controller.resetpass = function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/resetPass.html'));
}
controller.saveresetpass = async function (req, res, next) {
  const { _id } = req.body;
  const { pass_user } = req.body;
  const { conf_pass_user } = req.body;
  if (pass_user.length != 8 && conf_pass_user.length != 8) {
    res.redirect('/resetpass');
  } else if (pass_user != conf_pass_user) {
    res.redirect('/resetpass');
  } else {
    const editPass = {pass_user}
    const usDB = await User.findByIdAndUpdate(_id, editPass);
    if (usDB != null || usDB != {}) {
      req.session._id = usDB._id;
      req.session.name_user = usDB.name_user;
      req.session.loggedin = true;
      res.redirect('/');
    }
  }
}
module.exports = controller;