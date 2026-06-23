# Interview Questions on HTML

## 1. What is HTML?

 HTML stands for HyperText Markup Language. It is the standard markup language used to structure web pages. HTML uses elements and attributes to describe the structure, the meaning, and the relationships of content, so browsers and other tools can interpret and display the page correctly.

## 2. What is the minimal structure of an HTML5 document?

 An HTML5 document is supposed to start with the `<!DOCTYPE html>` declaration, followed by the `<html>` root element. The `<html>` element should have a language attribute on it, `lang`, that indicates the primary language of the page.

 In the `<html>` element, there should be a `<head>` section and a `<body>` section. The `<head>` section contains information that is not directly displayed on the page, actually it is the metadata for the page itself. There should be, at least, a `<meta>` tag for the character set, a `<meta>` tag for the `"viewport"`, and a `<title>` tag for the title of the webpage.

 While the `<body>` section contains the visible content displayed in the browser. Everything you want the user to actually see should be placed inside this tag.

 These are the necessities that make up the minimal structure, or the boilerplate of an HTML5 document.

## 3. What is the purpose of the `<meta>` tag?

 The `<meta>` tag is used to provide metadata about the web page itself. This kind of information is usually not displayed directly on the page, but it is machine-readable and can give instructions to browsers, search engines, and social media platforms on how to interpret the document.

 For example, `<meta>` tag can specify the character encoding the page is using; it can be used for defining the viewport settings; it can provide a page description, and it can define how the page appears in search results and link previews.

## 4. What is the difference between `<head>` and `<header>`?

 They are both HTML elements, but they are very different.

 The `<head>` element is part of the basic HTML structure and is placed inside the `<html>` element, before the `<body>` element. It contains information that is not directly displayed on the page, such as metadata, the page title, and links to external resources like the CSS files.

 The `<header>` element is a semantic element you can use inside the `<body>`. It is used for the introductory area of a page or a section, and it may things like a logo, a page title, or navigation links. So you can see, `<head>` and `<header>` are totally two different elements.

## 5. What element can we use to create a dropdown list?

 We usually use the `<select>` element to create a dropdown list. Each item in the dropdown is represented by an `<option>` element, and the selected value can be submitted with a form.

## 6. What is the `<form>` tag used for in HTML?

 The `<form>` tag is used to collect user input. It can contain different form controls, such as input fields, radio buttons, checkboxes, dropdown lists, text areas, and submit buttons. When the form is submitted, the data can be sent to a server for processing, usually based on the form’s `action` and `method` attributes.

## 7. Attributes in `<a>` tags

### 7.1 Explain the `rel="noreferrer nofollow"` attribute in `<a>` tag

- `rel` stands for relationship. This attribute tells the browser and search engines how your website relates to the website you are linking to.
- `noreferrer` asks the browser not to send an "HTTP Referer" header to the destination website so that the analytics of the destination website will not know that these visits are from our website.
- `nofollow` means “do not follow this link.” It asks search engines not to use this link from my site as a crawl path. In practice, it means that we do not want to endorse the linked page or pass ranking credit to it, from the perspective of a search engine.

### 7.2 How can we open the link in a new tab?

 You can use the `target` attribute in the `<a>` tag and set its value to `'_blank'`.

## 8. How do you serve your page in multiple languages?

 From the HTML perspective, the good practice is to provide separate localized versions of the page, usually through separate files or routes. Each version should set the correct language attribute on the `<html>` element, such as `"en"` for English, so that browsers, screen readers, and search engines can understand the language of the document.

## 9. What are semantic HTML tags, and why are they important?

 The semantic HTML tags are tags that describe the meaning of the content they contain. For example, there is `<header>`, which means that the elements inside of it are introductory for this whole page or this section. We also have `<nav>` for navigation links, `<main>` for the primary content, `<article>` for a self-contained content, `<section>` for a grouping of content, and `<aside>` for content that is tangentially related to the main content. And at last there is `<footer>`.

 There are also text-level semantic tags, such as `<h1>` to `<h6>`, `<strong>`, `<em>`, `<blockquote>`, and `<mark>`. They describe the meaning or importance of the text, and they may or may not, give them a specific appearence.

 In general, the semantic tags are very importand and essential because they help both the web browser and the developer to really understand the meaning and purpose of the content.

## 10. What’s the difference between SVG and Canvas?

 SVG and Canvas are not really the same kind of thing, even though we can say they are both used to create graphics on a web page.

 SVG stands for Scalable Vector Graphics. It is a markup-based format for describing vector graphics. SVG graphics are made of elements such as paths, circles, and rectangles; they can be scaled without losing qualit.

 Canvas, on the other hand, is a drawing surface. We use JavaScript to draw graphics on it pixel by pixel. The shapes drawn on a canvas are not separate DOM elements, and they are not scalable.

 In practice, SVG is often used for scalable UI graphics, such as icons, logos, and decorative backgrounds, frames. Canvas is more useful when the page needs custom drawing or frequent redrawing, such as in games, drawing tools, or image editing tools.
