import { Base64 } from 'js-base64'
import responseType from './responseType'

const github = {
    url: 'https://api.github.com/gists',
    informations: {
        needed: ['login', 'password', 'token', 'id']
    },
    authentificationUrl: 'https://api.github.com/authorizations',
    methods: {
        update: 'PATCH',
        create: 'POST',
        delete: 'DELETE',
        getToken: 'POST'
    },
    headers: {
        GET: () => {
            return {
                'Accept': 'application/vnd.github.v3+json',
                'Accept-Charset' : 'utf-8',
            }
        },
        PATCH: auth => {
            const headers = {
                'Content-Type': 'application/vnd.github.v3+json',
            }
            headers.Authorization = auth.token
                ? 'Token ' + auth.token
                : 'Basic ' +  Base64.encode(
                    auth.username + ':' + auth.password
                )

            return headers
        },
        POST: auth => {
            const headers = {
                'Content-Type': 'application/vnd.github.v3+json',
            }
            headers.Authorization = auth.token
                ? 'Token ' + auth.token
                : 'Basic ' +  Base64.encode(
                    auth.username + ':' + auth.password
                )

            return headers
        },
        DELETE: auth => {
            const headers = {
                'Content-Type': 'application/vnd.github.v3+json',
            }
            headers.Authorization = auth.token
                ? 'Token ' + auth.token
                : 'Basic ' +  Base64.encode(
                    auth.username + ':' + auth.password
                )

            return headers
        },
    },
    formatData: text => {
        const gitsfile = 'gistfile1.txt'

        const json = Object.assign({}, {
            files: {
                [gitsfile]: {
                    content: text,
                }
            }
        })

        return json
    },
    formatAuthentificationData: () => {
        return {
            scopes: [
                'gist'
            ],
            note: 'let it bin'
        }
    },
    handleResponse: res => {
        try {
            const gitsfile = 'gistfile1.txt'
            const response = Object.assign({}, responseType )

            response.url = res.url
            response.id = res.id
            response.content = res.files[gitsfile].content

            return response
        } catch ( error ){
            throw new Error( error )
        }
    },
    extractToken: res => {
        try {
            return res.token
        } catch ( error ){
            throw error
        }
    }
}

export default github
