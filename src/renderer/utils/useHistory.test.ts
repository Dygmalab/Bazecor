/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useHistory from "./useHistory";

describe("useHistory", () => {
  it("should initialize with the provided state", () => {
    const { result } = renderHook(() => useHistory({ value: 1 }));

    expect(result.current.state).toEqual({ value: 1 });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should update state and track history", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(1);
    });

    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should undo to previous state", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it("should redo to next state", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("should clear future on new state change", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.setState(3);
    });

    expect(result.current.state).toBe(3);
    expect(result.current.canRedo).toBe(false);
  });

  it("should not add to history if state is identical", () => {
    const { result } = renderHook(() => useHistory(1));

    act(() => {
      result.current.setState(1);
    });

    expect(result.current.canUndo).toBe(false);
  });

  it("should reset history with new present value", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });

    act(() => {
      result.current.reset(10);
    });

    expect(result.current.state).toBe(10);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("should limit history to 50 entries", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      for (let i = 1; i <= 60; i += 1) {
        result.current.setState(i);
      }
    });

    expect(result.current.state).toBe(60);

    let undoCount = 0;
    while (result.current.canUndo) {
      act(() => {
        result.current.undo();
      });
      undoCount += 1;
    }

    expect(undoCount).toBe(50);
    expect(result.current.state).toBe(10);
  });

  it("should support functional updates", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.setState(prev => prev + 1);
      result.current.setState(prev => prev + 1);
    });

    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
  });

  it("should not undo past beginning", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
  });

  it("should not redo past end", () => {
    const { result } = renderHook(() => useHistory(0));

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe(0);
    expect(result.current.canRedo).toBe(false);
  });

  it("should work with complex objects", () => {
    const initial = { keymap: [[1, 2]], colors: ["red"] };
    const { result } = renderHook(() => useHistory(initial));

    const updated = { keymap: [[3, 4]], colors: ["blue"] };
    act(() => {
      result.current.setState(updated);
    });

    expect(result.current.state).toEqual(updated);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toEqual(initial);
  });
});
