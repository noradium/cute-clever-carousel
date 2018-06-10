import Carousel from '../../src';
import isPassiveSupported from '../../src/util/isPassiveSupported';
import {JestMockUtil} from '../util/JestMockUtil';
jest.mock('../../src/util/isPassiveSupported');

describe("index", () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <div class="carousel">
	          <div class="ccc-frame">
            		<div class="ccc-items carousel-items">
			              <img src="https://placehold.jp/150x200.png?text=1" alt="">
			              <img src="https://placehold.jp/150x200.png?text=2" alt="">
			              <img src="https://placehold.jp/150x200.png?text=3" alt="">
		            </div>
	          </div>
        </div>
    `;
    JestMockUtil.mockClear(isPassiveSupported);
  });

  describe('インスタンス化できる', () => {
    test('passiveSupported が true のとき touchEventOptions が passive: true で適切に設定される', () => {
      JestMockUtil.mockReturnValueOnce(isPassiveSupported, true);
      const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
      expect(carousel['touchEventListenerOption']).toEqual({
        passive: true
      });
    });
    test('passiveSupported が false のとき touchEventOptions が適切に設定される', () => {
      JestMockUtil.mockReturnValueOnce(isPassiveSupported, false);
      const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
      expect(carousel['touchEventListenerOption']).toBe(false);
    });
    test("Options 指定のないときはデフォルト値が入る", () => {
      const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
      expect(carousel['options']).toEqual({
        transitionDurationSec: 0.5,
        transitionTimingFunction: 'ease',
        frameClassName: 'ccc-frame',
        itemsClassName: 'ccc-items'
      });
    });
    test("Options 指定のあるときはそれぞれ指定された値が入る", () => {
      document.body.innerHTML = `
        <div class="carousel">
	          <div class="ccc-frame-custom">
            		<div class="ccc-items-custom carousel-items">
			              <img src="https://placehold.jp/150x200.png?text=1" alt="">
			              <img src="https://placehold.jp/150x200.png?text=2" alt="">
			              <img src="https://placehold.jp/150x200.png?text=3" alt="">
		            </div>
	          </div>
        </div>
    `;
      const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {
        transitionDurationSec: 0.1,
        transitionTimingFunction: 'linear',
        frameClassName: 'ccc-frame-custom',
        itemsClassName: 'ccc-items-custom'
      });
      expect(carousel['options']).toEqual({
        transitionDurationSec: 0.1,
        transitionTimingFunction: 'linear',
        frameClassName: 'ccc-frame-custom',
        itemsClassName: 'ccc-items-custom'
      });
    });
    test('その他プロパティが初期化される', () => {
      const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
      expect(carousel['rootElement']).not.toBeFalsy();
      expect(carousel['frameElement']).not.toBeFalsy();
      expect(carousel['itemsElement']).not.toBeFalsy();
    });
  });

  test('initializeGrid で grid が正しく設定される', () => {
    const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
    carousel['itemsElement'] = {
      scrollWidth: 500,
      children: [
        {offsetLeft: 0},
        {offsetLeft: 100},
        {offsetLeft: 200},
        {offsetLeft: 300},
        {offsetLeft: 400}
      ]
    } as any as HTMLElement;
    carousel['frameElement'] = {
      clientWidth: 150
    } as any as HTMLElement;

    carousel['initializeGrid']();
    expect(carousel['grid']).toEqual([
      -350,
      -300,
      -200,
      -100,
      -0
    ]);
  });

  test('getNearestGridX が正しい値を返す', () => {
    const carousel = new Carousel(document.getElementsByClassName('carousel')[0], {});
    carousel['grid'] = [
      -350, -300, -200, -100, 0
    ];
    expect(carousel['getNearestGridX'](-1000)).toBe(-350);
    expect(carousel['getNearestGridX'](-350)).toBe(-350);
    expect(carousel['getNearestGridX'](-340)).toBe(-350);
    expect(carousel['getNearestGridX'](-320)).toBe(-300);
    expect(carousel['getNearestGridX'](-280)).toBe(-300);
    expect(carousel['getNearestGridX'](-210)).toBe(-200);
    expect(carousel['getNearestGridX'](-10)).toBe(0);
    expect(carousel['getNearestGridX'](0)).toBe(0);
    expect(carousel['getNearestGridX'](100)).toBe(0);
  });
});
