const fetch = require( 'node-fetch' )

/**
* Make request
*
* @param	{Object}		config			Configuration for fetch.
* @param	{string}		config.method	Method (GET|POST|PATCH).
* @param	{string}		config.url		Url to fetch.
* @param	{Object}		config.data		Json to send.
* @return	{Object}		Response Object of a request.
*/
export const request = async({ url, config, callback }) => {
    const data = config.body
        ? JSON.parse( config.body )
        : {}

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
        .catch( err => {
            throw err
        })

    return response
}

export const getHeaders = ( apiHeaders, auth ) => {
    const useragent = 'user-agent'

    const headers = apiHeaders( auth )
    headers[useragent] = 'https://github.com/KaaJaryi/let-it-bin'

    return headers
}
