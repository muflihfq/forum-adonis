'use strict'

/*
|--------------------------------------------------------------------------
| CommentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Comment = use('App/Models/Comment')

class CommentSeeder {
    async run() {
        for (let i = 0; i < 100; i++) {
            const comment = new Comment()
            comment.user_id = 1
            comment.thread_id = 3
            comment.content = i
            await comment.save()
        }
    }
}

module.exports = CommentSeeder