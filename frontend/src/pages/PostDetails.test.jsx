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
  fireEvent,
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import PostDetails from "./PostDetails";

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
// RENDER HELPER
// =====================================================

const renderPostDetails = (
  postId = "1",
  contextValue = {}
) => {

  const defaultContext = {
    // Docker + Nginx
    serverUrl: "",

    ...contextValue,
  };

  return render(
    <MemoryRouter
      initialEntries={[
        `/post/${postId}`,
      ]}
    >

      <userDataContext.Provider
        value={defaultContext}
      >

        <Routes>

          <Route
            path="/post/:id"
            element={<PostDetails />}
          />

          <Route
            path="/"
            element={
              <div>
                Home Page
              </div>
            }
          />

        </Routes>

      </userDataContext.Provider>

    </MemoryRouter>
  );
};


// =====================================================
// MOCK POST
// =====================================================

const mockPost = {
  id: 1,
  title: "Java Spring Boot",
  content:
    "Spring Boot makes it easy to create production-ready Java applications.",
  author: "shakthi",
};


// =====================================================
// TESTS
// =====================================================

describe("PostDetails Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ===================================================
  // LOADING
  // ===================================================

  test(
    "shows loading message while post is loading",
    () => {

      axios.get.mockImplementation(
        () =>
          new Promise(() => {})
      );

      renderPostDetails("1");

      expect(
        screen.getByText(
          "Loading post..."
        )
      ).toBeInTheDocument();

    }
  );


  // ===================================================
  // API CALL
  // ===================================================

  test(
    "fetches post using Docker API URL",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "/api/posts/1",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ===================================================
  // DISPLAY TITLE
  // ===================================================

  test(
    "displays post title",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Java Spring Boot"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DISPLAY CONTENT
  // ===================================================

  test(
    "displays post content",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Spring Boot makes it easy to create production-ready Java applications."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DISPLAY AUTHOR
  // ===================================================

  test(
    "displays post author",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "shakthi"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DISPLAY FIRST LETTER
  // ===================================================

  test(
    "displays first letter of author",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText("S")
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DISPLAY POST ID
  // ===================================================

  test(
    "displays post ID",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post #1"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // AUTHOR DEFAULT
  // ===================================================

  test(
    "uses Anonymous when author is missing",
    async () => {

      axios.get.mockResolvedValue({

        data: {
          id: 2,
          title: "Anonymous Post",
          content:
            "Anonymous content",
        },

      });

      renderPostDetails("2");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Anonymous"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // EMPTY AUTHOR
  // ===================================================

  test(
    "uses Anonymous when author is empty",
    async () => {

      axios.get.mockResolvedValue({

        data: {
          id: 3,
          title: "Empty Author",
          content:
            "Post content",
          author: "",
        },

      });

      renderPostDetails("3");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Anonymous"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // POST NOT FOUND
  // ===================================================

  test(
    "shows Post not found when API returns error",
    async () => {

      axios.get.mockRejectedValue({

        response: {
          status: 404,
          data: {
            message:
              "Post not found",
          },
        },

        message:
          "Request failed with status code 404",

      });

      renderPostDetails("999");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // POST NOT FOUND - NULL RESPONSE
  // ===================================================

  test(
    "shows Post not found when response data is null",
    async () => {

      axios.get.mockResolvedValue({
        data: null,
      });

      renderPostDetails("999");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // SERVER ERROR
  // ===================================================

  test(
    "handles server error",
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

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // UNAUTHORIZED
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

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // BACK TO HOME
  // ===================================================

  test(
    "renders Back to Home button",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "Back to Home",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // BACK BUTTON
  // ===================================================

  test(
    "renders Back button",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "← Back",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // BACK TO HOME CLICK
  // ===================================================

  test(
    "Back to Home button navigates to home",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "Back to Home",
            }
          )
        ).toBeInTheDocument();

      });

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Back to Home",
          }
        )
      );

      expect(
        screen.getByText(
          "Home Page"
        )
      ).toBeInTheDocument();

    }
  );


  // ===================================================
  // MULTILINE CONTENT
  // ===================================================

  test(
    "renders multiline post content",
    async () => {

      const multilinePost = {

        id: 5,

        title:
          "Multiline Post",

        content:
          "Line one\nLine two\nLine three",

        author:
          "shakthi",

      };

      axios.get.mockResolvedValue({
        data: multilinePost,
      });

      renderPostDetails("5");

      await waitFor(() => {

        expect(
          screen.getByText(
            /Line one/
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Line two/
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Line three/
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ===================================================
  // DIFFERENT POST ID
  // ===================================================

  test(
    "requests the correct post ID",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          id: 6,
          title: "Another Post",
          content: "Another content",
          author: "rahul",
        },
      });

      renderPostDetails("6");

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "/api/posts/6",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ===================================================
  // API CALLED ONLY ONCE
  // ===================================================

  test(
    "calls post API once",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails("1");

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledTimes(1);

      });

    }
  );


  // ===================================================
  // DOCKER SERVER URL
  // ===================================================

  test(
    "works when serverUrl is empty",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails(
        "1",
        {
          serverUrl: "",
        }
      );

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "/api/posts/1",

          {
            withCredentials: true,
          }

        );

      });

    }
  );

});