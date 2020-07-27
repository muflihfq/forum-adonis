'use strict'

const Comment = use('App/Models/Comment')

class CommentController {

    async store({ auth, request, response }) {

        const comment = new Comment()
        const user = request.user

        user.point += 1
        await user.save()

        comment.user_id = user.id
        comment.thread_id = request.input('thread_id')
        comment.content = request.input('content')
        await comment.save()

        response.redirect('/thread/' + request.input('thread_id'))
    }

    async update({ request, response, params, session }) {

        const user = request.user

        const comment = await Comment.findOrFail(params.id)

        if (user.id != comment.user_id) {
            session.withErrors([{
                field: 'prohibited',
                message: 'anda tidak dapat mengakses halaman ini'
            }]).flashAll()
            return response.redirect('back')
        }

        comment.content = request.input('content', comment.content)

        const thread = await comment.thread().fetch()
        await comment.save()

        response.redirect('/thread/' + thread.id)

    }

    async destroy({ params, response, request, session }) {

        const user = request.user
        const comment = await Comment.findOrFail(params.id)

        const thread = await comment.thread().fetch()

        if (user.id != comment.user_id) {
            session.withErrors([{
                field: 'prohibited',
                message: 'anda tidak dapat mengakses halaman ini'
            }]).flashAll()
            return response.redirect('back')
        }

        await comment.delete()

        response.redirect('/thread/' + thread.id)
    }
}

module.exports = CommentController