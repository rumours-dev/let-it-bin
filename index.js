import apiBase from './apiBase'
const fetch = require( 'node-fetch' )

const useragent = 'user-agent'

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

        const headers = this.__apibase.headers[method]( this.__auth )
        headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'

        const config = {
            method,
            headers,
        }

        const url = this.__url + '/' + id

        return request({
            url,
            config,
            callback: this.__apibase.handleResponse
        })
    }

    /**
     * Make a POST/PATCH request to update a gist
    *
    * @param	{string}		id			Id of the gist/snippet to update.
    * @param	{string}		newText		New text for the gist.
    * @return	{Promise}		Promise object of a request() of id with newText.
    */
    update( id, newText ){
        if( !this.__apibase.methods.update ) throw new Error( 'No update method' )

        const body = JSON.stringify( this.__apibase.formatData( newText ) )

        const method = this.__apibase.methods.update

        const headers = this.__apibase.headers[method]( this.__auth )
        headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'

        const config = {
            method,
            headers,
            body,
        }

        const url = this.__url + '/' + id

        return request({
            url,
            config,
            callback: this.__apibase.handleResponse
        })
    }

    /**
    * Make a POST request to create a new gist
    *
    * @param	{string}		text			Text to write in the new gist.
    * @return	{Promise}		Promise object of a request() with Text.
    */
    create( text ) {
        if( !this.__apibase.methods.create ) throw new Error( 'No create method' )

        const body = JSON.stringify(  this.__apibase.formatData( text ) )

        const method = this.__apibase.methods.create

        const headers = this.__apibase.headers[method]( this.__auth )
        headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'

        const config = {
            method,
            headers,
            body,
        }

        const url = this.__url

        return request({
            url,
            config,
            callback: this.__apibase.handleResponse
        })
    }

    /**
    * Make a DELETE request to delete a gist
    *
    * @param	{string}		id			Id of the gist.
    * @return	{Promise}		Promise object of a request() of id.
    */
    delete( id ){
        if( !this.__apibase.methods.delete ) throw new Error( 'No delete method' )

        const method = this.__apibase.methods.delete

        const headers = this.__apibase.headers[method]( this.__auth )
        headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'

        const config = {
            method,
            headers,
        }

        const url = this.__url + '/' + id

        return request({
            url,
            config,
            callback: this.__apibase.handleResponse
        })
    }

    /**
    * Get methods accepted by the service.
    *
    * @return	{Array}		Array of methods (string).
    */
    get methods(){
        return Object.keys( this.__apibase.methods )
    }
}

/**
* Make request
*
* @param	{Object}		config			Configuration for fetch.
* @param	{string}		config.method	Method (GET|POST|PATCH).
* @param	{string}		config.url		Url to fetch.
* @param	{Object}		config.data		Json to send.
* @return	{Object}		Response Object of a request.
*/
const request = async({ url, config, callback }) => {
    const data = config.body
        ? JSON.parse( config.body )
        : {}

    try {
        const response = await fetch( url, config )
            .then( res => {
                if( res.status === 204 )
                    throw new Error( 'No Content' )
                if( res.status >= 200 && res.status < 300 )
                    return res.json()

                const error = new Error( res.statusText || res.status )
                error.response = res
                throw error
            })
            .then( json => callback( json, url, data ) )
        return response
    } catch ( error ) {
        throw error
    }
}
