const responseType = {
    url: '',
    id: '',
    content: '',
}

const apiBase = {
    github: {
        url: 'https://api.github.com/gists',
        authorizationNeeded: true,
        updateMethod: 'PATCH',
        createMethod: 'POST',
        deleteMethod: 'DELETE',
        headers: {
            GET: {
                'Accept': 'application/vnd.github.v3+json',
                'Accept-Charset' : 'utf-8',
                'User-Agent': 'let-it-bin',
            },
            PATCH: {
                'Content-Type': 'application/vnd.github.v3+json',
                'User-Agent': 'let-it-bin',
            },
            POST: {
                'Content-Type': 'application/vnd.github.v3+json',
                'User-Agent': 'let-it-bin',
            },
        },
        formatData: text => {
            const gitsfile = 'gistfile1.txt'

            const json = Object.assign({}, {
                files: {
                    [gitsfile]: {
                        content: '',
                    }
                }
            })

            json.files[gitsfile].content = text
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
        authorizationNeeded: false,
        updateMethod: 'PUT',
        createMethod: 'POST',
        headers: {
            GET: {
                'Accept': 'application/json',
                'Accept-Charset' : 'utf-8',
            },
            PUT: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
            POST: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                title: '',
                snippet: '',
                language: 'text'
            })

            json.snippet = text

            return json
        },
        handleResponse: ( res, url ) => {
            try {
                if( !res.snippet && !res.ok ) throw new Error()

                const response = Object.assign({}, responseType )
                response.url = res.url || url
                response.id = res.id
                if( res.snippet ) response.content = res.snippet

                return response
            } catch ( error ){
                error.message = res.reason
                throw error
            }
        }
    },
    glotio: {
        url: 'https://snippets.glot.io/snippets',
        updateMethod: 'PUT', //requires token
        createMethod: 'POST', //requires token, except anonymous snippet
        deleteMethod: 'DELETE', //retquire token
        headers: {
            GET: {
                'Accept': 'application/json',
                'Accept-Charset' : 'utf-8',
            },
            PUT: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
            POST: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                files: [{
                    content: ''
                }]
            })

            json.files.content = text

            return json
        },
    },
    writeas: {
        url: 'https://write.as/api/posts',
        updateMethod: 'POST', //requires token
        createMethod: 'POST',
        deleteMethod: 'DELETE', //requires token
        headers: {
            GET: {
                'Accept': 'application/json',
                'Accept-Charset' : 'utf-8',
            },
            PUT: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
            POST: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
        },
        formatData: text => {
            const json = Object.assign({}, {
                body: ''
            })

            json.body = text

            return json
        },
    },
}

export default apiBase
