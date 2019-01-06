import responseType from './responseType'

const glotio = {
    url: 'https://snippets.glot.io/snippets',
    informations: {
        needed: ['token', 'id']
    },
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
}

export default glotio
