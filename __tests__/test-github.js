import LetItBin from '../index'

/*
 * In intend to use this test, replace:
 * 'username' by your write.as usename
 * 'password' by your write.as password
 * 'gist' by the id of a gist of your user account
 * 'content' by the content of this user gist
 */

const letItBin = new LetItBin( 'github', {
    username: 'username',
    password: 'password
})

test( 'test get', async() => {
    expect.assertions( 2 )

    const bin = await letItBin.get( 'gist )

    expect( bin.id ).toBe( 'gist )
    expect( bin.content ).toBe( 'content' )
})

test( 'test update', async() => {
    expect.assertions( 3 )

    const change = await letItBin.update( 'gist 'fff' )
    const undo = await letItBin.update( 'gist 'content' )

    expect( change.id ).toBe( 'gist )
    expect( change.content ).toBe( 'fff' )
    expect( undo.content ).toBe( 'content' )
})

test( 'test create & delete', async() => {
    expect.assertions( 2 )

    try {
        const create = await letItBin.create( 'blabla' )

        expect( create.content ).toBe( 'blabla' )

        await letItBin.delete( create.id )
    } catch ( e ) {
        expect( e.message ).toBe( 'No Content' )
    }
})

test( 'test error', async() => {
    expect.assertions( 1 )

    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'Not Found' )
    }
})
