import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages";

const unMinifiedHtml = "  <div> hello  </div>  ";
const minifiedHTML = "<div>hello</div>";

// Mocks the fetch API
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ minifiedHTML }),
  })
);

// Mocks the navigator.clipboard.writeText API
Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe("Testing main functionality", () => {
  it("should render the component", () => {
    const { container } = render(<Home />);
    expect(container).toBeInTheDocument();
  });

  it("should render the textarea", () => {
    const { getByTestId } = render(<Home />);
    expect(getByTestId("html-textarea")).toBeInTheDocument();
  });

  it("can paste HTML into the textarea", () => {
    const { getByTestId } = render(<Home />);
    const textarea = getByTestId("html-textarea");
    fireEvent.change(textarea, {
      target: { value: unMinifiedHtml },
    });
  });

  it("should render paste HTML here text", () => {
    const { getByText } = render(<Home />);
    expect(getByText(/Paste HTML here/i)).toBeInTheDocument();
  });

  it("should render hidden now click here text", () => {
    const { getByText } = render(<Home />);

    const textElement = getByText(/Now click here/i);

    expect(textElement).toBeInTheDocument();
    expect(textElement).not.toBeVisible();
  });

  it("should render visible now click here text after paste", () => {
    const { getByText, getByTestId } = render(<Home />);

    const textarea = getByTestId("html-textarea");

    fireEvent.paste(textarea, {
      target: { value: unMinifiedHtml },
    });

    const textElement = getByText(/Now click here/i);

    expect(textElement).toBeInTheDocument();
    expect(textElement).toBeVisible();
  });

  it("should render the minify and copy button", () => {
    const { getByText } = render(<Home />);
    expect(getByText(/Minify and Copy/i)).toBeInTheDocument();
  });

  it("should render the minified HTML when the button is clicked (paste event)", async () => {
    const { getByText, getByTestId } = render(<Home />);

    const textarea = getByTestId("html-textarea") as HTMLTextAreaElement;

    fireEvent.paste(textarea, {
      target: { value: unMinifiedHtml },
    });

    const button = getByText(/Minify and Copy/i);

    fireEvent.click(button);

    await waitFor(() =>
      expect(textarea.value.length).toBeLessThan(unMinifiedHtml.length)
    );
  });

  it("should render the minified HTML when the button is clicked (change event)", async () => {
    const { getByText, getByTestId } = render(<Home />);

    const textarea = getByTestId("html-textarea") as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: { value: unMinifiedHtml },
    });

    const button = getByText(/Minify and Copy/i);

    fireEvent.click(button);

    await waitFor(() =>
      expect(textarea.value.length).toBeLessThan(unMinifiedHtml.length)
    );
  });

  it("should have error (not visible by default)", () => {
    const { getByText } = render(<Home />);

    const errorElement = getByText(/Paste your HTML first/i);

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).not.toBeVisible();
  });

  it("should have error (visible after click without pasting/changing)", async () => {
    const { getByText } = render(<Home />);

    const button = getByText(/Minify and Copy/i);

    fireEvent.click(button);

    const errorElement = getByText(/Paste your HTML first/i);

    await waitFor(() => expect(errorElement).toBeVisible());
  });

  it("should have success text (not visible by default)", () => {
    const { getByText } = render(<Home />);

    const successElement = getByText(
      /Minified HTML is copied to your clipboard/i
    );

    expect(successElement).toBeInTheDocument();
    expect(successElement).not.toBeVisible();
  });

  it("should have success text (visible after click with pasting/changing)", async () => {
    const { getByText, getByTestId } = render(<Home />);

    const textarea = getByTestId("html-textarea") as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: { value: unMinifiedHtml },
    });

    const button = getByText(/Minify and Copy/i);

    fireEvent.click(button);

    const successElement = getByText(
      /Minified HTML is copied to your clipboard/i
    );

    waitFor(() => expect(successElement).toBeVisible());
  });
});
