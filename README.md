# let-it-bin

Let It Bin provides a wrapper arround a few API for gist manipulations

Currently support:
* [Github Gists API](https://gist.github.com/) ( get | update | create | delete | getToken )
* [Friendpaste API](https://friendpaste.com/) ( get | update | create )
* [write.as API](https://write.as/) ( get | update | create | getToken ) cross-origin request not enabled
* [glot.io API](https://glot.io/) ( get | update | create | delete ) => user token needed

## Usage

```js
import LetItBin from 'let-it-bin'

const gitHub = new LetItBin( 'github', {
    username: 'MyUserName',
    password: 'MyUserPassword',
}

// this method is call everytime a request is made
github.getToken()
    .then( res => console.log( res )
    // true
    .catch( err => console.log( err )
    // false

gitHub.get( 'SomeGistId' )
    .then( res => console.log( res ) )
    /**
    * {
    *   url:        'https://api.github.com/gists/SomeGistId',
    *   id:         'SomeGistId',
    *   content:    'ContentOfTheGist'
    * }
    */
    .catch( err => console.log( err ) )
    /**
    * return an Error Object
    */

github.update( 'SomeGistId', 'NewText' )
    .then( res => console.log( res ) )
    /**
    * {
    *   url:        'https://api.github.com/gists/SomeGistId',
    *   id:         'SomeGistId',
    *   content:    'NewText'
    * }
    */
    .catch( err => console.log( err ) )
    /**
    * return an Error Object
    */

github.create( 'SomeText' )
    .then( res => console.log( res ) )
    /**
    * {
    *   url:        'https://api.github.com/gists/SomeGistId',
    *   id:         'SomeGistId',
    *   content:    'SomeText'
    * }
    */
    .catch( err => console.log( err ) )
    /**
    * return an Error Object
    */

github.methods
// return [ get, update, create, delete, getToken ]
```
