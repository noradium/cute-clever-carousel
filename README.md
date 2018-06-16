# cute-clever-carousel
This library doesn't have much function as yet.
Rather than a carousel, it is a scroll box with a grid.

## Sample
https://noradium.github.io/cute-clever-carousel/sample/dist

## Usage
### Install
```bash
$ npm install --save cute-clever-carousel
```

### HTML Markup
```html
<div class="carousel">
	<div class="ccc-frame">
		<div class="ccc-items">
			<img src="https://placehold.jp/150x200.png?text=1" alt="">
			<img src="https://placehold.jp/150x200.png?text=2" alt="">
			<!-- ... -->
		</div>
	</div>
</div>
```

### Required styles
```css
.ccc-frame {
	overflow: hidden;
}
.ccc-items {
	position: relative;
	white-space: nowrap;
}
.ccc-items > * {
	display: inline-block;
}
```

### js
```js
import Carousel from 'cute-clever-carousel';

new Carousel(document.getElementsByClassName('carousel')[0], {/* options */});
```

### Options
see `src/Options.ts`

## Development
```bash
$ npm run watch

$ cd sample
$ sudo npm run start
$ open http://localhost
```

## Test
```bash
$ npm test
```
