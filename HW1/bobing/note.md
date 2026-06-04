1. What is **HTML**?  
   1. HTML stands for HyperText Markup Language.  
   2. It is used to structure content on web pages.

2. What is the **purpose** of the \<meta\> tag?  
   1. The \<meta\> tag provides metadata about the webpage, such as charset, viewport, description, and SEO information.  

3. What is the **minimal structure** of an **HTML5 document**?
    ```HTML
      <!DOCTYPE html>
      <html>
        <head>
          <title>Page</title>
        </head>
        <body>
          Hello
        </body>
      </html>
    ```

4. What is the difference between `<head>` and `<header>`?  
   1. `<head>` contains metadata and is not visible on the page.  
   2. `<header>` is visible content, usually used for page or section headers.

5. What element can we use to create a dropdown list?  
   1. We use the `<select>` element.  
        
6. What is the `<form>` tag used for in HTML?  
   1. The `<form>` tag is used to collect and submit user input.  
        
7. Explain `rel="noreferrer nofollow"` in `<a>` tag. How can we open the link in a new tab?  
   1. `noreferrer`： Prevents the browser from sending referrer information. Because sometimes we don’t want the targeting website where the users were navigated from.  
   2. `nofollow`： Tells search engines not to pass SEO ranking to the link. We usually use this in ads links, or untrusted website links.  

8. How do you serve your page in multiple languages?  
   1. Usually by using i18n (internationalization).  
   2. We store translations in different language files and switch content based on user language or locale.  
   3. en.json；zh.json；ja.json

9. What are **semantic HTML tags**, and why are they important?  
   1. Semantic tags describe the meaning of the content.  
   2. \<header\>\<nav\>\<main\>\<section\>\<article\>\<footer\>  
   3. better accessibility  
      better SEO  
      easier to maintain

10. What’s the difference between SVG and Canvas?  
    1. SVG  
       1. vector\-based  
       2. scalable without quality loss  
       3. good for icons and charts  
    2. Canvas  
       1. pixel\-based  
       2. good for games and animations  
       3. rendered with JavaScript