export interface EventKeyMap {
  slideEnd: SlideEvent
}

export interface SlideEvent {
  currentIndex: number;
  total: number;
}
