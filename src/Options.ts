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
  /**
   * coefficient of scroll amount
   */
  scrollDeltaCoefficient?: number;
  /**
   * enable inertia when touchend
   */
  inertia?: boolean;
  /**
   * acceleration of scroll when inertia is enabled [px/ms^2]
   * this should be positive value
   */
  inertiaAcceleration?: number;
  /**
   * interval of inertia movement (2nd argument passed into setInterval)
   */
  inertiaIntervalMS?: number;
}

export const defaultOptions: Options = {
  transitionDurationSec: 0.5,
  transitionTimingFunction: 'ease',
  frameClassName: 'ccc-frame',
  itemsClassName: 'ccc-items',
  scrollDeltaCoefficient: 1,
  inertia: true,
  inertiaAcceleration: 0.005,
  inertiaIntervalMS: 16
};
