import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("is disabled and shows spinner when isLoading", () => {
    render(<Button isLoading>Saving</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Saving");
  });

  it("does not call onClick while loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders leftIcon when not loading", () => {
    render(<Button leftIcon={<span data-testid="icon">I</span>}>With Icon</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("hides leftIcon and shows spinner when loading", () => {
    render(
      <Button isLoading leftIcon={<span data-testid="icon">I</span>}>
        Load
      </Button>,
    );
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("renders rightIcon when not loading", () => {
    render(<Button rightIcon={<span data-testid="arrow">→</span>}>Next</Button>);
    expect(screen.getByTestId("arrow")).toBeInTheDocument();
  });

  it("hides rightIcon when loading", () => {
    render(
      <Button isLoading rightIcon={<span data-testid="arrow">→</span>}>
        Next
      </Button>,
    );
    expect(screen.queryByTestId("arrow")).not.toBeInTheDocument();
  });

  it("passes html button attributes", () => {
    render(<Button type="submit" aria-label="Custom label">Go</Button>);
    const button = screen.getByRole("button", { name: "Custom label" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
