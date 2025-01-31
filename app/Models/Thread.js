'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Thread extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }

    comments() {
        return this.hasMany('App/Models/Comment')
    }
}

module.exports = Thread