import { createMachine, assign, raise } from "xstate";
import Focus from "../../../api/focus";

const DeviceChecks = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6Ad3RwBcBRWcgYmYGUBhQgJW5dmAEQDaABgC6iUAAdSuRjlJ5ZIAB6IATAA4ArNQkB2bQE4zxgIzbz+gCxWANCACeiAGz7t1KxI8AzB4S+pYeZtoeAL5RLmhYuAQkFFTUAGYYsJj8OFCYjFw4EGDsXACqPDxCkjJIIApKKmp1Wgh6hibmljZ2ji7ubdoB1NrGuh66Elb6umb60-YxcRjY+ERklLA0GehZOXkFRSXM-PwA8vw16g1MTeqt7UamFta2c31uiPa6PgG6s5FdAF7KZvEsQPFVkkNqkdlkADJgNKHYqlCpVLhcK51G7KVT3TzmaihKxWMz+AzGay6fo6CT2ajGen2YKkrx+YzgyGJdYpLbpTKYRHIwqok7nS7Sa6KW74lqEszEsyk8kTfRUqw0z4IIJWaheazeMwg-QBKzRWIQlY85KbbaCgByYAArmQ8GjKtUpTiZXjmqBWhFhlYAgEJCEzcZvKTaQgyRJqCzNWb2nNSdouda1rbYY6XW7OKcLtj5L67vKEEHfKHw6arFHtDHtdp7AmIqbjKqJKHO-pMwlszD+cQ4IxSCP4ehXGBiLAPRisd7S405QHEDZzfrjN8ycaIkz7LHtCFiQEqQYph5zzZ+1DeXbqCPYGOJ1OZ3PxcWl-Uy6vNOuJCBEZ6y8cIAkbMxgVjXQ9RBZUvDCb59AkMxbxtIdtgYVBXRKQQABV+AATRLH8V39f82gMJ4uleXpnG1H4Ex+M9jSCfwLUtPBSGKeA6m5Qc+V45dZXI1oAFoPFjCS0IEh96CYVhyGlMiCQQextFjdVjGrPw5g8IZZgCPtLX46FBIFXZMEIdBGEwLgwFQMByBfZSRNU+wWSMIZ7G8cDjxBDxJO1YJg2PJlOjJTVUJMrMzIfOFslyfJRTAVy-VUmxDAcetAPDVsPG+Q9mxPcZjxDMwPBsQJzRkuLc0s4UUVSn0VIrFkEzGbt7DMAx7GBbtY01bS9CpSDlX+CCAlq+96qyJ1XT-XFyzXBBjAKkZw0q8DvCGGZBpgxlAOBKMbAkbQHGM5YBzq-kZzIYg0uWii-HVRl1PUsYgR6-RY1DXR9Uq+kurDFkLSuu8c2HUdxzASdp1nR6-1aF7tO3FtRn+AJvv2nxsvCDUrG6qZpshzCcGwkdEdE9cqK8f4r2CD61WgxtqDNExgX0U1AhMEmMOoWBnXIO0qYyoy9T0d7zumYxgSKgZ-MZGC9CGaYwyMxYYiiIA */
    predictableActionArguments: true,
    id: "FlahsingProcess",
    initial: "waitEsc",
    context: {
      stateblock: 0,
      firwmares: []
    },
    states: {
      waitEsc: {
        id: "waitEsc",
        on: {
          //Esc key listener will send this event
          ESCPRESSED: "flashPathSelector"
        },
        entry: [
          (context, event) => {
            // This will error at .flag
            console.log("Wait for esc!");
            //enable listener for esc key
            //if per conditions it does not have to be enabled, skip it.
          },
          assign({ stateblock: (context, event) => context.stateblock + 1 }),
          "addEscListener"
        ],
        exit: [
          (context, event) => {
            //disable listener for esc key
          },
          "removeEscListener"
        ]
      },
      flashPathSelector: {
        id: "flashPathSelector",
        entry: [
          (context, event) => {
            console.log("Selecting upgrade path");
          },
          assign({
            retriesRight: (context, event) => context.retriesRight + 1
          }),
          raise("flashingPath")
        ],
        on: [
          { event: "*", target: "flashNeuron", cond: "doNotFlashSides" },
          { event: "*", target: "flashRightSide", cond: "flashSides" }
        ]
      },
      flashRightSide: {
        id: "flashRightSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Right Side! for ${context.retriesRight} times`);
          },
          assign({
            retriesRight: (context, event) => context.retriesRight + 1
          })
        ],
        on: {
          SUCCESS: "flashLeftSide",
          ERROR: "error"
        }
      },
      flashLeftSide: {
        id: "flashLeftSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Left Side! for ${context.retriesLeft} times`);
          },
          assign({
            retriesLeft: (context, event) => context.retriesLeft + 1
          })
        ],
        on: {
          SUCCESS: "flashNeuron",
          ERROR: "error"
        }
      },
      flashNeuron: {
        id: "flashNeuron",
        entry: [
          (context, event) => {
            console.log("NOW FLASHING NEURON!!!!");
          }
        ],
        on: {
          SUCCESS: "#FlahsingProcess.restoreLayers",
          ERROR: "error"
        }
      },
      error: {
        id: "error",
        entry: [
          (context, event) => {
            console.log("Error has occurred", event);
          }
        ]
      },
      restoreLayers: {
        id: "restoreLayers",
        entry: [
          (context, event) => {
            console.log("Restoring layers");
          }
        ],
        on: {
          SUCCESS: "success",
          ERROR: {
            actions: (context, event) => console.log("error when restoring layers")
          }
        }
      },
      failure: {
        on: {
          RETRY: "#FlahsingProcess"
        }
      },
      success: {
        type: "final"
      }
    }
  },
  {
    guards: {
      flashSides: (context, event) => {
        return !context.device.bootloader && context.device.info.product !== "Raise";
      },
      doNotFlashSides: (context, event) => {
        return context.device.bootloader || context.device.info.product === "Raise";
      }
    }
  }
);

export default DeviceChecks;
