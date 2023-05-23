import React, { Component } from "react";
import { createMachine, assign } from "xstate";
import PropTypes from "prop-types";

class newFirmwareUpdate extends Component {
  constructor(props) {
    super(props);
  }
  fetchMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6WMVMcgFx1LwGIBVQgEQEEAKgFEA2gAYAuolAAHUrhZtpIAB6IAjADYA7NQAsmgBzbNAJnWm9hgMxjTAGhABPRHoCs66gE4TbzXr0xN20DPQBfMMc0LFwCEgoqahliMBl0YnRFDh4hADUASQBhIQB5AGlxKSQQOQVWPGU1BD1TQ2oLNzExH1NTLy9NdUcXZrcval7NQes3QOMdCKiMbHwiMkpYGmTU9Mz69kKACSFCisllWpwsxsRba2odHzt1PWsvUxNh1zE9CdMpqYefwfNyLEDRFZxdaJADu6CuQlg5HYhAASkIAMoYoQ8SoXeRXeo3BDacwTQwWaxad6aPxeL7NKb6XxTMRGTTvcKRcHLWJrBKbahwhFI9gAORKAjRmOxuPO1Uu12qTT89xebK0fVMQKGzlc6k8ehMgy8Pxar1MYIhfPiGxoADMMLBMKicFBMEwMTgIGB2BjOIVili8QqCUrQE11GIDdRDK02dqnjZrAzrO5qKTaWmxqYxNovFbeatbYlHehna73Z7vb70QJUQBNEOyMNE5UaaOeOOGBNjbRiZMMo2mWNeayWccgzQzQsxYvQwVl50AGTA9urPr9AaDGObNVbSnbCAsA1jH366ipJlJbgZvV+Plp-ZCQUMbhss8h-Lt1CXmFX65epudaNnuipthGGh9JoZ75l4l7qNe2qpm4I4vOOBraJ0XidOon42guDpOpgYpgAArmQHD+oGMpgQeDRHuowS-N0ab9Nohj+G8t56sePajuO1jjnoXiGMYqH4fOApEeWJHkZR7AgU28otnUh6QcezHUKxIk+Jxrw4XeVLUG8glxtYxjam41iSVC0m-vCqAUbWQj1spVSqYS6mqBofbaQY75mG8OGtAyFLUJ0XRskFomPBE3J4KQPrwNU1pSXa+JqQxGkALSaAyOVuN4-QlaVJX+KC3JpXZP50AwzAQfuWXEi0Q4BCZY59BxrKaGINlVUWNWJNsaQZOGTVedlPkIK04wDMYxpzIMiFDmMGb-NMswDtetnfrC8JMIi5CZZNxLviO2hRu8pW2DoQ5Mo+fi9ey7zWJou0louxGVh6QFgCd41NG+I7-G4755oErSGHo90wY9PWca970DXOQ1fbJAEbv9obNYxLwwQYnFUtxVgGKmBh-Fm7jvHmBYo1+n0yc6pEUd54HeZGryGkYfidr12gWXe2rMk+EOvu+-VLKje2CrAZHkBlOOnYxl1tALgQ89D0MDgy6j8eh-zRmJLx9h9hEOTgTkpADjWRqrGZpmyb5a3MKFiBMnVBO4fgfAY8VhEAA */
    id: "FlahsingProcess",
    initial: "selection",
    context: {
      retriesRight: 0,
      retriesLeft: 0,
      retriesNeuron: 0,
      version: {},
      firmwareList: []
    },
    states: {
      selection: {
        on: {
          UPDATE: "preparation"
        }
      },
      preparation: {
        on: {
          DEVICEOK: "waitEsc",
          CHECK: "preparation"
        }
      },
      waitEsc: {
        on: {
          PRESSED: "flashRightSide"
        }
      },
      flashRightSide: {
        on: {
          SUCCESS: "flashLeftSide",
          RETRY: "failure"
        }
      },
      flashLeftSide: {
        on: {
          SUCCESS: "flashNeuron",
          RETRY: "failure"
        }
      },
      flashNeuron: {
        on: {
          SUCCESS: "success",
          RETRY: "failure"
        }
      },
      success: {
        type: "final"
      },
      failure: {
        on: {
          RETRY: {
            target: "selection",
            actions: assign({
              retriesRight: (context, event) => context.retriesRight + 1
            })
          }
        }
      }
    }
  });

  componentDidMount() {}

  shouldComponentUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return <div></div>;
  }
}

newFirmwareUpdate.propTypes = {};

export default newFirmwareUpdate;
