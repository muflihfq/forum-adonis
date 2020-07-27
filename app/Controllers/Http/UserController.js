'use strict'


const User = use('App/Models/User')
class UserController {
    //TODO: summernote


    async login({ auth, request, response, session }) {
        const email = request.input('email')
        const password = request.input('password')

        try {
            const user = await auth.attempt(email, password)
        } catch (er) {
            session.withErrors([{
                field: 'failed',
                message: 'email atau password salah'
            }]).flashAll()
            return response.redirect('back')
        }

        return response.redirect('back')


    }

    async logout({ auth, response }) {

        await auth.logout()

        return response.redirect('/', true)

    }

    async register({ auth, request, response }) {
        const user = new User()

        user.username = request.input('username')
        user.email = request.input('email')
        user.password = request.input('password')
        await user.save()

        response.send(user)
    }
}

module.exports = UserController