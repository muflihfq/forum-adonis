'use strict'

class Login {
    get rules() {
        return {
            email: 'required|email',
            password: 'required'
        }
    }

    get messages() {
        return {
            'email.required': 'Kolom email harus diisi',
            'password.required': 'Password harus diisi',
            'email.email': 'Format email salah'
        }
    }
}

module.exports = Login