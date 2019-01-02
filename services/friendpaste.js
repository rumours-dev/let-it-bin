import responseType from './responseType'

const friendpaste = {
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
}

export default friendpaste
