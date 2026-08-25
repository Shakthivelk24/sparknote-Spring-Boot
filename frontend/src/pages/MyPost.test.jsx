import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import MyPost from "./MyPost";

import {
  userDataContext,
} from "../context/DataContext.jsx";

import axios from "axios";


// =====================================================
// MOCK AXIOS
// =====================================================

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));


// =====================================================
// MOCK USERPOST
// =====================================================

vi.mock("../components/UserPost", () => ({
  default: ({ post, setPost }) => (
    <div data-testid={`user-post-${post.id}`}>
      <h2>{post.title}</h2>

      <p>{post.content}</p>

      <p>{post.author}</p>

      <button
        onClick={() =>
          setPost((old) =>
            old.filter(
              (p) => p.id !== post.id
            )
          )
        }
      >
        Delete
      </button>
    </div>
  ),
}));


// =====================================================
// TEST DATA
// =====================================================

const mockPosts = [
  {
    id: 1,
    title: "My First Post",
    content: "This is my first blog post.",
    author: "shakthi",
  },
  {
    id: 2,
    title: "Spring Boot",
    content: "Learning Spring Boot.",
    author: "shakthi",
  },
];


// =====================================================
// RENDER HELPER
// =====================================================

const renderMyPost = (
  contextValue = {}
) => {

  const defaultContext = {
    // Docker + Nginx
    serverUrl: "",

    ...contextValue,
  };

  return render(
    <MemoryRouter>

      <userDataContext.Provider
        value={defaultContext}
      >

        <MyPost />

      </userDataContext.Provider>

    </MemoryRouter>
  );
};


// =====================================================
// TESTS
// =====================================================

describe("MyPost Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ===================================================
  // LOADING
  // ===================================================

  test(
    "shows Loading while posts are being fetched",
    () => {

      axios.get.mockImplementation(
        () =>
          new Promise(() => {})
      );

      renderMyPost();

      expect(
        screen.getByText("Loading...")
      ).toBeInTheDocument();

    }
  );


  // ===================================================
  // API CALL
  // ===================================================

  test(
    "fetches user posts from the correct Docker API URL",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "/api/posts/user",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ===================================================
  // DISPLAY POSTS
  // ===================================================

  test(
    "displays user posts after successful API call",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "My First Post"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Spring Boot"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // CONTENT
  // ===================================================

  test(
    "displays post content",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "This is my first blog post."
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Learning Spring Boot."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // AUTHOR
  // ===================================================

  test(
    "displays post authors",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderMyPost();

      await waitFor(() => {

        const authors =
          screen.getAllByText(
            "shakthi"
          );

        expect(
          authors.length
        ).toBe(2);

      });

    }
  );


  // ===================================================
  // NO POSTS
  // ===================================================

  test(
    "shows No posts found when API returns empty array",
    async () => {

      axios.get.mockResolvedValue({
        data: [],
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts found."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // INVALID RESPONSE
  // ===================================================

  test(
    "shows No posts found when API returns non-array data",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          posts: mockPosts,
        },
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts found."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // API ERROR
  // ===================================================

  test(
    "shows No posts found when API request fails",
    async () => {

      axios.get.mockRejectedValue({

        response: {
          status: 500,
          data: {
            message:
              "Internal Server Error",
          },
        },

        message:
          "Request failed",

      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts found."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // 401 UNAUTHORIZED
  // ===================================================

  test(
    "handles unauthorized response",
    async () => {

      axios.get.mockRejectedValue({

        response: {
          status: 401,
          data: {
            message:
              "Unauthorized",
          },
        },

        message:
          "Request failed with status code 401",

      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts found."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DELETE / SET POST
  // ===================================================

  test(
    "passes setPosts function to UserPost",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderMyPost();

      await waitFor(() => {

        expect(
          screen.getByTestId(
            "user-post-1"
          )
        ).toBeInTheDocument();

      });

    });

});