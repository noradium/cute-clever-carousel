import StyleKey from './util/StyleKey';
import isPassiveSupported from './util/isPassiveSupported';
import {defaultOptions, Options} from './Options';

interface TouchingInfo {
  touchStartX: number;
  touchStartY: number;
  itemsStartX: number;
  isHorizontalScroll?: boolean;
}

export default class Carousel {
  private styleKey: StyleKey;
  private rootElement: HTMLElement;
  private frameElement: HTMLElement;
  private itemsElement: HTMLElement;
  private options: Options;
  /**
   * [-items[n].x, -items[n-1].x,..., -items[0].x]
   */
  private grid: number[];
  private touchingInfo: TouchingInfo | null = null;
  private itemsX: number = 0;

  private isPassiveSupported: boolean;
  private touchEventListenerOption: {passive: boolean} | false;

  constructor(
    element: Element,
    options: Options
  ) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.styleKey = new StyleKey();
    this.rootElement = element as HTMLElement;
    this.frameElement = element.getElementsByClassName(this.options.frameClassName)[0] as HTMLElement;
    this.itemsElement = element.getElementsByClassName(this.options.itemsClassName)[0] as HTMLElement;

    this.isPassiveSupported = isPassiveSupported();
    this.touchEventListenerOption = this.isPassiveSupported ? {passive: true} : false;

    this.reset();
    this.frameElement.addEventListener('touchstart', this.onTouchStart, this.touchEventListenerOption);
    window.addEventListener('resize', this.onWindowResize);
  }

  destroy() {
    this.frameElement.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('resize', this.onWindowResize);
  }

  reset() {
    this.initializeGrid();
  }

  private initializeGrid() {
    const maxGridX = this.itemsElement.scrollWidth - this.frameElement.clientWidth;
    const grid = [];
    for (let i = 0; i < this.itemsElement.children.length; ++i) {
      const x = (this.itemsElement.children[i] as HTMLElement).offsetLeft;
      if (x >= maxGridX) {
        grid.push(maxGridX);
        break;
      }
      grid.push(x);
    }
    this.grid = grid.map(x => -x).reverse();
  }

  private moveFrameTo(targetX: number, durationS: number = 0) {
    const style = this.itemsElement.style;

    style[this.styleKey.transition] = `${durationS}s ${this.options.transitionTimingFunction}`;
    style[this.styleKey.transform] = 'translate(' + targetX + 'px, 0)';
    this.itemsX = targetX;
  }

  private onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    this.touchingInfo = {
      touchStartX: touch.pageX,
      touchStartY: touch.pageY,
      itemsStartX: this.itemsX
    };

    this.frameElement.addEventListener('touchmove', this.onTouchMove, this.touchEventListenerOption);
    this.frameElement.addEventListener('touchend', this.onTouchEnd);
  };

  private onTouchMove = (event: TouchEvent) => {
    // 縦スクロールだとわかっているときは何もしない
    if (this.touchingInfo.isHorizontalScroll === false) {
      return;
    }

    const touch = event.touches[0];
    const dX = touch.pageX - this.touchingInfo.touchStartX;
    if (typeof this.touchingInfo.isHorizontalScroll === 'undefined') {
      const dY = touch.pageY - this.touchingInfo.touchStartY;
      this.touchingInfo.isHorizontalScroll = Math.abs(dX) - Math.abs(dY) > 0;
    }

    // passive 非対応ブラウザでカルーセルをスクロールしようとする場合、デフォルトのスクロールを止めないとうまく動かない
    if (!this.isPassiveSupported && this.touchingInfo.isHorizontalScroll === true) {
      event.preventDefault();
    }

    this.moveFrameTo(this.touchingInfo.itemsStartX + dX);
  };

  private onTouchEnd = (event: TouchEvent) => {
    const nearestGridX = this.getNearestGridX(this.itemsX);
    this.moveFrameTo(nearestGridX, this.options.transitionDurationSec);

    this.touchingInfo = null;
    this.frameElement.removeEventListener('touchmove', this.onTouchMove);
    this.frameElement.removeEventListener('touchend', this.onTouchEnd);
  };

  private getNearestGridX(targetX: number) {
    const grid = this.grid;

    if (grid[grid.length - 1] < targetX) {
      return grid[grid.length - 1];
    }
    for (let i = grid.length - 1; i > 0; --i) {
      if (grid[i - 1] <= targetX && targetX <= grid[i]) {
        if (targetX - grid[i - 1] < grid[i] - targetX) {
          return grid[i - 1];
        } else {
          return grid[i];
        }
      }
    }
    return grid[0];
  }

  private onWindowResize = () => {
    this.reset();
  }
}
