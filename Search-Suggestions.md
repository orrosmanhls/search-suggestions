# Table of contents

1. [Reference Files](#reference-files)
2. [Options](#options)
3. [Summing up](#differences)

## Reference Files

**Links to relevant files**

- [functions.php](./themes/twentytwentyone/functions.php)
- [search.php](./themes/twentytwentyone/search.php)
- fuse.js
  - [fuzzysearch.js](./themes/twentytwentyone/assets/js/fuzzysearch.js)
- minisearch
  - [minisearch.js](./themes/twentytwentyone/assets/js/minisearch.js)
- relevanssi
  - [relevanssi plugin](./plugins/relevanssi/)
  - [relevanssi custom plugin for REST API functionality](./plugins/relevanssi-rest-api-endpoint/relevanssi-rest-api-endpoint.php)
  - [relevanssi "did_you_mean" function ](./plugins/relevanssi/lib/didyoumean.php)(changes done in lines 113-115)

## Options

### 1. Using default PHP functions

Check the spelling of a word with `pspell_check()` and get a suggestions for possible spellings with `pspell_suggest()`, replace the word in the query with the first word in the array and display on the results page.

example:

```php
/*
 * Check if a word is spelled correctly
 * if not, print all the available spellings suggestions
*/
$pspell = pspell_new("en");

if (!pspell_check($pspell, "testt")) {
    $suggestions = pspell_suggest($pspell, "testt");

    foreach ($suggestions as $suggestion) {
        echo "Possible spelling: $suggestion<br />";
    }
}
```

### 2. Using the [Relevanssi](https://www.relevanssi.com/) WordPress plugin

The plugin has a built-in function [relevanssi_didyoumean()
](https://www.relevanssi.com/user-manual/functions/relevanssi_didyoumean/) to detect spelling errors and displaying a suggestion.

**NOTE:** the free version of the plugin generate the suggestions based on the **_logged searches_**, which means some user searches are needed to be done to get effective suggestions.
<br>
<br>
Also, to add REST API ability to the plugin it is better to use the [this guide](https://gist.github.com/msaari/fe2da6a584f690a213db733d596b0030) and [this post](<https://www.relevanssi.com/user-manual/using-relevanssi-outside-search-pages/#:~:text=This%20is%20a%20code%20that%20I%20am%20writing%20now%20for%20testing%20purposes%20to%20allow%20search%20through%20a%20thirdparty%20app..%0Afunction%20ao_api_search()%7B>) by the author of relevanssi

### 3. Using JS npm package [FuseJS](https://fusejs.io/)

Fast fuzzy-search package.
example:

```javascript
const posts = [{ title: 'test' }, { title: 'hello' }];

const fuse = new Fuse(posts);
const results = fuse.search('he');
```

Usage with WordPress;

- Get all the post of the site as JSON "mysite.com/**wp-json/wp/v2/posts**"
- Map the posts title to an array
- Pass the array of titles to the fuse object `new Fuse(posts)`
- Pass the search query to `fuse.search(query);`

**Alternative:** some developers are saying fuse.js performance on big databases is not great. [minisearch](https://www.npmjs.com/package/minisearch) is an alternative with similar syntax

## Differences

|                | Pros                                                                                                                                                                                      | Cons                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **fuse.js**    | - dosen't depends on visitors search data<br>- have [php port](https://github.com/loilo/Fuse) for easy implementation in WordPress                                                        | - performance on big DB's might not be great                                                           |
| **minisearch** | - better suited for large databases (than fuse.js)                                                                                                                                        | - need to index the posts (make a cron job preferbly)<br/>- suggestions are not as relative as fuse.js |
| **relevanssi** | - easy to [implement](https://www.relevanssi.com/user-manual/functions/relevanssi_didyoumean/) (WP Plugin)<br />- can be added in later time (after enough user search data is collected) | - depends on visitors search data                                                                      |
