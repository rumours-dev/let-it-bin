require( 'dotenv' ).load()
import LetItBin from '../index'

/*
 * In intend to use this test, replace:
 * process.env.WRITEASLOG by your write.as username
 * process.env.WRITEASPASS by your write.as password
 * process.env.WRITEASAGIST by the id of an anonymous gist
 * process.env.WRITEASACONT by the content of this anonymous gist
 * process.env.WRITEASUGIST by the id of a gist of your user account
 * process.env.WRITEASUCONT by the content of this user gist
 */

test( 'get', async() => {
    expect.assertions( 2 )

    const letItBin = await new LetItBin( 'writeas' )
    const bin = await letItBin.get( process.env.WRITEASAGIST )

    expect( bin.id ).toBe( process.env.WRITEASAGIST )
    expect( bin.content ).toBe( process.env.WRITEASACONT )
})

test( 'get token', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'writeas', {
        username: process.env.WRITEASLOG,
        password: process.env.WRITEASPASS
    })

    const token = await letItBin.getToken()

    expect( token ).toBe( true )
})

test( 'update', async() => {
    expect.assertions( 3 )

    const letItBin = await new LetItBin( 'writeas', {
        username: process.env.WRITEASLOG,
        password: process.env.WRITEASPASS
    })
    const change = await letItBin.update( process.env.WRITEASUGIST, 'FFF' )
    const undo = await letItBin.update( process.env.WRITEASUGIST, process.env.WRITEASUCONT )

    expect( change.id ).toBe( process.env.WRITEASUGIST )
    expect( change.content ).toBe( 'FFF' )
    expect( undo.content ).toBe( process.env.WRITEASUCONT )
})

test( 'create with token', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'writeas', {
        username: process.env.WRITEASLOG,
        password: process.env.WRITEASPASS
    })

    const create = await letItBin.create( 'blabla' )
    expect( create.content ).toBe( 'blabla' )
})

test( 'create anonymous', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'writeas' )
    const create = await letItBin.create( 'blabla' )
    expect( create.content ).toBe( 'blabla' )
})

test( 'error', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'writeas' )
    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'Not Found' )
    }
})
