


1. What is HTML?
It's the standard language used for create and structure web pages.

2. What is the purpose of the tag?
A tag tells a browser what a piece of content is and how it should be treated.

3. What is the minimal structure of an HTML5 document?     
```
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
</body>
</html>
```

4. What is the difference between <head> and <header> ?
<head> element contains information about the webpage.
<header> element contains visible contetn at the top of a page.

5. What element can we use to create a dropdown list?
To create a dropdown list in HTML.
use the <select> element together wtih <otpion> elements.

```
<label for="cars">Choose a car:</label>

<select id="cars" name="cars">
    <option value="toyota">Toyota</option>
    <option value="honda">Honda</option>
    <option value="ford">Ford</option>
</select>
```

6. What is the <form> tag used for in HTML?
<form> tag is used to create a form that collects user input and sends it to a server for processing.

```
<form action="/submit" method="post">
    <label>Name:</label>
    <input type="text" name="name">

    <button type="submit">Submit</button>
</form>
```

7. Explain the rel="noreferrer nofollow" attribute in <a> tag? How can we open the link in a new tab?

`noreferrer` prevents the browser from sending the referring page's URL to the destination site.
`nofollow` tells search engines not to pass SEO ranking value through the link.

```
<a href="https://example.com" rel="noreferrer nofollow">
    Visit Site
</a>
```

Use `target="_blank"` to oepn the linkin a new tab.

```
<a href="https://example.com" target="_blank">
    Open in New Tab
</a>
```

8. How do you serve your page in multiple languages?
Use the `lang` attribute.
```
<html lang="en">
```

9. What are semantic HTML tags, and why are they important?      
Semantic HTML tags are tags that decscribe the meaning and purpose of their content.
They are important because they offer better readability, accessibility.

```
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
```

10. Whatʼs the difference between SVG and Canvas?
SVG is vector-based, and each shape is a DOM element. It is easier to style with CSS, easy to attach events. Use it for logos, etcs.
Canvas is pixel-based, each drawing is just pixels. It's not directly styleable with CSS, and it's harder to attach events. Use it for games, etcs.