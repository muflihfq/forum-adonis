'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ThreadsSchema extends Schema {
    up() {
        this.create('threads', (table) => {
            table.increments()
            table.integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .notNullable()
            table.string('title')
            table.text('content', 'longtext').nullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('threads')
    }
}

module.exports = ThreadsSchema