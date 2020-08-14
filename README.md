# rium
約束の歌を連れて

| Function | Note |
| ------------ | ------------ |
| $e(id)  | get element by id |
| $query(name)  | get query parameter from url by name  |
| $to(url, query, reset = false) | go to url with query parameter, origin query parameter will be ignored if reset is true
| $reset() | refresh current page and remove all query parameter
| $submit(url, data) | submit a form to url with data
| $obj2Url(obj) | convert an object to the query parameter of url
| $fet(url, data, method = 'get') | use fetch to return a promise to handle json response
| $ck(name, value, second) | get or set a cookie
| $date(date) | return date format like 2020-01-01
| $time(date) | return time format like 00:00:00
| $enter(callback) | bind a callback to document enter key down event
| $toTop(btn, elem) | bind a smooth to top action to element click event
| $pullToLoad(elem, callback, distance) | callback will be called when element scroll to bottom
| $bindVue(vue) | bind all function above to vue prototype
