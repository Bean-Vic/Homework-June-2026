# HW1 Q & A

## HTML Quiz Result

![HTML Quiz Result](./quiz-hw2.png)

## 1. What is HTML?

HTML stands for HyperText Markup Language.

`HyperText` means it is not just plain text. A web page can also have links, images, videos, buttons, and other content. For example, when we click a link and jump to another page, that is the idea of hypertext.

`Markup` means we use tags to mark what each part of the page is, like headings, paragraphs, images, and forms.

So HTML is a language that uses tags to tell the browser the structure of a web page.

## 2. What is the minimal structure of an HTML5 document?

A minimal HTML5 document needs `<!DOCTYPE html>`, an `<html>` tag, a `<head>` tag, and a `<body>` tag.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page Title</title>
  </head>
  <body>
    Page content
  </body>
</html>
```

## 3. What is the purpose of the meta tag?

The `<meta>` tag gives extra information about the page to the browser or search engines.

For example, it can set the character encoding, viewport settings, page description, or keywords.

## 4. What is the difference between `<head>` and `<header>`?

`<head>` is not visible on the page. It contains page metadata, like title, meta tags, styles, and scripts.

`<header>` is visible content. It usually contains things like a logo, navigation, or a page heading.

## 5. What element can we use to create a dropdown list?

We can use the `<select>` element with `<option>` elements inside it.

```html
<select>
  <option>Apple</option>
  <option>Banana</option>
</select>
```

## 6. What is the `<form>` tag used for in HTML?

The `<form>` tag is used to collect user input and submit it.

For example, login forms, search boxes, signup forms, and contact forms are usually built with `<form>`.

## 7. Explain the `rel="noreferrer nofollow"` attribute in `<a>` tag. How can we open the link in a new tab?

`noreferrer` means the browser will not send the current page URL as referrer information to the target page.

`nofollow` tells search engines not to pass ranking value through this link.

To open a link in a new tab, we use `target="_blank"`.

```html
<a href="https://example.com" target="_blank" rel="noreferrer nofollow">
  Visit example
</a>
```

## 8. How do you serve your page in multiple languages?

We can create different versions of the page for different languages and set the `lang` attribute correctly, like `lang="en"` or `lang="zh-CN"`.

For larger websites, we usually use i18n tools to manage translated text and switch language based on the user's choice or browser language.

## 9. What are semantic HTML tags, and why are they important?

Semantic HTML tags clearly describe the meaning of the content.

For example, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` are semantic tags.

They are important because they make the page easier to read, better for accessibility, and better for SEO.

## 10. What's the difference between SVG and Canvas?

SVG is vector-based. Its elements are part of the DOM, so they can be styled, clicked, and scaled without losing quality.

Canvas is pixel-based. We draw on it with JavaScript, and it is better for things like games, animations, or many objects changing quickly.
