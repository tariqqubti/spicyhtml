![Spicy Html Logo](./resources/spicyhtml-logo.png)

## Spicy Html (A spicy html builder)

A tool that helps encapsulate html components and makes it easy to reference and compose them.

It also enables customization of html components at build time using props.

It will also group all styles and scripts at build time to allow for smaller file sizes.

## Installation

```sh
npm install spicyhtml --save
```

## Usage

Programmatically:

```js
const {build} = require('spicyhtml');

build({
  root: 'my-awesome-site',
  entry: 'pages.index',
  props: {
    name: 'My awesome site',
    primary: '#333',
  },
  output: path.resolve('static'),
});
```

## Components
Any `.html` file within your project can be a component.
It could be the header, the whole html document, just a script or a style tag, even plain text can be a component anything really can be a component.

## References
You can reference components from other components. 

The rule is any tag with a name that either:
- Contains a dot e.g.  `<com.Home />`
- Starts with a Capital letter e.g. `<Link />`

The root parameter sent to the build command will be the parent for all your components.

For example if the root is `/home/projects/foo`
```html
<!-- /home/projects/foo/pages/layout/Main.html -->

<main>__inner__</main>
```

Will be referenced (from anywhere) like:

```html
<!-- home/projects/foo/com/About.html -->

<pages.layout.Main>
  Stuff
</pages.layout.Main>
```

And

```html
<!-- com/Sidebar.html -->

<div class='sidebar'>
  ...sidebar stuff
</div>
```

Will be referenced by:

```html
<!-- com/OtherComponent.html -->

<div>
  <com.Sidebar />
</div>
```

## Props

You can send values to components in order to customize them.

For example if the reference:

```html
<com.Field type="text" Label="Name" />
```

And the component:

```html
<!-- com/Field.html -->

<div class="field">
  <label>__label__</label>
  <input type="__type__">
</div>
```

The output would be:

```html
<!-- Output -->

<div class="field">
  <label>Name</label>
  <input type="text">
</div>
```

All \_\_prop_name\_\_ values inside the component will be replaced with what was sent in the reference.

Prop names are surrounded by two underscores.

Props will propagate, what you send as props to some component will trickle down to its referenced components unless they were overridden down the tree.

### The special `inner` prop

`__inner__` will act as the place holder for the reference inner value, for example:

```html
<!-- com/Link.html -->
<a href="__to__">__inner__</a>

<!-- Reference -->
<com.Link to="/about">About</com.Link>

<!-- Output -->
<a href="/about">About<a>
```

You can also specify inner as a prop, if you don't want to bother writing a closing tag.
```html
<com.Link to="/about" inner="About" />
```
Though if the reference tag is not self-closing and actually have something inside, it will override the inner prop.

## Styles and Scripts

The builder will cache all styles and scripts tags it encounters during building, and add the first instance of them in the end of the building process.

Adding the styles just before the ending of the `<head>` tag, and scripts just before the ending of the `<body>` tag.

All scripts will be wrapped with a self invoking function, so you don't need to worry about overwriting an existing variable.

```html
...
<style>
  /* com.Link */
  .link {color: red}
  /* com.Field */
  .field .input {padding: 5px}
</style>
</head>
...
<script>
  (function() {
    /* com.Link */
    var foo = 42;
  })();
  (function() {
    /* com.Field */
    var foo = 42;
  })();
</script>
</body>
...
```

## What's the point

- Encapsulate static html files using components.
- Reuse static html files by referencing them from other files.
- Small file sizes, check [Spicy Html](https://spicyhtml.com) file sizes on dev tools, it's built with Spicy Html.
- Keeps the browser happy.
- The fact of the matter is that most users will view your website on bloated 8GB RAM machines, those machines do not like too much JavaScript.
- Work with html not against it, this tool is just a small step that makes working with static html a pleasure.
- Works well with BEM CSS methodology.

## Example

- There is a [small example](https://github.com/tariqqubti/spicyhtml/tree/master/example) in this repo.
- Here is a quick example:

```
my-awesome-site
  |--> com
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
<!-- com/Document.html -->

<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="__desc__">
    <title>__title__</title>
  </head>
  <body>
    <com.Sidebar />
    <h1>__title__</h1>
    <com.Main>
      __inner__
    </com.Main>
  <body>
</html>
```

```html
<!-- com/Hero.html -->

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
  },
  output: path.resolve('static'),
});
```

And output
```html
<!-- index.html -->
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="my-awesome-site-home">
    <title>Home</title>
    <style>
      .hero {
        padding: 2rem;
      }
      .slide {
        background-color: #333;
      }
    </style>
  </head>
  <body>
    <div class="sidebar">...</div>
    <h1>Home</h1>
    <main>
      <div class='hero'>
        <div class='slide'>Slide one</div>
        <div class='slide'>Slide two</div>
      </div>
      Hello and welcome to My awesome site
    </main>
    <script>
      (function() { /* com.Hero */
        const slides = document.querySelectorAll('.slide');
      })();
    </script>
  <body>
</html>
```

## Dependencies

- node >= 10
- chokidar (for watcher)