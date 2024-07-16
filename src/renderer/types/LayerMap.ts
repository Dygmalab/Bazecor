type Period = {
  from: number;
  to: number;
};

export type LayerMap = {
  keys: {
    position: {
      right: Period[];
      left: Period[];
    };
    leds: {
      right: Period;
      left: Period;
    };
  };
  underglow: {
    right: Period;
    left: Period;
  };
};
