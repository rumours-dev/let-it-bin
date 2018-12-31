import { Base64 } from 'js-base64'

const responseType = {
    url: '',
    id: '',
    content: '',
}

const token = 'access_token'

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
            create: 'POST', //requires token, except anonymous snippet
            delete: 'DELETE', //require token
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
                files: [{
                    content: text
                }]
            })

            return json
        },
    },
    writeas: {
        url: 'https://write.as/api/posts',
        methods: {
            update: 'POST', //requires token
            create: 'POST',
            delete: 'DELETE', //requires token
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
                body: text
            })

            return json
        },
    },
    pastee: {
        url: 'https://api.paste.ee/v1/pastes/',
        methods: {
            create: 'POST', //require username
            delete: 'DELETE', //require username
        },
        headers: {
            GET: auth => {
                return {
                    'Accept': 'application/json',
                    'Accept-Charset' : 'utf-8',
                    'Authorization': 'Basic ' + Base64.encode( auth.username )
                }
            },
            POST: auth => {
                return {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Base64.encode( auth.username )
                }
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                sections: [{
                    contents: text
                }]
            })

            return json
        },
        handleResponse: ( res, url, data ) => {
            try {
                const response = Object.assign({}, responseType )

                response.url = res.link || url
                response.id = res.id || res.paste.id
                response.content = res.paste.sections[0].contents
                                    || data.sections[0].contents

                return response
            } catch ( error ) {
                throw new Error( error )
            }
        }
    }
}

export default apiBase
