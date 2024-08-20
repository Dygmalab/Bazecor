type ModifierElement = {
  modifier: string;
  type: string;
  keynum: number;
};

const findModifierType = (keynum?: number, type?: string, modifier?: string): ModifierElement | undefined => {
  const OneShotDeltaMod = 49153;
  const modifiers = [
    { keynum: 49425, type: "dualModifier", modifier: "shift" },
    { keynum: 49169, type: "dualModifier", modifier: "control" },
    { keynum: 49937, type: "dualModifier", modifier: "os" },
    { keynum: 49681, type: "dualModifier", modifier: "alt" },
    { keynum: 50705, type: "dualModifier", modifier: "altGr" },
    { keynum: OneShotDeltaMod + 1, type: "oneShotModifier", modifier: "shift" },
    { keynum: OneShotDeltaMod + 0, type: "oneShotModifier", modifier: "control" },
    { keynum: OneShotDeltaMod + 3, type: "oneShotModifier", modifier: "os" },
    { keynum: OneShotDeltaMod + 2, type: "oneShotModifier", modifier: "alt" },
    { keynum: OneShotDeltaMod + 5, type: "oneShotModifier", modifier: "rshift" },
    { keynum: OneShotDeltaMod + 4, type: "oneShotModifier", modifier: "rcontrol" },
    { keynum: OneShotDeltaMod + 7, type: "oneShotModifier", modifier: "ros" },
    { keynum: OneShotDeltaMod + 6, type: "oneShotModifier", modifier: "altGr" },
  ];

  if (keynum !== undefined) {
    return modifiers.find(item => item.keynum === keynum);
  }

  if (type !== undefined && modifier !== undefined) {
    return modifiers.find(item => item.type === type && item.modifier === modifier);
  }

  return undefined; // return undefined if neither keynum nor type/layer combo is provided
};

export default findModifierType;
