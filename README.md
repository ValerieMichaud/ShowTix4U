## ShowTix4U front-end package

This is the front-end package for the ShowTix4U redesign.


### Initial setup

```bash
# Install all the dependencies...
npm install

# If you wanna be able to use global commands `karma` and `gulp`...
npm install -g gulp
```

### Running in the browser
```bash
gulp serve

# If you wanna Gulp to re-build on every change...
gulp watch
```

### Running in the browser
```bash
# If you wanna deploy everything...
gulp web-deploy

# If you wanna deploy only the css files...
gulp css

# If you wanna deploy only the js files...
gulp js

# If you wanna deploy only the svg files...
gulp svg

# If you wanna deploy only the image files...
gulp images
```


### What are all the pieces involved?

#### [Babel]
Transpiles ES6 code into regular ES5 (today's JavaScript) so that it can be run in a today browser. Like traceur but doesn't need a runtime to work. Formerly known as 6to5.

#### [CommonJS]
Babel is configured to transpile ES6 modules into CommonJS syntax and we use browserify to bundle the code into one file to deliver it to the browser.

#### [Browserify]
Browserify walks through all files and traces down all `require()`s to bundle all files together.

#### [Sass]
Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

#### [Gulp]
Task runner to make defining and running the tasks simpler.

[ES6]: http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
[Babel]: http://babeljs.io/
[CommonJS]: http://wiki.commonjs.org/wiki/CommonJS
[Browserify]: http://browserify.org/
[Sass]: http://sass-lang.com/
[Gulp]: http://gulpjs.com/

