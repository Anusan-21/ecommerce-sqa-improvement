import { render, screen } from "@testing-library/react"
import SearchBar from "@/app/components/molecules/SearchBar"
import "@testing-library/jest-dom"
import React from "react"


// Mock next/navigation
import { useRouter } from "next/navigation"
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("SearchBar simple test", () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it("renders the search input with placeholder", () => {
    render(<SearchBar placeholder="Search products..." />)
    const input = screen.getByPlaceholderText("Search products...")
    expect(input).toBeInTheDocument()
  })
})