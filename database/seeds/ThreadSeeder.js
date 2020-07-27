'use strict'

/*
|--------------------------------------------------------------------------
| ThreadSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Thread = use('App/Models/Thread')

class ThreadSeeder {
    async run() {
        for (let i = 0; i < 100; i++) {
            const thread = new Thread()
            thread.user_id = 1
            thread.title = i
            thread.content = i
            await thread.save()
        }
    }
}

module.exports = ThreadSeeder