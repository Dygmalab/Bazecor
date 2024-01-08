export interface Neurons {
  neurons: [
    {
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
    },
  ];
  selectedNeuron: number;
}
