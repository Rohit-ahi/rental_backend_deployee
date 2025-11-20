'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ServiceProvider.belongsTo(models.User,{
        foreignKey:'user', as:'userrec'
        })

    }
  }
  ServiceProvider.init({

    company_name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : {
           args : true,
           msg : "company_name not empty"
        },
        notNull : {
            args:true,
            msg :"company_name not null"
        }
      }
    },
    address: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : {
          args : true,
          msg : "address not empty"
       },
       notNull : {
           args:true,
           msg :"address not null"
       }
      }
    },
    contact: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : {
          args : true,
          msg : "contact not empty"
       },
       notNull : {
           args:true,
           msg :"contact not null"
       },
      }
    },
    reg_number: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : {
          args : true,
          msg : "reg_number not empty"
       },
       notNull : {
           args:true,
           msg :"reg_number not null"
       },
      }
    },
    contact_person: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        notEmpty : true,
        notNull : true
      }
    },
    geo_lat: {
      type  :DataTypes.FLOAT
    },
    geo_lng: {
      type  :DataTypes.FLOAT
    },
    rating: {
      type  :DataTypes.FLOAT
    },

  }, {
    sequelize,
    modelName: 'ServiceProvider',
  });
  return ServiceProvider;
};