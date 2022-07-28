const controller = {}
const path = require('path');
const Dep = require('../models/depModels');
controller.list = async function (req, res, next) {
  try {
    const arrDep = await Dep.find().sort({name_dep: 1});
    res.send(arrDep);
  } catch (error) {
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
  res.sendFile(path.join(__dirname, '../public/indexDep.html'));
}
controller.add = function (req, res, next) {
  if (typeof req.session.loggedin !== 'undefined') {
    if (req.session.loggedin != true) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/addDep.html'));
}
controller.save = async function (req, res, next) {
  try {
    const { name_dep } = req.body;
    const arr = name_dep.split(' ');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(' ');
    const adDep = {name_dep: str2}
    await Dep.create(adDep);
    res.redirect('/departament');
  } catch (error) {
    console.error('error', error);
  }
}
controller.deletedep = async function (req, res, next) {
  try {
    const { _id } = req.params;
    await Dep.findByIdAndDelete({_id});
    res.send(true);
  } catch (error) {
    console.error('error' + error);
  }
}
controller.editdep = async function (req, res, next) {
  if (typeof req.session.loggedin !== 'undefined') {
    if (req.session.loggedin != true) {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, '../public/editDep.html'));
}
controller.oneeditdep = async function (req, res, next) {
  try {
    const { _id } = req.params;
    const depDB = await Dep.findOne({_id});
    res.send(depDB);
  } catch (error) {
    console.error('error' + error);
  }
}
controller.update = async function (req, res, next) {
  try {
    const { _id } = req.body;
    const { name_dep } = req.body;
    const arr = name_dep.split(' ');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(' ');
    const updateEdit = {name_dep: str2}
    await Dep.findByIdAndUpdate(_id, updateEdit, {useFindAndModify: false});
     res.redirect('/departament');
  } catch (error) {
    console.error(error);
  }
}
controller.searchdep = async function (req, res, next) {
  const { data } = req.query;
  const depDB = (await Dep.find().sort({name_dep: 1})).filter((key) => {
    return key.name_dep == data;
  });
  res.send(depDB);
}
module.exports = controller;