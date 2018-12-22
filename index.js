import { Base64 } from 'js-base64'
const fetch = require( 'node-fetch' )

const apiBase = {
    github: {
        url: 'https://api.github.com/gists/',
        updateMethod: 'PATCH',
        headers: {
            GET: {
                'Accept': 'application/vnd.github.v3+json',
                'Accept-Charset' : 'utf-8',
            }
        }
    },
    friendpaste: {
        url: 'https://friendpaste.com/',
        updateMethod: 'PUT',
        headers: {
            GET: {
                'Accept': 'application/json',
                'Accept-Charset' : 'utf-8',
            },
            PUT: {
                'Content-Type': 'application/json',
                'Content-Length': '245'
            },
        }
    },
    glotio: {
        url: 'https://snippets.glot.io/snippets/',
        updateMethod: 'PUT',
    },
    writeas: {
        url: 'https://write.as/api/posts/',
        updateMethod: 'POST',
    },
}

export default class LetItBin {
    constructor( service, auth = {}) {
        this.__apiBase = apiBase[service].url

        this.__auth = {
            token: auth.token,
            username: auth.username,
            password: auth.password,
        }

        this.__service = service

        if( auth.token ) {
            this.__authorizationHeader = 'token ' + auth.token
        } else if( auth.username && auth.password ) {
            this.__authorizationHeader = 'Basic ' + Base64.encode( auth.username + ':' + auth.password )
        }
    }

    get( id ){
        return this.request( 'GET', id )
    }

    update( id, newText ){
        const formatData = text => {
            if( this.__service === 'friendpaste' )
                return {
                    'title': '',
                    'snippet': text,
                    'language': 'text'
                }
            if( this.__service === 'glotio' )
                return {
                    'files': {
                        'content': text
                    }
                }
            if( this.__service === 'github' )
                return {
                    files: {
                        'gistfile1.txt': {
                            'content': text
                        }
                    }
                }
            if( this.__service === 'writeas' )
                return {
                    //TODO token de l'article si pas de compte
                    body: text
                }
        }

        const data = formatData( newText )

        const method = apiBase[this.__service].updateMethod



        return this.request( method, id, JSON.stringify( data ) )
    }

    async request( method, path, data = {}){
        // TODO getHeaders() getConfig()
        let headers = Object.assign( apiBase[this.__service].headers[method] )

        if( this.__auth.token )
            headers.Authorization = 'Token ' + this.__auth.token

        if( this.__authorizationHeader )
            headers.Authorization = this.__authorizationHeader

        let url = this.__apiBase
        if( this.__service === 'github' )
            url += this.__auth.username + '/'
        url += path

        const config = {
            method,
            headers,
        }

        if( method !== 'GET' )
            config.body = data

        const response = await fetch( url, config )
            .then( res => res.json() )
            .then( res => res )

        return response
    }

}
