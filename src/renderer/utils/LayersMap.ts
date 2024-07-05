import { LayerMap } from "@Types/LayerMap";

const defyLayerMap: LayerMap = {
  keys: {
    position: {
      left: [
        {
          from: 0,
          to: 6,
        },
        {
          from: 16,
          to: 22,
        },
        {
          from: 32,
          to: 38,
        },
        {
          from: 48,
          to: 53,
        },
        {
          from: 64,
          to: 71,
        },
      ],
      right: [
        {
          from: 9,
          to: 15,
        },
        {
          from: 25,
          to: 31,
        },
        {
          from: 41,
          to: 47,
        },
        {
          from: 57,
          to: 63,
        },
        {
          from: 72,
          to: 79,
        },
      ],
    },
    leds: {
      left: {
        from: 0,
        to: 34,
      },
      right: {
        from: 35,
        to: 69,
      },
    },
  },
  underglow: {
    left: {
      from: 70,
      to: 122,
    },
    right: {
      from: 123,
      to: 175,
    },
  },
};

const raiseLayerMap: LayerMap = {
  keys: {
    position: {
      left: [],
      right: [],
    },
    leds: {
      left: {
        from: 0,
        to: 0,
      },
      right: {
        from: 0,
        to: 0,
      },
    },
  },
  underglow: {
    left: {
      from: 0,
      to: 0,
    },
    right: {
      from: 0,
      to: 0,
    },
  },
};

const raise2LayerMap: LayerMap = {
  keys: {
    position: {
      left: [],
      right: [],
    },
    leds: {
      left: {
        from: 0,
        to: 0,
      },
      right: {
        from: 0,
        to: 0,
      },
    },
  },
  underglow: {
    left: {
      from: 0,
      to: 0,
    },
    right: {
      from: 0,
      to: 0,
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
