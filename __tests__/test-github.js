import LetItBin from '../index'

const letItBin = new LetItBin( 'github', {
    username: '***',
    password: '***'
})

test( 'test get', async() => {
    expect.assertions( 2 )

    const bin = await letItBin.get( '***' )

    expect( bin.id ).toBe( '***' )
    expect( bin.content ).toBe( '444' )
})

test( 'test update', async() => {
    expect.assertions( 3 )

    const change = await letItBin.update( '***', 'fff' )
    const undo = await letItBin.update( '***', '444' )

    expect( change.id ).toBe( '***' )
    expect( change.content ).toBe( 'fff' )
    expect( undo.content ).toBe( '444' )
})

test( 'test create', async() => {
    expect.assertions( 1 )

    const create = await letItBin.create( 'blabla' )
    expect( create.content ).toBe( 'blabla' )
})

test( 'test error', async() => {
    expect.assertions( 1 )

    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'Not Found' )
    }
})
