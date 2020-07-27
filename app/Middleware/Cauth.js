'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Cauth {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ request, response, auth, session }, next) {
        // call next to advance the request
        try {
            request.user = await auth.getUser()
            await next()

        } catch (error) {
            session.withErrors([{
                field: 'auth',
                message: 'anda harus login terlebih dahulu'
            }]).flashAll()
            return response.redirect('back')
        }
    }
}

module.exports = Cauth