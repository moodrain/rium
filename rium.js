function $e(id) {
    return typeof id == 'string' ? document.querySelector('#' + id) : id
}

function $query(name, type = 'string') {
    let query = name => {
        name = name.replace(/[\[\]]/g, '\\$&')
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        let results = regex.exec(window.location.href)
        if (!results) {
            return null
        }
        if (!results[2]) {
            return ''
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }
    let value = query(name)
    switch (type) {
        case 'integer':
            // no break
        case 'int':
            let number = window.parseInt(value)
            return isNaN(number) ? '' : number
        default:
            return value
    }
}

function $to(url, query) {
    if (typeof url !== 'string') {
        query = url
        url = window.location.origin + window.location.pathname
    }
    let oldQuery = {}
    let oldQueryStr = window.location.search.substr(1).split('&')
    oldQueryStr.forEach(e => {
        let [key, val] = e.split('=')
        oldQuery[key] = val
    })
    query = Object.assign(oldQuery, query)
    let queryArr = []
    let queryStr = '?'
    for (let key in query) {
        query[key] != null && query[key] !== '' && queryArr.push(key + '=' + query[key])
    }
    if (queryArr) {
        queryStr += (queryArr.join('&'))
        window.location.href = url + queryStr
    } else {
        window.location.href = url
    }
}

function $submit(url, data) {
    if (typeof url === 'object') {
        data = url
        url = window.location.href
    }
    let form = document.createElement('form')
    form.style.display = 'none'
    form.action = url
    form.method = 'POST'
    let formData = $obj2Url(data)
    for (let key in formData) {
        let val = formData[key]
        let inp = document.createElement('input')
        inp.name = key
        inp.value = val
        form.appendChild(inp)
    }
    document.body.appendChild(form)
    form.submit()
}

function $obj2Url(obj) {
    let form = {}
    let helper = {
        run(obj) {
            for (let key in obj) {
                let val = obj[key]
                if (typeof val === 'object') {
                    this.handle(val, [key])
                } else {
                    form[key] = val
                }
            }
        },
        handle(obj, prefix) {
            for (let key in obj) {
                let htmlKey = ''
                let val = obj[key]
                if (typeof val === 'object') {
                    let newPrefix = prefix.concat(key)
                    this.handle(val, newPrefix)
                } else {
                    for (let i = 0; i < prefix.length; i++) {
                        htmlKey += (i === 0 ? prefix[i] : `[${prefix[i]}]`)
                    }
                    htmlKey += `[${key}]`
                    form[htmlKey] = val
                }
            }
        }
    }
    helper.run(obj)
    return form
}

function $fet(url, data, method = 'get') {
    method = method.toLowerCase()
    if (method === 'get' && data) {
        url += ('?' + new URLSearchParams($obj2Url(data)))
    }
    let option = {
        credentials: 'include',
        method,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        mode: 'cors',
    }
    if (method === 'post') {
        option.headers['Content-Type'] = 'application/json'
        option.body = JSON.stringify(data)
    }
    return fetch(url, option).then(r => r.json())
}

function $ck(name, value, second) {
    if (value !== undefined) {
        let expires = ''
        let date = new Date()
        second = second ? second : 3600 * 24
        date.setTime(date.getTime() + second * 1000)
        expires = '; expires=' + date.toUTCString()
        document.cookie = name + '=' + (value || '') + expires + '; path=/'
    } else {
        let nameEQ = name + '='
        let ca = document.cookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length)
            }
        }
        return null
    }
}

function $date(date) {
    if (typeof date === 'number') {
        date = new Date(date)
    } else if (typeof date === 'string') {
        date = new Date(Number.parseInt(date))
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
}

function $time(date) {
    if (typeof date === 'number') {
        date = new Date(date)
    } else if (typeof date === 'string') {
        date = new Date(Number.parseInt(date))
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0')
}

function $timeCn(date) {
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - date
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    if (monthC >= 1) {
        result = parseInt(monthC) + '个月前'
    } else if (weekC >= 1) {
        result = parseInt(weekC) + '周前'
    } else if (dayC >= 1) {
        result = parseInt(dayC) + '天前'
    } else if (hourC >= 1) {
        result = parseInt(hourC) + '小时前'
    } else if (minC >= 1) {
        result = parseInt(minC) + '分钟前'
    } else {
        result = '刚刚'
    }
    return result
}

function $enter(btn) {
    document.onkeydown = event => {
        if (event.keyCode === 13)
            $e(btn).click()
    }
}

function $toTop(btn, elem) {
    btn = $e(btn)
    elem = elem ? $e(elem) : document.documentElement
    let toListen = elem === document.documentElement ? window : elem
    let timer = null
    let isTop = true
    btn.style.display = 'none'
    toListen.addEventListener('scroll', () => {
        if (elem.scrollHeight - elem.clientHeight - elem.scrollTop < elem.scrollHeight / 2) {
            btn.style.display = 'block'
        } else {
            btn.style.display = 'none'
        }
        if (!isTop) {
            clearInterval(timer)
        }
        isTop = false
    })
    btn.addEventListener('click', () => {
        timer = setInterval(() => {
            let osTop = elem.scrollTop
            let ispeed = Math.floor(-osTop / 6)
            elem.scrollTop = osTop + ispeed
            isTop = true
            if (osTop === 0) {
                clearInterval(timer)
            }
        }, 30)
    })
}

function $pullToLoad(elem, callback, distance) {
    let content = $e(elem)
    let status = {
        load: true,
        page: 0,
    }
    content.addEventListener('scroll', () => {
        if (content.scrollHeight - content.clientHeight - content.scrollTop < (distance ? distance : 50) && status.load) {
            status.load = false
            status.page++
                callback(status)
        }
    })
}