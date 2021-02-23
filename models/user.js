'use strict';

const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    let user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING
        },
        name: DataTypes.STRING(100),
        is_active: {
            type: DataTypes.INTEGER(1).UNSIGNED
        },
        token: {
            type: DataTypes.STRING
        },
        created_at: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('created_at')).unix();
            }
        },
        updated_at: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('created_at')).unix();
            }
        },
        deleted_at: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('deleted_at')).unix;
            }
        }
    }, {
        tableName: 'users',
        createdAt: false,
        updatedAt: false
    });

    user.getEmail = (email) => {
        let query = `SELECT id FROM users WHERE email='${email}'`;
        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
    }

    user.getUsers = () => {
        let query = `SELECT id, email, name, created_at, updated_at FROM users WHERE is_active=true`;
        return sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
    }

    return user;
}