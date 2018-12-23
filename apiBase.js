const apiBase = {
    github: {
        url: 'https://api.github.com/gists/',
        updateMethod: 'PATCH',
        headers: {
            GET: {
                'Accept': 'application/vnd.github.v3+json',
                'Accept-Charset' : 'utf-8',
            }
        },
        formatData: text => {
            const gitfile = 'gistfile1.txt'

            const json = Object.assign({}, {
                'gistfile1.txt': {
                    content: '',
                }
            })

            json[gitfile].content = text
            return json
        },
    },
    friendpaste: {
        url: 'https://friendpaste.com/',
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
    },
    glotio: {
        url: 'https://snippets.glot.io/snippets/',
        updateMethod: 'PUT',
        formatData: text => {
            const json = Object.assign({}, {
                files: {
                    content: ''
                }
            })

            json.files.content = text

            return json
        },
    },
    writeas: {
        url: 'https://write.as/api/posts/',
        updateMethod: 'POST',
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
