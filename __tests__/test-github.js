require( 'dotenv' ).load()
import LetItBin from '../index'

/*
 * In intend to use this test, replace:
 * process.env.GITHUBLOG by your write.as usename
 * process.env.GITHUBPASS by your write.as password
 * process.env.GITHUBGIST by the id of a gist of your user account
 * process.env.GITHUBCONT by the content of this user gist
 */

const letItBin = new LetItBin( 'github', {
    username: process.env.GITHUBLOG,
    password: process.env.GITHUBPASS
})

test( 'get', async() => {
    expect.assertions( 2 )

    const bin = await letItBin.get( process.env.GITHUBGIST )

    expect( bin.id ).toBe( process.env.GITHUBGIST )
    expect( bin.content ).toBe( process.env.GITHUBCONT )
})

test( 'get token', async() => {
    expect.assertions( 1 )

    const token = await letItBin.getToken()

    expect( token ).toBe( true )
})

test( 'update', async() => {
    expect.assertions( 3 )

    const change = await letItBin.update( process.env.GITHUBGIST, 'fff' )
    const undo = await letItBin.update( process.env.GITHUBGIST, process.env.GITHUBCONT )

    expect( change.id ).toBe( process.env.GITHUBGIST )
    expect( change.content ).toBe( 'fff' )
    expect( undo.content ).toBe( process.env.GITHUBCONT )
})

test( 'create & delete', async() => {
    expect.assertions( 2 )

    try {
        const create = await letItBin.create( 'blabla' )

        expect( create.content ).toBe( 'blabla' )

        await letItBin.delete( create.id )
    } catch ( e ) {
        expect( e.message ).toBe( 'No Content' )
    }
})

test( 'error', async() => {
    expect.assertions( 1 )

    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'Not Found' )
    }
})
