export type LayerMap = {
  keys: {
    position: {
      right: [
        {
          from: number;
          to: number;
        },
      ];
      left: [
        {
          from: number;
          to: number;
        },
      ];
    };
    leds: {
      right: {
        from: number;
        to: number;
      };
      left: {
        from: number;
        to: number;
      };
    };
  };
  underglow: {
    right: {
      from: number;
      to: number;
    };
    left: {
      from: number;
      to: number;
    };
  };
};
