import {EventEmitter} from 'events';
import StyleKey from './util/StyleKey';
import isPassiveSupported from './util/isPassiveSupported';
import {defaultOptions, Options} from './Options';
import {EventKeyMap, SlideEvent} from './Event';

interface TouchingInfo {
  touchStartX: number;
  touchStartY: number;
  itemsStartX: number;
  isHorizontalScroll?: boolean;
  lastTouchX: number;
  lastUpdatedAtMS: number;
  deltaTouchX: number;
  deltaUpdatedAtMS: number;
}

class Carousel {
  private styleKey: StyleKey;
  private rootElement: HTMLElement;
  private frameElement: HTMLElement;
  private itemsElement: HTMLElement;
  private options: Options;
  /**
   * [-items[n].x, -items[n-1].x,..., -items[0].x]
   */
  private grid: number[] = [];
  private touchingInfo: TouchingInfo | null = null;
  private itemsX: number = 0;
  private inertiaCurrentVelocity = 0;
  private inertiaTimerId: number | null = null;

  private touchEventListenerOption: {passive: boolean} | false;
  private eventEmitter: EventEmitter = new EventEmitter();

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

    this.touchEventListenerOption = isPassiveSupported() ? {passive: false} : false;

    this.reset();
    this.frameElement.addEventListener('touchstart', this.onTouchStart, this.touchEventListenerOption);
    this.frameElement.addEventListener('touchmove', this.onTouchMove, this.touchEventListenerOption);
    this.frameElement.addEventListener('touchend', this.onTouchEnd);
    this.itemsElement.addEventListener('transitionend', this.onTransitionEnd);
    this.itemsElement.addEventListener('webkitTransitionEnd' as 'transitionend', this.onTransitionEnd);
    window.addEventListener('resize', this.onWindowResize);
  }

  get hasNext() {
    return 0 <= this.nextGridIndex();
  }

  get hasPrev() {
    return this.prevGridIndex() <= this.grid.length - 1;
  }

  destroy() {
    this.frameElement.removeEventListener('touchstart', this.onTouchStart);
    this.frameElement.removeEventListener('touchmove', this.onTouchMove);
    this.frameElement.removeEventListener('touchend', this.onTouchEnd);
    this.itemsElement.removeEventListener('transitionend', this.onTransitionEnd);
    this.itemsElement.removeEventListener('webkitTransitionEnd' as 'transitionend', this.onTransitionEnd);
    window.removeEventListener('resize', this.onWindowResize);
  }

  reset() {
    this.initializeGrid();
  }

  next() {
    if (this.hasNext) {
      this.stopInertiaMove();
      this.moveFrameTo(this.grid[this.nextGridIndex()], this.options.transitionDurationSec);
    }
  }

  prev() {
    if (this.hasPrev) {
      this.stopInertiaMove();
      this.moveFrameTo(this.grid[this.prevGridIndex()], this.options.transitionDurationSec);
    }
  }

  on<K extends keyof EventKeyMap>(type: K, listener: (e: EventKeyMap[K]) => void): Carousel {
    this.eventEmitter.on(type, listener);
    return this;
  }

  private emit<K extends keyof EventKeyMap>(type: K, event: EventKeyMap[K]) {
    this.eventEmitter.emit(type, event);
  }

  private nextGridIndex() {
    const currentX = this.getNearestGridX(this.itemsX);
    const currentIndex = this.grid.indexOf(currentX);
    return currentIndex - 1;
  }

  private prevGridIndex() {
    const currentX = this.getNearestGridX(this.itemsX);
    const currentIndex = this.grid.indexOf(currentX);
    return currentIndex + 1;
  }

  private initializeGrid() {
    const maxGridX = this.itemsElement.scrollWidth - this.frameElement.clientWidth;
    if (maxGridX < 0) {
        this.grid = [0];
        return;
    }
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

  private onTransitionEnd = (e: TransitionEvent) => {
    this.emit('slideEnd', {
      currentIndex: this.grid.length - 1 - this.grid.indexOf(this.getNearestGridX(this.itemsX)),
      total: this.grid.length
    });
  };

  private onTouchStart = (event: TouchEvent) => {
    this.stopInertiaMove();

    const touch = event.touches[0];
    this.touchingInfo = {
      touchStartX: touch.pageX,
      touchStartY: touch.pageY,
      itemsStartX: this.itemsX,
      lastTouchX: touch.pageX,
      lastUpdatedAtMS: Date.now(),
      deltaTouchX: 0,
      deltaUpdatedAtMS: 0
    };
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
    const now = Date.now();
    this.touchingInfo.deltaTouchX = this.touchingInfo.lastTouchX - touch.pageX;
    this.touchingInfo.deltaUpdatedAtMS = now - this.touchingInfo.lastUpdatedAtMS;
    this.touchingInfo.lastTouchX = touch.pageX;
    this.touchingInfo.lastUpdatedAtMS = now;

    if (this.touchingInfo.isHorizontalScroll) {
      event.preventDefault();
      this.moveFrameTo(this.touchingInfo.itemsStartX + dX * this.options.scrollDeltaCoefficient);
    }
  };

  private onTouchEnd = (event: TouchEvent) => {
    if (this.touchingInfo.deltaUpdatedAtMS) {
      const initialVelocity = this.touchingInfo.deltaTouchX * this.options.scrollDeltaCoefficient / this.touchingInfo.deltaUpdatedAtMS; // px/msec

      // 初速が0に近い場合は直接アニメーションで動かします。
      if (!this.options.inertia || !initialVelocity || this.abs(initialVelocity) < 0.1) {
        this.moveFrameTo(this.getNearestGridX(this.itemsX), this.options.transitionDurationSec);
      } else {
        this.startInertiaMove(-initialVelocity);
      }
    }

    this.touchingInfo = null;
  };

  /**
   *         => acc[px/ms^2]
   * |--------------|
   * |  .ccc-items  | -> initialVelocity[px/ms]
   * |--------------|
   * ----------------------------------------------> X
   * ↑this.itemsX[px]
   */
  private startInertiaMove(initialVelocity: number) {
    // 与えられた初速から到着地点の nearestGridX を算出
    const targetX = this.getNearestGridX(this.itemsX + (initialVelocity > 0 ? 1 : -1) * 0.5 * initialVelocity * initialVelocity / this.options.inertiaAcceleration);
    const diffX = targetX - this.itemsX;

    // 初速に対して算出された diffX が逆方向の場合、そのまま慣性運動させると永遠に止まらないので、直接アニメーションで動かして終了
    if (initialVelocity * diffX < 0) {
      this.moveFrameTo(targetX, this.options.transitionDurationSec);
      return;
    }

    // targetX にちょうど到達するための加速度(符号付き)を逆算して微調整
    const acc = -0.5 * initialVelocity * initialVelocity / diffX;

    const inertiaIntervalMS = this.options.inertiaIntervalMS;

    this.inertiaCurrentVelocity = initialVelocity;
    this.inertiaTimerId = window.setInterval(() => {
      const currentVelocity = this.inertiaCurrentVelocity;
      const nextX = this.itemsX + currentVelocity * inertiaIntervalMS;
      const nextXtargetXDiff = targetX - nextX;
      // nextX が targetX に十分近くなったら終了
      const done = currentVelocity < 0 ? nextXtargetXDiff > -1 : nextXtargetXDiff < 1;

      if (done) {
        this.stopInertiaMove();
        this.moveFrameTo(targetX, Math.min(-1 * currentVelocity / acc * 0.001, this.options.transitionDurationSec));
        return;
      }

      this.moveFrameTo(nextX);
      this.inertiaCurrentVelocity = currentVelocity + acc * inertiaIntervalMS;
    }, inertiaIntervalMS);
  }

  private stopInertiaMove() {
    if (this.inertiaTimerId !== null) {
      clearInterval(this.inertiaTimerId);
      this.inertiaTimerId = null;
    }
  }

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

  private abs(x: number) {
    return x < 0 ? -x : x;
  }

  private onWindowResize = () => {
    this.reset();
  }
}

export default Carousel;
export {Options, SlideEvent};
