import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RandomDogImage from './question1';

describe('RandomDogImage Component', () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	// Helper function to simulate a successful API response
	const mockFetchSuccess = (imageUrl) => {
		global.fetch.mockResolvedValueOnce({
			json: async () => ({
				status: 'success',
				message: imageUrl,
			}),
		});
	};

	it('renders the initial loading state', () => {
		// Delay the fetch resolution so we can catch the loading state
		global.fetch.mockImplementation(() => new Promise(() => {}));
		render(<RandomDogImage />);

		// The heading and loading text should be present while the fetch is pending
		expect(screen.getByText('Random Dog Generator')).toBeInTheDocument();
		expect(screen.getByText('loading...')).toBeInTheDocument();
		
		// The button should be disabled while loading
		const button = screen.getByRole('button', { name: /get another dog/i });
		expect(button).toBeDisabled();
	});

	it('fetches and renders the image on mount', async () => {
		mockFetchSuccess("stubImageUrl");
		render(<RandomDogImage />);

		// Wait for the asynchronous fetch to complete and the image to appear
		await waitFor(() => {
			const image = screen.getByAltText('A random image of a dog');
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute('src', "stubImageUrl");
		});

		// The loading text should be gone and button should be enabled
		expect(screen.queryByText('loading...')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: /get another dog/i })).not.toBeDisabled();
	});

	it('fetches a new image when the button is clicked', async () => {
		// Mock the first fetch (component mount)
		mockFetchSuccess("firstImageUrl");
		render(<RandomDogImage />);

		// Wait for the first image to render
		const image = await screen.findByAltText('A random image of a dog');
		expect(image).toHaveAttribute('src', "firstImageUrl");

		// Mock the second fetch w/ button click
		mockFetchSuccess("secondImageUrl");
		fireEvent.click(screen.getByRole('button', { name: /get another dog/i }));

		// The new image should replace the old one
		await waitFor(() => {
			expect(image).toHaveAttribute('src', "secondImageUrl");
		});
	});

	it('handles API errors gracefully', async () => {
		// Mock a network error or rejected promise
		global.fetch.mockRejectedValueOnce(new Error('Network failure'));
		
		// Spy on console.error to mute test output and verify it was called
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

		render(<RandomDogImage />);

		// Wait for the loading state to disappear (meaning the finally block executed)
		await waitFor(() => {
			expect(screen.queryByText('loading...')).not.toBeInTheDocument();
		});

		// The error should be caught and logged
		expect(consoleSpy).toHaveBeenCalledWith(
			'Failed to fetch the dog image:',
			expect.any(Error)
		);

		// The button should re-enable
		expect(screen.getByRole('button', { name: /get another dog/i })).not.toBeDisabled();
	});
});