type LayerElement = {
  layer: number;
  type: string;
  name: string;
  keynum: number;
};

const findLayerType = (keynum?: number, type?: string, layer?: number): LayerElement | undefined => {
  const layers = [
    { layer: 1, type: "layerLock", name: "Layer Lock 1", keynum: 17492 },
    { layer: 2, type: "layerLock", name: "Layer Lock 2", keynum: 17493 },
    { layer: 3, type: "layerLock", name: "Layer Lock 3", keynum: 17494 },
    { layer: 4, type: "layerLock", name: "Layer Lock 4", keynum: 17495 },
    { layer: 5, type: "layerLock", name: "Layer Lock 5", keynum: 17496 },
    { layer: 6, type: "layerLock", name: "Layer Lock 6", keynum: 17497 },
    { layer: 7, type: "layerLock", name: "Layer Lock 7", keynum: 17498 },
    { layer: 8, type: "layerLock", name: "Layer Lock 8", keynum: 17499 },
    { layer: 9, type: "layerLock", name: "Layer Lock 9", keynum: 17500 },
    { layer: 10, type: "layerLock", name: "Layer Lock 10", keynum: 17501 },
    { layer: 1, type: "layerShift", name: "Layer Shift 1", keynum: 17450 },
    { layer: 2, type: "layerShift", name: "Layer Shift 2", keynum: 17451 },
    { layer: 3, type: "layerShift", name: "Layer Shift 3", keynum: 17452 },
    { layer: 4, type: "layerShift", name: "Layer Shift 4", keynum: 17453 },
    { layer: 5, type: "layerShift", name: "Layer Shift 5", keynum: 17454 },
    { layer: 6, type: "layerShift", name: "Layer Shift 6", keynum: 17455 },
    { layer: 7, type: "layerShift", name: "Layer Shift 7", keynum: 17456 },
    { layer: 8, type: "layerShift", name: "Layer Shift 8", keynum: 17457 },
    { layer: 9, type: "layerShift", name: "Layer Shift 9", keynum: 17458 },
    { layer: 10, type: "layerShift", name: "Layer Shift 10", keynum: 17459 },
    { layer: 1, type: "layerShot", name: "One shot 1", keynum: 49161 },
    { layer: 2, type: "layerShot", name: "One shot 2", keynum: 49162 },
    { layer: 3, type: "layerShot", name: "One shot 3", keynum: 49163 },
    { layer: 4, type: "layerShot", name: "One shot 4", keynum: 49164 },
    { layer: 5, type: "layerShot", name: "One shot 5", keynum: 49165 },
    { layer: 6, type: "layerShot", name: "One shot 6", keynum: 49166 },
    { layer: 7, type: "layerShot", name: "One shot 7", keynum: 49167 },
    { layer: 8, type: "layerShot", name: "One shot 8", keynum: 49168 },
    { layer: 1, type: "layerDual", name: "Dual layer 1", keynum: 51218 },
    { layer: 2, type: "layerDual", name: "Dual layer 2", keynum: 51474 },
    { layer: 3, type: "layerDual", name: "Dual layer 3", keynum: 51730 },
    { layer: 4, type: "layerDual", name: "Dual layer 4", keynum: 51986 },
    { layer: 5, type: "layerDual", name: "Dual layer 5", keynum: 52242 },
    { layer: 6, type: "layerDual", name: "Dual layer 6", keynum: 52498 },
    { layer: 7, type: "layerDual", name: "Dual layer 7", keynum: 52754 },
    { layer: 8, type: "layerDual", name: "Dual layer 8", keynum: 53010 },
  ];

  if (keynum !== undefined) {
    return layers.find(layerObj => layerObj.keynum === keynum);
  }

  if (type !== undefined && layer !== undefined) {
    return layers.find(layerObj => layerObj.type === type && layerObj.layer === layer);
  }

  return undefined; // return undefined if neither keynum nor type/layer combo is provided
};

export default findLayerType;
