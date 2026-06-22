## 1. What is HTML?

HTML stands for HyperText Markup Language. It is used to create the structure of a web page.
For example, we use HTML to add headings, paragraphs, images, links, lists, and forms.
I think of HTML as the skeleton of a website. CSS makes it look nice, and JavaScript makes it interactive.
That is my basic understanding of HTML.

## 2. What is the minimal structure of an HTML5 document?

A minimal HTML five document usually includes DOCTYPE, the html tag, the head tag, and the body tag.
We start with DOCTYPE html. Then we have the html element.
Inside the html element, we have the head section. The head section usually includes page settings, like the title.
Then we have the body section. The body section contains the content users can see on the page, like headings, paragraphs, images, and links. So in this example, the title is “My Page”, and the page shows “Hello” as an H1 heading.
So this is the basic HTML structure I normally start with.

## 3. What is the purpose of the meta tag?

The meta tag gives information about the web page.
We can use it to set the character encoding, page description, author, or viewport for mobile screens.
A common one is: <meta charset="UTF-8">
It helps the page show text correctly, including English, Chinese, and symbols.
Basically, meta is used for page information and browser settings.

## 4. What is the difference between <head> and <header>?

The head tag is not visible on the page. It is used for page settings, like the title, meta tags, CSS links, and scripts.The header tag is visible on the page. It is usually the top part of the website, like the logo, page title, or navigation menu.
So the head tag is for the browser, and the header tag is for users to see. That is the main difference.

## 5. What element can we use to create a dropdown list?

We can use the select element to create a dropdown list. Inside the select element, we use option elements for each choice. If I want a dropdown with Apple and Banana, I can put two options inside the select tag. So the select tag creates the dropdown box, and the option tag creates each item in the list.
That is how I usually use it.

## 6. What is the <form> tag used for in HTML?

The <form> tag is used to collect user input.
For example, login forms, signup forms, search boxes, and contact forms usually use <form>.
Inside a form, we can put inputs, labels, buttons, checkboxes, and text areas.
When the user submits the form, the data can be sent to a server.
So the main purpose of <form> is to collect and submit user information.

## 7. Explain the rel="noreferrer nofollow" attribute in <a> tag. How can we open the link in a new tab?

The rel attribute tells the browser the relationship between the current page and the linked page.
noreferrer means the linked website will not know where the user came from. nofollow tells search engines not to follow this link or give ranking value to it. To open a link in a new tab, we use target blank.
If it's in an anchor tag, we can write href for the link, target blank for opening a new tab, and rel with noreferrer and nofollow. So target blank opens the new tab, and rel controls privacy and search engine behavior.
That is the simple way I understand it.

## 8. How do you serve your page in multiple languages?

We can serve a page in multiple languages by creating different language versions of the same page.
For example, we can have one English page and one Chinese page. We should also set the lang attribute in the html tag. For example, lang equals en for English, and lang equals zh for Chinese. This helps browsers and screen readers understand the language of the page.
So basically, we use different page versions and set the correct lang attribute.

## 9. What are semantic HTML tags, and why are they important?

Semantic HTML tags are tags with clear meaning. For example, <header>, <nav>, <main>, <section>, <article>, and <footer>. They make the page structure easier to understand. They are also helpful for accessibility, search engines, and other developers reading the code. So semantic tags do not just create layout. They also explain what each part of the page means. That is why they are important.

## 10. What’s the difference between SVG and Canvas?

SVG is based on shapes, like circles, lines, and paths. It is good for icons, logos, and simple graphics.
Canvas is like a drawing area. We use JavaScript to draw on it. SVG elements can be selected and styled with CSS. Canvas is more like pixels after drawing. So I would use SVG for clear graphics and icons, and Canvas for games, animations, or more complex drawing. That is the main difference for me.

## 2. Quiz

W3Schools HTML Quiz: https://www.w3schools.com/html/html_quiz.asp

![HTML Quiz Result](c0525f812b3d1254487927f0ea319a3e.png)
