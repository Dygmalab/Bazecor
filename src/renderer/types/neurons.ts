export interface Neuron {
  id: string;
  name: string;
  layers: [
    {
      id: number;
      name: string;
    },
  ];
  macros: [
    {
      actions: unknown;
      id: number;
      name: string;
      macro: string;
    },
  ];
  superkeys: [
    {
      actions: unknown;
      name: string;
      id: number;
    },
  ];
}

export interface Neurons {
  neurons: Neuron[];
  selectedNeuron: number;
}
