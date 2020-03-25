## Spicy Html

Wouldn't it be nice to have...?

```
my-awesome-site
  |--> coms
    |-- Hero.html
    |-- Document.html
    |-- Sidebar.html
    |-- Main.html
  |--> pages
    |-- index.html
    |-- about.html
    |-- contact.html
```

```html
<!-- pages/index.html -->

<com.Document
  title="Home"
  desc="my-awesome-site-home"
>
  <com.Hero />
  Hello and welcome to __name__
</com.Document>
```

```html
<!-- pages/about.html -->

<com.Document
  title="About"
  desc="my-awesome-site-about"
>
  About page
</com.Document>
```

```html
<!-- coms/Document.html -->

<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="__desc__">
    <title>__title__</title>
  </head>
  <body>
    <com.Header />
    <com.Sidebar />
    <h1>__title__</h1>
    <com.Main>
      __inner__
    </com.Main>
  <body>
</html>
```

```html
<!-- coms/Hero.html -->

<style>
  .hero {
    padding: 2rem;
  }
  .slide {
    background-color: __primary__;
  }
</style>

<div class='hero'>
  <div class='slide'>Slide one</div>
  <div class='slide'>Slide two</div>
</div>

<script>
  // Your java script will be tucked inside
  // a self-invoking function.
  const slides = document.querySelectorAll('.slide');
  // do stuff...
</script>
```

And build with
```js
build({
  root: 'my-awesome-site',
  entry: 'pages.index',
  props: {
    name: 'My awesome site',
    primary: '#333',
  }
});
```

## Makes sense?!
- Encapsulate static html files.
- Reuse static html files.
- Small file sizes, check [Spicy Html](https://spicyhtml.com) file sizes on dev tools, it's built with Spicy Html.
- Keeps the browser happy.
- The fact of the matter is that most users will view your website on bloated 8GB RAM machines, those machines do not like too much JavaScript.
- Work with html not against it, this tool is just a small step that makes working with static html a pleasure.
- Works well with BEM CSS methodology.

## Dependencies
node >= 10

## Usage
```sh
npm install spicyhtml --save
```
`package.json`
```json
{
  "scripts": {
    "build": "spicyhtml spicyhtml.config.js"
  }
}
```
`spicy.config.js`
```js
module.exports = {
  root: 'src',
  entry: 'pages.index',
  props: {
    primary: '#ccc',
  }
}
```

or programmatically
```js
build({
  root: 'my-awesome-site',
  entry: 'pages.index',
  props: {
    name: 'My awesome site',
    primary: '#333',
  }
});
```
