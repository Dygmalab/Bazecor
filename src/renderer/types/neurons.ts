export interface LayerType {
  id: number;
  name: string;
}

export interface macrosType {
  actions: unknown;
  id: number;
  name: string;
  macro: string;
}

export interface superkeysType {
  actions: unknown;
  name: string;
  id: number;
}

export interface Neuron {
  id: string;
  name: string;
  layers: Array<LayerType>;
  macros: Array<macrosType>;
  superkeys: Array<superkeysType>;
}

export interface Neurons {
  neurons: Neuron[];
  selectedNeuron: number;
}
