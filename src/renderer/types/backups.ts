import { Neuron } from "./neurons";

export interface BackupType {
  neuronID: string;
  neuron: Neuron;
  versions: {
    bazecor: string;
    kaleidoscope: string;
    firmware: string;
  };
  backup: {
    command: string;
    data: string;
  }[];
}
