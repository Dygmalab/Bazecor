import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { beforeEach, expect, test, vi } from "vitest";
import FirmwareImageHelp from "./FirmwareImageHelp";
import Dark from "../../theme/DarkTheme";

const steps = Array.from({ length: 8 }, (_, i) => i);

const view = (deviceProduct: string, countdown: number) => (
  <ThemeProvider theme={Dark}>
    <FirmwareImageHelp
      countdown={countdown}
      deviceProduct={deviceProduct}
      keyboardType="wireless"
      steps={steps}
      error={false}
      retriesLeft={1}
      retriesRight={1}
      retriesDefyWired={1}
      retriesNeuron={1}
    />
  </ThemeProvider>
);

beforeEach(() => {
  // jsdom does not play media.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockReturnValue();
});

test("the Defy keeps its one video through the whole update", () => {
  const { container, rerender } = render(view("Defy", 0));
  const src = container.querySelector("video source").getAttribute("src");
  steps.forEach(countdown => {
    rerender(view("Defy", countdown));
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(videos[0].querySelector("source").getAttribute("src")).toBe(src);
    expect(videos[0].classList.contains("animOut")).toBe(false);
  });
});

test.each(["Raise", "Raise2", "Sonsei"])("the %s still swaps to its second video when ESC is detected", product => {
  const { container, rerender } = render(view(product, 0));
  rerender(view(product, 1));
  const [intro, release] = container.querySelectorAll("video");
  expect(intro.classList.contains("animOut")).toBe(true);
  expect(release.classList.contains(product === "Raise" ? "animPressDown" : "animIn")).toBe(true);
});
