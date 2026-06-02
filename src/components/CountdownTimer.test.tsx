import { CountdownTimer } from "@/components/CountdownTimer";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("zobrazí správný počáteční čas", () => {
    render(<CountdownTimer duration={20} />);

    expect(screen.getByRole("timer")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("odpočítává sekundy", async () => {
    render(<CountdownTimer duration={10} />);
    expect(screen.getByText("10")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("zavolá onExpire callback po vypršení", () => {
    const onExpire = vi.fn();
    render(<CountdownTimer duration={5} onExpire={onExpire} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("zobrazí 0 po vypršení", () => {
    render(<CountdownTimer duration={3} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("onExpire se nevolá pokud čas nevyprší", () => {
    const onExpire = vi.fn();
    render(<CountdownTimer duration={10} onExpire={onExpire} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExpire).not.toHaveBeenCalled();
  });
});
