'use strict'

const ThreadController = require('../app/Controllers/Http/ThreadController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Thread = use('App/Models/Thread')
const Database = use('Database')


Route.get('/', async({ view, request }) => {

    let page = 1
    page = request.get().page

    const threads = await Database
        .select('u.username', 'u.point as upoint',
            't.id', 't.title', 't.content')
        .from('users as u')
        .innerJoin('threads as t', 'u.id', 't.user_id')
        .paginate(page)



    var aId = []
    const ids = await Database.select('t.id')
        .from('users as u')
        .innerJoin('threads as t', 'u.id', 't.user_id')


    for (let i of ids) {
        let arr = Object.values(i)
        aId.push(arr.toString())
    }


    return view.render('home', {
        threads: threads.data,
        ids: aId,
        page: threads.page,
        lastPage: threads.lastPage
    })
})

Route.get('/create', async({ view, response, auth }) => {
    return view.render('create')
}).middleware(['cauth'])

Route.group(() => {
    Route.post('/login', 'UserController.login').as('login')
    Route.post('/register', 'UserController.register')
    Route.get('/logout', 'UserController.logout')
}).prefix('user')


Route.resource('comment', 'CommentController')
    .middleware(new Map([
        [
            ['store', 'update', 'destroy'],
            ['cauth']
        ]
    ]))
Route.resource('thread', 'ThreadController')
    .middleware(new Map([
        [
            ['store', 'update', 'edit', 'destroy'],
            ['cauth']
        ]
    ]))
Route.get('/search', 'ThreadController.search')