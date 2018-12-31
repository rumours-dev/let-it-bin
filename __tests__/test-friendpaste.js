import LetItBin from '../index'

test( 'test get', async() => {
    expect.assertions( 2 )

    const letItBin = await new LetItBin( 'friendpaste' )
    const bin = await letItBin.get( 'tPAPw2OTnNvzeIvqebWCi' )

    expect( bin.id ).toBe( 'tPAPw2OTnNvzeIvqebWCi' )
    expect( bin.content ).toBe( 'GGG' )
})

test( 'test update', async() => {
    expect.assertions( 3 )

    const letItBin = await new LetItBin( 'friendpaste' )
    const change = await letItBin.update( 'tPAPw2OTnNvzeIvqebWCi', 'fff' )
    const undo = await letItBin.update( 'tPAPw2OTnNvzeIvqebWCi', 'GGG' )

    expect( change.id ).toBe( 'tPAPw2OTnNvzeIvqebWCi' )
    expect( change.content ).toBe( 'fff' )
    expect( undo.content ).toBe( 'GGG' )
})

test( 'test update same content', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'friendpaste' )
    try {
        await letItBin.update( 'tPAPw2OTnNvzeIvqebWCi', 'GGG' )
    } catch ( e ){
        expect( e.message ).toBe( 'no changes' )
    }
})

test( 'test create', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'friendpaste' )
    const create = await letItBin.create( 'blabla' )
    expect( create.content ).toBe( 'blabla' )
})

test( 'test error', async() => {
    expect.assertions( 1 )

    const letItBin = await new LetItBin( 'friendpaste' )
    try {
        await letItBin.get( 'dddd' )
    } catch ( e ){
        expect( e.message ).toBe( 'NOT FOUND' )
    }
})
