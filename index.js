import apiBase from './apiBase'
import { Base64 } from 'js-base64'
const fetch = require( 'node-fetch' )

/**
* Create an instance of LetItBin.
*
* @param	{string}		service			Service you intend to use.
* @param	{Object}		auth			Authentification.
* @param	{string}		auth.username	Username for authentification.
* @param	{string}		auth.password	Password for authentification.
*/
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

    /**
    * Make a GET request of a gist
    *
    * @param	{string}		id			Id of the gist/snippet to GET.
    * @return	{Promise}		Promise object of a request() of id.
    */
    get( id ){
        const method = 'GET'

        const url = this.__url + '/' + id

        return this.request({ method, url })
    }

    /**
     * Make a POST/PATCH request to update a gist
    *
    * @param	{string}		id			Id of the gist/snippet to update.
    * @param	{string}		newText		New text for the gist.
    * @return	{Promise}		Promise object of a request() of id with newText.
    */
    update( id, newText ){
        const data = this.__apibase.formatData( newText )

        const method = this.__apibase.updateMethod

        const url = this.__url + '/' + id

        return this.request({ method, url, data })
    }

    /**
    * Make a POST request to create a new gist
    *
    * @param	{string}		text			Text to write in the new gist.
    * @return	{Promise}		Promise object of a request() with Text.
    */
    create( text ) {
        const data = this.__apibase.formatData( text )

        const method = this.__apibase.createMethod

        if( this.__service === 'github' ){
            const url = this.__url
            return this.request({ method, data, url })
        }

        return this.request({ method, data })
    }

    /**
    * Make request
    *
    * @param	{Object}		config			Configuration for fetch.
    * @param	{string}		config.method	Method (GET|POST|PATCH).
    * @param	{string}		config.url		Url to fetch.
    * @param	{Object}		config.data		Json to send.
    * @param	{boolean}		config.auth		False to avoid asking headers.Authorization.
    * @return	{Object}		Response Object of a request.
    */
    async request({ method, url = this.__url, data, auth = true }){
        try {
            const useragent = 'user-agent'
            let headers = Object.assign( this.__apibase.headers[method] )
            headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'
            if( this.__apibase.authorizationNeeded && auth )
                headers.Authorization = this.getAuthorizationHeader()

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
                    return this.__apibase.handleResponse( json, url, data )
                })

            return response
        } catch ( error ) {
            throw error
        }
    }

    /**
    * Get Authorization Header for a request
    *
    * @return	{string}		header.Authorization.
    */
    getAuthorizationHeader(){
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
