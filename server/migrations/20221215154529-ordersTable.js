'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('order_table', {
      orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uid: {
        type: Sequelize.INTEGER,
        references: {
          model: "users_table",
          key: "uid",
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }
    }).then(() => {
      queryInterface.createTable('order_Item_table', {
        orderId: {
          type: Sequelize.INTEGER,
          references: {
            model: "order_table",
            key: "orderId",
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        Fid: {
          type: Sequelize.INTEGER,
          references: {
            model: "foodMenu",
            key: "Fid",
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      });
    },
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    await queryInterface.dropTable('order_Item_table').then(() => {
      queryInterface.dropTable('order_table');
    });
  }
};
