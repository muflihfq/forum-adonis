'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
    up() {
        this.create('comments', (table) => {
            table.increments()
            table.integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .notNullable()
            table.integer('thread_id')
                .unsigned()
                .references('id')
                .inTable('threads')
                .notNullable()
            table.text('content', 'longtext')
            table.timestamps()
        })
    }

    down() {
        this.drop('comments')
    }
}

module.exports = CommentsSchema