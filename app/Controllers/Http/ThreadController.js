'use strict'

const Database = use('Database')
const { validate } = use('Validator')
const Thread = use('App/Models/Thread')

class ThreadController {

    async store({ request, response, session }) {

        const rules = {
            title: 'required',
            content: 'required'
        }

        const messages = {
            'title.required': 'Judul harus diisi',
            'content.required': 'Konten harus diisi',
        }

        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {

            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }


        const thread = new Thread()

        const user = request.user

        user.point += 2
        await user.save()

        thread.user_id = user.id
        thread.title = request.input('title')
        thread.content = request.input('content')
        await thread.save()

        response.redirect('/thread/' + thread.id)
    }

    async show({ view, params, request }) {

        const page = request.input('page', 1)

        const thread = await Thread.findOrFail(params.id)

        const user = await thread.user().fetch()

        const comments = await Database
            .select('u.username', 'u.point', 'c.content', 'u.id', 'c.id as cid')
            .from('comments as c')
            .innerJoin('threads as t', 't.id', 'c.thread_id')
            .innerJoin('users as u', 'u.id', 'c.user_id')
            .where('t.id', params.id)
            .paginate(page, 10)

        var cId = []
        const ids = await Database.select('c.id')
            .from('comments as c')
            .innerJoin('threads as t', 't.id', 'c.thread_id')
            .where('t.id', params.id)
            .orderBy('c.id', 'asc')

        for (let i of ids) {
            let arr = Object.values(i)
            cId.push(arr.toString())
        }

        return view.render('thread', {
            thread: thread.toJSON(),
            comments: comments.data,
            user: user.toJSON(),
            tId: thread.id,
            cId: cId,
            page: comments.page,
            lastPage: comments.lastPage
        })
    }

    async edit({ view, params, request, response, session }) {

        const user = request.user

        const thread = await Thread.findOrFail(params.id)

        if (user.id != thread.user_id) {
            session.withErrors([{
                field: 'prohibited',
                message: 'anda tidak dapat mengakses halaman ini'
            }]).flashAll()
            return response.redirect('back')
        }

        return view.render('edit', { thread: thread.toJSON() })
    }

    async update({ request, response, params, session }) {

        const user = request.user

        const thread = await Thread.findOrFail(params.id)

        if (user.id != thread.user_id) {
            session.withErrors([{
                field: 'prohibited',
                message: 'anda tidak dapat mengakses halaman ini'
            }]).flashAll()
            return response.redirect('back')
        }


        thread.title = request.input('title', thread.title)
        thread.content = request.input('content', thread.content)
        await thread.save()

        response.redirect('/thread/' + thread.id)
    }

    async destroy({ params, response, request, session }) {

        const user = request.user

        const thread = await Thread.findOrFail(params.id)

        if (user.id != thread.user_id) {
            session.withErrors([{
                field: 'prohibited',
                message: 'anda tidak dapat mengakses halaman ini'
            }]).flashAll()
            return response.redirect('back')
        }

        await thread.comments().delete()

        await thread.delete()

        response.redirect('/')
    }

    async search({ request, view }) {
        const keyword = request.get().keyword

        const threads = await Database
            .select('u.username', 'u.point as upoint',
                't.id', 't.title', 't.content')
            .from('users as u')
            .innerJoin('threads as t', 'u.id', 't.user_id')
            .where('title', 'like', '%' + keyword + '%')


        var aId = []
        const ids = await Database.select('t.id')
            .from('users as u')
            .innerJoin('threads as t', 'u.id', 't.user_id')
            .where('title', 'like', '%' + keyword + '%')

        for (let i of ids) {
            let arr = Object.values(i)
            aId.push(arr.toString())
        }

        return view.render('home', { threads: threads, ids: aId })
    }

}

module.exports = ThreadController