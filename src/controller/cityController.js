const controller = {};
const path = require('path');
const City = require('../models/cityModels');
controller.begin = async function (req, res, next) {
  try {
    const ciDB = await City.find().sort({name_ci: 1});
    res.send(ciDB);
  } catch(error) {
    console.error(error);
  }
}
controller.index = function (req, res, next) {
  if (typeof req.session.loggedin !== 'undefined') {
    if (req.session.loggedin != true) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
}
controller.add = function (req, res, next) {
  if (typeof req.session.loggedin !== 'undefined') {
    if (req.session.loggedin != true) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/addCity.html'));
}
controller.save = async function (req, res, next) {
  try {
    const { name_ci } = req.body;
    const { _idDep } = req.body;
    const arr = name_ci.split(" ");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);  
    }
    const str2 = arr.join(" ");
    const addCi = {name_ci: str2, _idDep}
    await City.create(addCi);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
}
controller.delete = async function (req, res, next) {
  const { _id } = req.params;
  await City.findByIdAndDelete(_id);
  res.send(true);
}
controller.onecity = async function (req, res, next) {
  console.log(req.query);
  const { data } = req.query;
  const ciDB = await City.find({_idDep: {$eq: data}});
  res.send(ciDB);
}
controller.edit = function (req, res, next) {
  if (typeof req.session.loggedin !== 'undefined') {
    if (req.session.loggedin != true) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/editCity.html'));
}
controller.oneditci = async function (req, res, next) {
  console.log(req.params);
  const { _id } = req.params;
  const ciDB = await City.findById(_id);
  res.send(ciDB); 
}
controller.update = async function (req, res, next) {
  const { _id } = req.body;
  const { name_ci } = req.body;
  const { _idDep } = req.body;
  const arr = name_ci.split(' ');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(' ');
  const editCi = {name_ci: str2, _idDep}
  await City.findByIdAndUpdate(_id, editCi);
  res.redirect('/');
}
controller.searchci = async function (req, res, next) {
  const { data } = req.query;
  const ciDB = (await City.find().sort({name_ci: 1})).filter((key) => {
    return key.name_ci == data || key._idDep == data;
  });
  res.send(ciDB);
}
module.exports = controller;