import { Base64 } from 'js-base64'

const responseType = {
    url: '',
    id: '',
    content: '',
}

const apiBase = {
    github: {
        url: 'https://api.github.com/gists',
        methods: {
            update: 'PATCH',
            create: 'POST',
            delete: 'DELETE',
        },
        headers: {
            GET: () => {
                return {
                    'Accept': 'application/vnd.github.v3+json',
                    'Accept-Charset' : 'utf-8',
                    //            'User-Agent': 'let-it-bin',
                }
            },
            PATCH: auth => {
                return {
                    'Content-Type': 'application/vnd.github.v3+json',
                    //'User-Agent': 'let-it-bin',
                    'Authorization': 'Basic ' +  Base64.encode(
                        auth.username + ':' + auth.password
                    )
                }
            },
            POST: auth => {
                return {
                    'Content-Type': 'application/vnd.github.v3+json',
                    //'User-Agent': 'let-it-bin',
                    'Authorization': 'Basic ' +  Base64.encode(
                        auth.username + ':' + auth.password
                    )
                }
            },
            DELETE: auth => {
                return {
                    'Content-Type': 'application/vnd.github.v3+json',
                    //'User-Agent': 'let-it-bin',
                    'Authorization': 'Basic ' +  Base64.encode(
                        auth.username + ':' + auth.password
                    )
                }
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
        }

    },
    friendpaste: {
        url: 'https://friendpaste.com',
        methods: {
            update: 'PUT',
            create: 'POST',
        },
        headers: {
            GET: () => {
                return {
                    'Accept': 'application/json',
                    'Accept-Charset' : 'utf-8',
                }
            },
            PUT: () => {
                return {
                    'Content-Type': 'application/json',
                    'Content-Length': '245'
                }
            },
            POST: () => {
                return {
                    'Content-Type': 'application/json',
                    'Content-Length': '245'
                }
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                title: '',
                snippet: text,
                language: 'text'
            })

            return json
        },
        handleResponse: ( res, url, data ) => {
            try {
                if( !res.snippet && !res.ok ) throw new Error( 'nothing' )

                const response = Object.assign({}, responseType )
                response.url = res.url || url
                response.id = res.id
                response.content = res.snippet || data.snippet

                return response
            } catch ( error ){
                error.message = res.reason
                throw error
            }
        }
    },
    glotio: {
        url: 'https://snippets.glot.io/snippets',
        methods: {
            update: 'PUT', //requires token
            create: 'POST', //token optional
            delete: 'DELETE', //require token
        },
        headers: {
            GET: () => {
                return {
                    'Accept': 'application/json',
                    'Accept-Charset' : 'utf-8',
                }
            },
            PUT: auth => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': '245',
                }
                if( auth.token )
                    headers.Authorization = 'Token ' + auth.token

                return headers
            },
            POST: auth => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': '245',
                }
                if( auth.token )
                    headers.Authorization = 'Token ' + auth.token

                return headers
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                files: [{
                    content: text
                }]
            })

            return json
        },
        handleResponse: res => {
            try {
                if( !res.id ) throw new Error( 'Response doesn\'t have an id' )

                const response = Object.assign({}, responseType )
                response.url = res.url
                response.id = res.id
                response.content = res.files[0].content

                return response
            } catch ( error ){
                error.message = res.reason
                throw error
            }
        }
    },
    writeas: {
        url: 'https://write.as/api/posts',
        authentificationUrl: 'https://write.as/api/auth/login',
        needToken: true,
        methods: {
            update: 'POST', //requires token
            create: 'POST',
            authentification: 'POST'
        },
        headers: {
            GET: auth => {
                const headers = {
                    'Accept': 'application/json',
                    'Accept-Charset' : 'utf-8',
                }
                if( auth.token )
                    headers.Authorization = 'Token ' + auth.token

                return headers
            },
            PUT: auth => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': '245',
                }
                if( auth.token )
                    headers.Authorization = 'Token ' + auth.token

                return headers
            },
            POST: auth => {
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': '245',
                }
                if( auth.token )
                    headers.Authorization = 'Token ' + auth.token

                return headers
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                body: text
            })

            return json
        },
        formatAuthentificationData: auth => {
            return {
                alias: auth.username,
                pass: auth.password,
            }
        },
        handleResponse: ( res, url ) => {
            try {
                if( !res.data.id ) throw new Error( 'Response doesn\'t have an id' )

                const response = Object.assign({}, responseType )
                response.url = url
                response.id = res.data.id
                response.content = res.data.body

                return response
            } catch ( error ){
                error.message = res.reason
                throw error
            }
        },
        extractToken: res => {
            try {
                if( !res.data ) throw new Error( 'No token' )
                const token = 'access_token'

                return res.data[token]
            } catch ( error ){
                const errmess = 'error_msg'
                error.message = res[errmess]
                throw error
            }
        }
    },
}

export default apiBase
