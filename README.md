# cute-clever-carousel

## Usage
### Install
```bash
npm install --save cute-clever-carousel
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
