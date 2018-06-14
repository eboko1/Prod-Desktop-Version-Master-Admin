# my.carbook.pro

## Project flow

1.  запускает nodemon
2.  стратует webpack.config.babel.js
3.  транспайлит через @babel/register при условии суфикса .babel.js

### nodemon

```json
{
    "restartable": "rs",
    "delay": "2500",
    "ignore": ["./node_modules", ".git"],
    "verbose": false,
    "watch": ["./webpack", "package.json", ".babelrc"],
    "env": {
        "NODE_ENV": "development",
        "BUILD_ENV": "development"
    },
    "exec":
        "webpack-dev-server --config='./webpack/webpack.config.babel.js' --env development",
    "ext": "js json"
}
```

1.  restartable "rs" - перезапускает nodemon

2.  delay - вреям старта автоматического restartable

3.  verbose - additional info in term logs

4.  hardcode for webpack:

```json
"env": {
    "NODE_ENV": "development",
    "BUILD_ENV": "development"
},
```

### package.json

1.  дает доступ дебажить через девтулзы хроме (chrome://inspect/#devices)

```js
"test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand --config='./jest.test.config.json'",
```

2.  soundcheck - проверить все (общий конфиг jest)

```
"soundcheck": "jest --config='./jest/jest.config.json'",
```

---

enzyme-to-json
serializer for Components snapshoting tests

identity-obj-proxy"
jest css-modules

"webpack-serve": "~0.3.1" (currently unuse / for the briht future)
webpack-dev-server 2.0

---

### root configs

> .browserslistrc
> fallback fro babel and autoprefixer

u can set alternative "@babel/preset-env",

### babel

"useBuiltIns": "usage", || "entry" чтобы работал 'entry'
нужно прямо в коде файла добавить import "@babel/polyfill"; (в webpack в поле entries)
'usage' работает автоматически (по buildins, которые нужно полифилить)
transpile - переведет функциолнал в страрый вид
polifil - создание имплементации поддерживаемой старыми браузерами

### webpack

### test

```js
describe("testString", () => {
    test("console test string!", () => {
        const foo = 2 + 2;
        debugger;
        console.log("logTEST", foo);
    });
});
```
