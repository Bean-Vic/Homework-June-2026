# HTML Notes

## 1. What is HTML?

**HTML** stands for **HyperText Markup Language**.

It is the standard language used to create the structure of web pages.

HTML tells the browser what each part of the page is, such as:

- Headings
- Paragraphs
- Links
- Images
- Forms
- Buttons
- Lists
- Tables

Example:

```html
<h1>Hello World</h1>
<p>This is a paragraph.</p>
```

HTML is not a programming language. It is a **markup language**, meaning it labels and structures content.

---

## 2. What is the minimal structure of an HTML5 document?

A minimal HTML5 document looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

### Main parts:

- `<!DOCTYPE html>` tells the browser this is an HTML5 document.
- `<html>` is the root element.
- `<head>` contains metadata and page settings.
- `<body>` contains visible page content.
- `<title>` sets the browser tab title.

---

## 3. What is the purpose of the `meta` tag?

The `<meta>` tag gives information about the web page to the browser or search engines.

Common examples:

```html
<meta charset="UTF-8">
```

This sets the character encoding so the page can display text correctly.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

This makes the page responsive on mobile devices.

```html
<meta name="description" content="A beginner HTML tutorial.">
```

This describes the page for search engines.

The `<meta>` tag usually goes inside the `<head>` section.

---

## 4. What is the difference between `<head>` and `<header>`?

`<head>` and `<header>` are different.

### `<head>`

The `<head>` element contains information about the page that is mostly not visible to users.

Example:

```html
<head>
  <title>My Page</title>
  <meta charset="UTF-8">
</head>
```

It can contain:

- Page title
- Meta tags
- CSS links
- JavaScript links

### `<header>`

The `<header>` element is visible content at the top of a page or section.

Example:

```html
<header>
  <h1>My Website</h1>
  <nav>
    <a href="/home">Home</a>
  </nav>
</header>
```

It usually contains:

- Logo
- Main heading
- Navigation menu

### Key difference

- `<head>` is for page metadata.
- `<header>` is for visible introductory content.

---

## 5. What element can we use to create a dropdown list?

We use the `<select>` element to create a dropdown list.

Each option inside the dropdown uses the `<option>` element.

Example:

```html
<label for="city">Choose a city:</label>
<select id="city" name="city">
  <option value="seattle">Seattle</option>
  <option value="dallas">Dallas</option>
  <option value="san-jose">San Jose</option>
</select>
```

- `<select>` creates the dropdown.
- `<option>` creates each selectable item.

---

## 6. What is the `<form>` tag used for in HTML?

The `<form>` tag is used to collect user input and submit it somewhere, usually to a server.

Forms can contain:

- Text inputs
- Password inputs
- Checkboxes
- Radio buttons
- Dropdowns
- Buttons

Example:

```html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">

  <button type="submit">Submit</button>
</form>
```

### Important attributes:

- `action` tells where to send the form data.
- `method` tells how to send the data, usually `GET` or `POST`.

---

## 7. Explain `rel="noreferrer nofollow"` in an `<a>` tag. How can we open the link in a new tab?

Example:

```html
<a href="https://example.com" target="_blank" rel="noreferrer nofollow">
  Visit Example
</a>
```

### `target="_blank"`

This opens the link in a new tab.

### `rel="noreferrer"`

This prevents the browser from sending the current page URL as referral information to the target website.

It also improves privacy.

### `rel="nofollow"`

This tells search engines not to pass ranking credit to the linked page.

It is often used for:

- Paid links
- Untrusted links
- User-generated content

### Common safe pattern

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Open link
</a>
```

`noopener` is commonly used with `target="_blank"` for security, because it prevents the new page from controlling the original page.

---

## 8. How do you serve your page in multiple languages?

There are several steps to support multiple languages.

### 1. Set the language on the HTML page

```html
<html lang="en">
```

For Chinese:

```html
<html lang="zh-CN">
```

### 2. Provide translated versions of your content

Example:

```html
<p>Hello</p>
<p>你好</p>
```

In real websites, translations are usually managed with internationalization tools.

### 3. Use separate URLs if needed

Example:

```text
/en/about
/zh/about
/fr/about
```

### 4. Use `hreflang` for search engines

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/">
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/">
```

This helps search engines understand which language version to show users.

---

## 9. What are semantic HTML tags, and why are they important?

Semantic HTML tags are tags that clearly describe the meaning of the content.

Examples:

```html
<header></header>
<nav></nav>
<main></main>
<section></section>
<article></article>
<aside></aside>
<footer></footer>
```

### Why they are important

Semantic HTML is important because it helps:

- Browsers understand page structure
- Search engines understand content
- Screen readers support accessibility
- Developers read and maintain code

Example:

Less semantic:

```html
<div id="nav">...</div>
```

More semantic:

```html
<nav>...</nav>
```

Use semantic tags when the tag meaning matches the content.

---

## 10. What’s the difference between SVG and Canvas?

Both SVG and Canvas can be used to draw graphics on a web page, but they work differently.

| Feature | SVG | Canvas |
|---|---|---|
| Type | Vector-based | Pixel-based |
| HTML elements | Graphics are part of the DOM | Drawn on a bitmap surface |
| Scalability | Scales without losing quality | Can become blurry when scaled |
| Interactivity | Easy to attach events to shapes | Harder; need manual event detection |
| Best for | Icons, logos, charts, diagrams | Games, animations, image editing |

### SVG example

```html
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

The circle is an actual element in the DOM.

### Canvas example

```html
<canvas id="myCanvas" width="100" height="100"></canvas>

<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(50, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
</script>
```

Canvas uses JavaScript to draw pixels.

### Simple rule

- Use **SVG** for scalable graphics, icons, diagrams, and charts.
- Use **Canvas** for games, complex animations, and pixel-based drawing.

---

## Quick Review

| Question | Short Answer |
|---|---|
| What is HTML? | A markup language for structuring web pages. |
| Minimal HTML5 structure? | `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`. |
| Purpose of `meta`? | Provides page metadata to browsers/search engines. |
| `<head>` vs `<header>`? | `<head>` is metadata; `<header>` is visible page/section intro. |
| Dropdown element? | `<select>` with `<option>`. |
| Purpose of `<form>`? | Collect and submit user input. |
| Open link in new tab? | Use `target="_blank"`. |
| Multiple languages? | Use `lang`, translated content, language URLs, and `hreflang`. |
| Semantic HTML? | Meaningful tags like `<nav>`, `<main>`, `<article>`. |
| SVG vs Canvas? | SVG is vector/DOM-based; Canvas is pixel/JavaScript-drawn. |
