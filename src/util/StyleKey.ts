export default class StyleKey {
  private transitionKeys = [
    'transition',
    'webkitTransition'
  ];
  readonly transition: string;
  private transformKeys = [
    'transform',
    'webkitTransform'
  ];
  readonly transform: string;

  constructor() {
    const dummyElement = document.createElement('_');
    this.transition = this.transitionKeys.filter(key => typeof dummyElement.style[key] !== 'undefined')[0];
    this.transform = this.transformKeys.filter(key => typeof dummyElement.style[key] !== 'undefined')[0];
  }
}
