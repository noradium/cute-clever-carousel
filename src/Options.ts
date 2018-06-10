export interface Options {
  /**
   * scroll animation duration[sec]
   */
  transitionDurationSec?: number;
  /**
   * scroll animation timing function
   */
  transitionTimingFunction?: string;
  /**
   * class name of frame element
   */
  frameClassName?: string;
  /**
   * class name of items element
   */
  itemsClassName?: string;
}

export const defaultOptions: Options = {
  transitionDurationSec: 0.5,
  transitionTimingFunction: 'ease',
  frameClassName: 'ccc-frame',
  itemsClassName: 'ccc-items'
};
