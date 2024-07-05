import { LayerMap } from "@Types/LayerMap";

const defyLayerMap: LayerMap = {
  keys: {
    position: {
      left: [
        {
          from: 0,
          to: 7,
        },
        {
          from: 16,
          to: 23,
        },
        {
          from: 32,
          to: 39,
        },
        {
          from: 48,
          to: 54,
        },
        {
          from: 64,
          to: 72,
        },
      ],
      right: [
        {
          from: 9,
          to: 16,
        },
        {
          from: 25,
          to: 32,
        },
        {
          from: 41,
          to: 48,
        },
        {
          from: 57,
          to: 64,
        },
        {
          from: 72,
          to: 80,
        },
      ],
    },
    leds: {
      left: {
        from: 0,
        to: 35,
      },
      right: {
        from: 35,
        to: 70,
      },
    },
  },
  underglow: {
    left: {
      from: 70,
      to: 123,
    },
    right: {
      from: 123,
      to: 176,
    },
  },
};

const raiseLayerMap: LayerMap = {
  keys: {
    position: {
      left: [
        {
          from: 0,
          to: 7,
        },
        {
          from: 16,
          to: 23,
        },
        {
          from: 32,
          to: 39,
        },
        {
          from: 48,
          to: 55,
        },
        {
          from: 64,
          to: 72,
        },
      ],
      right: [
        {
          from: 9,
          to: 16,
        },
        {
          from: 24,
          to: 32,
        },
        {
          from: 41,
          to: 48,
        },
        {
          from: 57,
          to: 64,
        },
        {
          from: 72,
          to: 80,
        },
      ],
    },
    leds: {
      left: {
        from: 0,
        to: 33,
      },
      right: {
        from: 33,
        to: 69,
      },
    },
  },
  underglow: {
    left: {
      from: 69,
      to: 99,
    },
    right: {
      from: 99,
      to: 131,
    },
  },
};

const raise2LayerMap: LayerMap = {
  keys: {
    position: {
      left: [
        {
          from: 0,
          to: 7,
        },
        {
          from: 16,
          to: 23,
        },
        {
          from: 32,
          to: 39,
        },
        {
          from: 48,
          to: 55,
        },
        {
          from: 64,
          to: 72,
        },
      ],
      right: [
        {
          from: 9,
          to: 16,
        },
        {
          from: 24,
          to: 32,
        },
        {
          from: 41,
          to: 48,
        },
        {
          from: 57,
          to: 64,
        },
        {
          from: 72,
          to: 80,
        },
      ],
    },
    leds: {
      left: {
        from: 0,
        to: 33,
      },
      right: {
        from: 33,
        to: 69,
      },
    },
  },
  underglow: {
    left: {
      from: 69,
      to: 105,
    },
    right: {
      from: 105,
      to: 144,
    },
  },
};

function getLayerMap(layer: string): LayerMap {
  switch (layer) {
    case "defy":
      return defyLayerMap;
    case "raise":
      return raiseLayerMap;
    case "raise2":
      return raise2LayerMap;
    default:
      return defyLayerMap;
  }
}

export default getLayerMap;
