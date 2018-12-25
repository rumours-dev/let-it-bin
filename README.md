# let-it-bin

Let It Bin provides a wrapper arround a few API for gist manipulations

Currently support:
* [Github Gists API](https://gist.github.com/)
* [Friendpaste API](https://friendpaste.com/)

## Usage

```js
import LetItBin from 'let-it-bin'

const gitHub = new LetItBin( 'github', {
    username: 'MyUserName',
    password: 'MyUserPassword',
}

gitHub.get( 'SomeGistId' )
    .then( res => console.log( res ) )
    /**
    * return an Object
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
    * return an Object
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
    * return an Object
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
```
