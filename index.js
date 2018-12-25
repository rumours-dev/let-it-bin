import apiBase from './apiBase'
import { Base64 } from 'js-base64'
const fetch = require( 'node-fetch' )

export default class LetItBin {
    constructor( service, auth = {}) {
        this.__apibase = apiBase[service]
        this.__url = apiBase[service].url

        this.__auth = {
            token: auth.token,
            username: auth.username,
            password: auth.password,
        }

        this.__service = service
    }

    get( id ){
        const method = 'GET'

        const url = this.__url + '/' + id

        return this.request({ method, url })
    }

    update( id, newText ){
        const data = this.__apibase.formatData( newText )

        const method = this.__apibase.updateMethod

        const url = this.__url + '/' + id

        return this.request({ method, url, data })
    }

    create( text ) {
        const data = this.__apibase.formatData( text )

        const method = this.__apibase.createMethod

        if( this.__service === 'github' ){
            const url = this.__url
            return this.request({ method, data, url })
        }

        return this.request({ method, data })
    }

    async request({ method, url = this.__url, data, auth = true }){
        try {
            const useragent = 'user-agent'
            let headers = Object.assign( this.__apibase.headers[method] )
            headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'
            if( this.__apibase.authorizationNeeded && auth )
                headers.Authorization = this.getAuthorizationHeaders()

            const config = {
                method,
                headers,
            }
            if( data )
                config.body = JSON.stringify( data )

            const response = await fetch( url, config )
                .then( res => {
                    if( res.status >= 200 && res.status < 300 )
                        return res.json()

                    const error = new Error( res.statusText || res.status )
                    error.response = res
                    throw error
                })
                .then( json => {
                    return this.__apibase.handleResponse( json, url )
                })

            return response
        } catch ( error ) {
            throw new Error( error )
        }
    }

    getAuthorizationHeaders(){
        const token = 'access_token'

        if( this.__auth.token )
            return 'Token ' + this.__auth.token

        if( this.__service === 'github' ){
            return 'Basic ' + Base64.encode(
                this.__auth.username + ':' + this.__auth.password
            )
        }

        if( this.__service === 'writeas' ){
            const authResponse = this.request({
                url: 'https://write.as/api/auth/login',
                method: 'POST',
                data: {
                    alias:this.__auth.username,
                    pass:this.__auth.password
                },
                auth: false
            })
            this.__auth.token = authResponse.data[token]
            return 'Token' + this.__auth.token
        }
    }

}
