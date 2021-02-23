'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'token', {
      type: Sequelize.DataTypes.STRING,
      after: 'is_active'
    })

    queryInterface.addColumn('users', 'updated_at', {
      type: Sequelize.DataTypes.DATE,
      after: 'created_at'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'token')
    queryInterface.removeColumn('users', 'created_at')
  }
};
