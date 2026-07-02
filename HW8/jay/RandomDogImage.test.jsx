import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RandomDogImage from './RandomDogImage.jsx'

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random'

const okResponse = (url) => ({
  ok: true,
  json: async () => ({ status: 'success', message: url }),
})

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('RandomDogImage', () => {
  test('renders the heading', async () => {
    global.fetch.mockResolvedValue(okResponse('https://images/dog1.jpg'))
    render(<RandomDogImage />)
    expect(screen.getByText('🐶 Random Dog')).toBeInTheDocument()
    await screen.findByAltText('A random dog')
  })

  test('fetches and displays a dog on mount', async () => {
    global.fetch.mockResolvedValue(okResponse('https://images/dog1.jpg'))
    render(<RandomDogImage />)

    const img = await screen.findByAltText('A random dog')

    expect(img).toHaveAttribute('src', 'https://images/dog1.jpg')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(DOG_API_URL)
  })

  test('shows a loading state while the request is in flight', async () => {
    let resolveFetch
    global.fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      }),
    )
    render(<RandomDogImage />)

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Fetching…')

    await act(async () => {
      resolveFetch(okResponse('https://images/dog1.jpg'))
    })
    await screen.findByAltText('A random dog')
  })

  test('shows an error when the response is not ok', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 })
    render(<RandomDogImage />)

    expect(
      await screen.findByText(/Request failed with status 500/),
    ).toBeInTheDocument()
    expect(screen.queryByAltText('A random dog')).not.toBeInTheDocument()
  })

  test('shows an error when the payload is invalid', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'error', message: null }),
    })
    render(<RandomDogImage />)

    expect(
      await screen.findByText(/API did not return a valid dog image/),
    ).toBeInTheDocument()
  })

  test('shows an error when fetch rejects', async () => {
    global.fetch.mockRejectedValue(new Error('Network down'))
    render(<RandomDogImage />)

    expect(await screen.findByText(/Network down/)).toBeInTheDocument()
  })

  test('shows a fallback error when the rejection has no message', async () => {
    global.fetch.mockRejectedValue({})
    render(<RandomDogImage />)

    expect(
      await screen.findByText(/Something went wrong fetching the dog/),
    ).toBeInTheDocument()
  })

  test('fetches a new dog when the button is clicked', async () => {
    const user = userEvent.setup()
    global.fetch
      .mockResolvedValueOnce(okResponse('https://images/dog1.jpg'))
      .mockResolvedValueOnce(okResponse('https://images/dog2.jpg'))
    render(<RandomDogImage />)

    const first = await screen.findByAltText('A random dog')
    expect(first).toHaveAttribute('src', 'https://images/dog1.jpg')

    await user.click(screen.getByRole('button', { name: /Get Another Dog/i }))

    await waitFor(() => {
      expect(screen.getByAltText('A random dog')).toHaveAttribute(
        'src',
        'https://images/dog2.jpg',
      )
    })
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
