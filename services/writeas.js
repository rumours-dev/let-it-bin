import responseType from './responseType'

const writeas = {
    url: 'https://write.as/api/posts',
    authentificationUrl: 'https://write.as/api/auth/login',
    informations: {
        needed: ['login', 'password', 'id']
    },
    methods: {
        update: 'POST', //requires token
        create: 'POST',
        getToken: 'POST'
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
}

export default writeas
