'use strict'

class CreateThread {
    get rules() {
        return {
            title: 'required',
            content: 'required'
        }
    }

    get message() {
        return {
            'title.required': 'Judul harus diisi',
            'content.required': 'Isi harus diisi',
        }
    }
}

module.exports = CreateThread