import { Base64 } from 'js-base64'

const apiBase = {
    github: 'https://api.github.com/gists/',
    friendpaste: 'https://friendpaste.com/',
    glotio: 'https://snippets.glot.io/snippets/',
    writeas: 'https://write.as/api/posts/'
}

export default class LetItBin {
    constructor( service, auth ) {
        this.__apiBase = apiBase[service]
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

    getBack( id ){
        this.request( 'GET', id )
    }

    update( id, newText ){
        const formatData = text => {
            if( this.__service === 'friendpaste' )
                return {
                    'snippet': text
                }
            if( this.__service === 'glotio' )
                return {
                    'files': {
                        'content': text
                    }
                }
            if( this.__service === 'github' )
                return {
                    'files': {
                        'gistfile1.txt': {
                            'content': text
                        }
                    }
                }
            if( this.__service === 'writeas' )
                return {
                    //TODO token de l'article si pas de compte
                    'body': text
                }
        }

        const data = formatData( newText )

        this.resquest( 'PUT', id, data )
    }

    async request( method, path ){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept-Charset' : 'utf-8',
        })

        if( this.__auth.token )
            headers.append( 'Authorization', 'Token ' + this.__auth.token )
        if( this.__service === 'github' )
            headers.append( 'Accept: application/vnd.github.v3+json' )

        if( this.__authorizationHeader )
            headers.append( 'Authorization', this.__authorizationHeader )

        let url = this.__apiBase
        if( this.__service === 'github' )
            url += this.__auth.username + '/'
        url += path

        const config = {
            url,
            method,
            headers
        }

        const response = await fetch( config )

        const responseJson = await response.json()

        return responseJson
    }

}
