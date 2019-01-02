import LetItBin from '../index'

/*
 * In intend to use this test, replace:
 * 'token' by youy api token
 * 'anonymousGist' by the id of an anonymous gist
 * 'anonymousContent' by the content of this anonymous gist
 * 'userGist' by the id of a gist of your user account
 * 'userContent' by the content of this user gist
 */

test( 'test get', async() => {
    expect.assertions( 2 )

    const letItBin = await new LetItBin( 'glotio' )
    const bin = await letItBin.get( 'anonymousGist' )

    expect( bin.id ).toBe( 'anonymousGist' )
    expect( bin.content ).toBe( 'anonymousContent' )
})

test( 'test update', async() => {
    expect.assertions( 3 )

    const letItBin = await new LetItBin( 'glotio', {
        token: 'token'
    })
    const change = await letItBin.update( 'userGist', 'fff' )
    const undo = await letItBin.update( 'userGist', 'userContent' )

    expect( change.id ).toBe( 'userGist' )
    expect( change.content ).toBe( 'fff' )
    expect( undo.content ).toBe( 'userContent' )
})

test( 'test create & delete with token', async() => {
    expect.assertions( 2 )

    try {
        const letItBin = await new LetItBin( 'glotio', {
            token: 'token'
        })

        const create = await letItBin.create( 'blabla' )
        expect( create.content ).toBe( 'blabla' )

        await letItBin.delete( create.id )
    } catch ( e ) {
        expect( e.message ).toBe( 'No Content' )
    }
})

test( 'test create anonymous', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'glotio' )
    const create = await letItBin.create( 'blabla' )
    expect( create.content ).toBe( 'blabla' )
})

test( 'test error', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'glotio' )
    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'Not Found' )
    }
})

