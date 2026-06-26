import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MiyaDogApp from "./MiyaDogApp";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("loads and shows a dog image from API", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      message: "https://example.com/dog.jpg",
      status: "success",
    }),
  });

  render(<MiyaDogApp />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  const image = await screen.findByAltText(/random dog/i);

  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute("src", "https://example.com/dog.jpg");
  expect(fetch).toHaveBeenCalledWith("https://dog.ceo/api/breeds/image/random");
});

test("gets another dog image when button is clicked", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "https://example.com/dog1.jpg",
        status: "success",
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "https://example.com/dog2.jpg",
        status: "success",
      }),
    });

  render(<MiyaDogApp />);

  const firstImage = await screen.findByAltText(/random dog/i);
  expect(firstImage).toHaveAttribute("src", "https://example.com/dog1.jpg");

  fireEvent.click(screen.getByRole("button", { name: /get another dog/i }));

  await waitFor(() => {
    expect(screen.getByAltText(/random dog/i)).toHaveAttribute(
      "src",
      "https://example.com/dog2.jpg",
    );
  });

  expect(fetch).toHaveBeenCalledTimes(2);
});

test("shows error message when API request fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  });

  render(<MiyaDogApp />);

  const errorMessage = await screen.findByText(
    /sorry, i could not load the dog image/i,
  );

  expect(errorMessage).toBeInTheDocument();
});

test("does not show image before API returns successfully", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      message: "https://example.com/dog.jpg",
      status: "success",
    }),
  });

  render(<MiyaDogApp />);

  expect(screen.queryByAltText(/random dog/i)).not.toBeInTheDocument();

  const image = await screen.findByAltText(/random dog/i);
  expect(image).toBeInTheDocument();
});
