const {Router} = require('express');
const router = Router();
const cityController = require('../controller/cityController');
const depController = require('../controller/depController');
const userController = require('../controller/userController');
// city get
router.get('/', cityController.index);
router.get('/begin', cityController.begin);
router.get('/addci', cityController.add);
router.get('/onecity', cityController.onecity);
router.get('/editci', cityController.edit);
router.get('/oneeditci/:_id', cityController.oneditci);
router.get('/searchci', cityController.searchci);
// departament get
router.get('/departament', depController.index);
router.get('/list', depController.list);
router.get('/adddep', depController.add);
router.get('/editdep', depController.editdep);
router.get('/oneeditdep/:_id', depController.oneeditdep);
router.get('/searchdep', depController.searchdep);
// user get
router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/logut', userController.logut);
router.get('/sessionname', userController.sessionname);
router.get('/resetuser', userController.resetuser);
router.get('/resetpass', userController.resetpass);
// city post
router.post('/addci', cityController.save);
router.post('/editci', cityController.update);
router.post('/deleteci/:_id', cityController.delete);
// departament post
router.post('/adddep', depController.save);
router.post('/editdep', depController.update);
router.post('/deletedep/:_id', depController.deletedep);
// user post
router.post('/login', userController.savelogin);
router.post('/register', userController.saveregister);
router.post('/resetpass', userController.saveresetpass);
module.exports = router;