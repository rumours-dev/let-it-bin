import apiBase from './apiBase'
import { Base64 } from 'js-base64'
const fetch = require( 'node-fetch' )

export default class LetItBin {
    constructor( service, auth = {}) {
        this.__url = apiBase[service].url

        this.__auth = {
            token: auth.token,
            username: auth.username,
            password: auth.password,
        }

        this.__service = service

        if( auth.token )
            this.__authorizationHeader = 'token ' + auth.token
        else if( auth.username && auth.password )
            this.__authorizationHeader = 'Basic ' + Base64.encode(
                auth.username + ':' + auth.password
            )
    }

    get( id ){
        const method = 'GET'

        const url = this.getUrl( id )

        return this.request({ method, url })
    }

    update( id, newText ){
        const data = apiBase[this.__service].formatData( newText )

        const method = apiBase[this.__service].updateMethod

        const url = this.getUrl( id )

        return this.request({ method, url, data })
    }

    create( text ) {
        const data = apiBase[this.__service].formatData( text )

        const method = apiBase[this.__service].createMethod

        return this.request({ method, data })

    }

    getUrl( id ) {
        let url = this.__url
        if( this.__service === 'github' )
            url += this.__auth.username + '/'
        url += id

        return url
    }

    async request({ method, url = this.__url, data }){
        let headers = Object.assign( apiBase[this.__service].headers[method] )
        if( this.__auth.token )
            headers.Authorization = 'Token ' + this.__auth.token
        if( this.__authorizationHeader )
            headers.Authorization = this.__authorizationHeader

        const config = {
            method,
            headers,
        }
        if( data )
            config.body = JSON.stringify( data )

        const response = await fetch( url, config )
            .then( res => res.json() )
            .then( res => res )

        return response
    }
}
