const express = require('express');
const router = express.Router();

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

// Authentication
router.post('/login', AuthController.login);
router.post('/:userToken/logout', AuthController.logout);

// User Route
router.get('/user', UserController.list);
router.post('/user', UserController.create);
router.post('/user/:userToken', UserController.update);
router.post('/user/:userToken/changepassword', UserController.changePassword);
router.put('/user/:userId/archived', UserController.archived);
router.delete('/user/:userId', UserController.delete);

module.exports = router;