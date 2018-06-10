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
    this.transition = this.transitionKeys.find(key => typeof dummyElement.style[key] !== 'undefined');
    this.transform = this.transformKeys.find(key => typeof dummyElement.style[key] !== 'undefined');
  }
}
