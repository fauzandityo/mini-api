const db = require('../models/index');
const bcrypt = require('bcrypt');
const hat = require('hat');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    login: (req, res) => {
        let body = req.body;

        db.user.findOne({
            where: {
                email: {
                    [Op.eq]: body.email
                }
            }
        }).then((user) => {
            if (user) {
                bcrypt.compare(body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({status: 'error', message: 'Something went wrong.'})
                    }
                    if (result == false) {
                        return res.status(400).json({ status: 'error', message: 'Invalid password given.' })
                    }
                    if (user.is_active == false) {
                        return res.status(400).json({ status: 'error', message: 'Your account is inactive. Please request to activate account.' })
                    }
                    if (result == true) {
                        // Generate token
                        let token = hat();
                        // Update token to logged in user
                        db.user.update({ token: token }, {
                            where: {
                                id: user.id
                            }
                        }).then((u) => {
                            return res.json({
                                status: 'ok', 
                                token: token
                            })
                        }).catch((error) => {
                            return res.status(500).json({
                                status: 'error',
                                message: 'Failed to login, please try again.'
                            })
                        })
                    }
                })
            }else {
                return res.status(400)
                    .json({
                        status: 'error',
                        message: 'User not found.'
                    })
            }
        })
    },
    logout: (req, res) => {
        let token = req.params.userToken;

        db.user.findOne({
            where: {
                token: {
                    [Op.eq]: token
                }
            }
        }).then((user) => {
            if (user) {
                db.user.update({ token: null }, {
                    where: {
                        id: user.id
                    }
                })
                return res.json({
                    status: 'ok',
                    message: 'Successfully loged out'
                })
            }else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Can not found user, please check token given.'
                })
            }
        })
    }
}