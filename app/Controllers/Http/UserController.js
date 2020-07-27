'use strict'


const User = use('App/Models/User')
class UserController {
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

    async createDummy({ auth, request, response }) {


        const lastUser = await User.last()

        const user = new User()

        let id = 1
        if (lastUser != null) {
            id = lastUser.id + 1
        }

        user.username = 'user' + id
        user.email = 'user' + id + '@mail.com'
        user.password = 'user' + id
        await user.save()

        return user

    }
}

module.exports = UserController