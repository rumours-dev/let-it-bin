import apiBase from './services'
import { request, getHeaders } from './utils'

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
    * Make a request for a token
    *
    * @return	{bolean}		Return true if this.__auth.token is define.
    */
    async getToken(){
        if( this.__auth.token )
            return true
        if( !this.__apibase.extractToken
            || ( this.__apibase.extractToken && !this.__auth.token && !this.__auth.username ) )
            return false

        const url = this.__apibase.authentificationUrl

        const method = this.__apibase.methods.getToken

        const headers = getHeaders( this.__apibase.headers[method], this.__auth )

        const body = JSON.stringify( this.__apibase.formatAuthentificationData( this.__auth ) )

        const config = {
            method,
            headers,
            body
        }

        this.__auth.token = await request({
            url,
            config,
            callback: this.__apibase.extractToken
        })
            .then( resToken => {
                return resToken
            })
            .catch(  error => {
                throw new Error( error, 'can\'t get token' )
            })
        return this.__auth.token
            ? true
            : false
    }

    /**
    * Make a GET request of a gist
    *
    * @param	{string}		id			Id of the gist/snippet to GET.
    * @return	{Promise}		Promise object of a request() of id.
    */
    async get( id ){
        if( this.__apibase.needToken && this.__auth.username && !this.__auth.token ){
            this.__auth.token = await this.getToken( this.__apibase, this.__auth )
                .then( res => res )
                .catch( err => {throw err })
        }

        const method = 'GET'

        const headers = getHeaders( this.__apibase.headers[method], this.__auth )

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
    async update( id, newText ){
        if( !this.__apibase.methods.update ) throw new Error( 'No update method' )
        if( this.__apibase.needToken && this.__auth.username && !this.__auth.token ){
            this.__auth.token = await this.getToken( this.__apibase, this.__auth )
                .then( res => res )
                .catch( err => {throw err })
        }

        const body = JSON.stringify( this.__apibase.formatData( newText ) )

        const method = this.__apibase.methods.update

        const headers = getHeaders( this.__apibase.headers[method], this.__auth )

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
    async create( text = '' ) {
        if( !this.__apibase.methods.create ) throw new Error( 'No create method' )
        if( this.__apibase.needToken && this.__auth.username && !this.__auth.token ){
            this.__auth.token = await this.getToken( this.__apibase, this.__auth )
                .then( res => res )
                .catch( err => {throw err })
        }

        const body = JSON.stringify(  this.__apibase.formatData( text ) )

        const method = this.__apibase.methods.create

        const headers = getHeaders( this.__apibase.headers[method], this.__auth )

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
        if( this.__apibase.needToken && this.__auth.username && !this.__auth.token ){
            this.__auth.token = this.getToken( this.__apibase, this.__auth )
                .then( res => res )
                .catch( err => {throw err })
        }

        const method = this.__apibase.methods.delete

        const headers = getHeaders( this.__apibase.headers[method], this.__auth )

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
        const m = Object.keys( this.__apibase.methods )

        return ['get', ...m]
    }
}

export const listServices = () => {
    const arr = []
    Object.keys( apiBase ).forEach( service =>
        arr.push({
            name: service,
            needed: apiBase[service].informations.needed
        })
    )
    return arr
}

