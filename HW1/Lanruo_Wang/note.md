# HW1八股

## 1. What is HTML?

HTML stands for HyperText Markup Language. It is the standard language used to create the structure of a web page.  
It tells the browser what content to display, such as headings, paragraphs, images, links, forms, and buttons.

## 2. What is the purpose of the `<meta>` tag?

The `<meta>` tag provides metadata about the HTML document.  
For example, it can define the character set, viewport settings, page description, and keywords.  
A common one is `<meta charset="UTF-8">`, which tells the browser to use UTF-8 encoding.

## 3. What is the minimal structure of an HTML5 document?

A minimal HTML5 document includes `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`.

html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Title</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>

## 4. What is the difference between <head> and <header>?

<head> contains metadata about the page, such as the title, meta tags, CSS links, and scripts. It is not directly displayed on the page.
<header> is a semantic HTML element displayed in the page body. It usually contains visible content like a logo, navigation menu, or page heading.

## 5. What element can we use to create a dropdown list?

We can use the <select> element with <option> elements to create a dropdown list.
<select name="city">

  <option value="dallas">Dallas</option>
  <option value="austin">Austin</option>
</select>

## 6. What is the <form> tag used for in HTML?

The <form> tag is used to collect user input and submit it to a server.
It usually contains inputs, labels, checkboxes, radio buttons, and submit buttons.
Each input should have a name attribute, because form data is submitted as key-value pairs.

## 7. Explain the rel="noreferrer nofollow" attribute in <a> tag. How can we open the link in a new tab?

noreferrer means the browser will not send the current page URL as referral information to the target website.
nofollow tells search engines not to pass ranking credit to that link.
To open a link in a new tab, we use target="\_blank".
<a href="https://example.com" target="_blank" rel="noreferrer nofollow">
Open Link
</a>

In real projects, we often use rel="noopener noreferrer" with target="\_blank" for better security.

## 8. How do you serve your page in multiple languages?

We can use the lang attribute to define the page language, for example <html lang="en">.
For a multilingual website, we can prepare different translated versions of the page and use different routes like /en and /zh.
We can also use hreflang links to help search engines understand different language versions.

## 9. What are semantic HTML tags, and why are they important?

Semantic HTML tags clearly describe the meaning of the content.
Examples include <header>, <nav>, <main>, <section>, <article>, and <footer>.
They are important because they make the page easier to read, improve accessibility, help search engines understand the page, and make the code more maintainable.

## 10. What’s the difference between SVG and Canvas?

SVG is vector-based and uses DOM elements. It is good for icons, logos, diagrams, and graphics that need to stay sharp when scaled.
Each SVG element can be styled and handled with CSS or JavaScript events.
Canvas is pixel-based. It is good for drawing many objects quickly, such as games, animations, and complex visual effects.
But once something is drawn on Canvas, it is not a separate DOM element.
