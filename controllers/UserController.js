const db = require('../models/index');
const bcrypt = require('bcrypt');
const moment = require('moment');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (req, res) => {
        let options = {
            attributes: ['id', 'email', 'name', 'created_at'],
            order: [['name', 'ASC']],
        }

        options.where = {
            is_active: true
        }

        db.user.getUsers().then((users) => {
            const result = {
                total: users.length,
                data: users
            };
            return res.json(result)
        }).catch((err) => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
    },
    create: (req, res) => {
        let body = req.body;
        
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password, salt);
        body.is_active = true;
        body.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        
        db.user.getEmail(body.email).then((user) => {
            if (user.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exist."
                })
            }else {
                console.log(body);
                db.user.create(body)
                  .then((user) => {
                    return res.json(user);
                  })
                  .catch((error) => {
                    return res.status(500).json({
                        status: "error",
                        message: "Cannot create user!"
                    })
                })
            }
        }).catch((error) => {
            return res.status(500).json({
                status: "error",
                message: error
            })
        })
    },
    update: (req, res) => {
        let body = req.body;
        let token = req.params.userToken;
        let data = {};

        db.user.findOne({
            where: { token: { [Op.eq]: token } }
        }).then((user) => {
            if (body.email && (body.email != user.email)) {
                db.user.findOne({
                    where: { email: { [Op.eq]: body.email } }
                }).then((exist) => {
                    if (exist) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'Email already used by another user.'
                        })
                    }else {
                        data.email = body.email;
                    }
                })
            }
            if (body.name) {
                data.name = body.name;
            }
            db.user.update(data, {
                where: { id: user.id }
            }).then((result) => {
                if (result) {
                    return res.json({
                        status: 'ok',
                        message: 'Update user successfully.'
                    })
                }else {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Failed to update user data.'
                    })
                }
            })
        })
    },
    changePassword: (req, res) => {
        let body = req.body;
        let oldPassword = body.old_password;
        let newPassword = body.new_password;
        let token = req.params.userToken;

        db.user.findOne({
            where: { token: { [Op.eq]: token } }
        }).then((user) => {

            bcrypt.compare(oldPassword, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ status: 'error', message: 'Something went wrong.' })
                }
                if (result == false) {
                    return res.status(400).json({ status: 'error', message: 'Invalid old password' })
                }
                if (result == true) {
                    bcrypt.compare(newPassword, user.password, (error, result) => {
                        if (error) {
                            return res.status(500).json({ status: 'error', message: 'Something went wrong.' })
                        }
                        if (result == true) {
                            return res.status(400).json({ status: 'error', message: 'You can not user your old password as new password' })
                        }
                        if (result == false) {
                            const salt = bcrypt.genSaltSync(10);
                            const hashPassword = bcrypt.hashSync(newPassword, salt);
                            let updated = {
                                password: hashPassword,
                                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                            }
                            db.user.update(updated, {
                                where: { id: user.id }
                            }).then((u) => {
                                return res.json({
                                    status: 'ok',
                                    message: 'Password changed.'
                                })
                            })
                        }
                    })
                }
            })
        })
    },
    archived: (req, res) => {
        let userId = req.params.userId;
        let data = {
            is_active: false,
            deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        db.user.update(data, {
            where: {
                id: userId
            }
        }).then((u) => {
            return res.json({
                status: "ok",
                message: "User has been deactivated."
            })
        }).catch((err) => {
            return res.status(500).json({
                status: "error",
                message: err
            })
        })
    },
    delete: (req, res) => {
        let userId = req.params.userId;
    
        db.user.destroy({
          where: {
            id: userId,
          },
        }).then((response) => {
            return res.json({
                status: 'ok',
                message: 'User has been deleted.'
            });
        });
    }
}