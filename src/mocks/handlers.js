// src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.post("/login", (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem("is-authenticated", "true");

    return res(
      // Respond with a 200 status code
      ctx.status(200)
    );
  }),
  rest.get("/api/phases", (req, res, ctx) => {
    // Persist user's authentication in the session

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json([
        { phaseName: "Phase 1", phaseValue: 1 },
        { phaseName: "Phase 2", phaseValue: 2 },
        { phaseName: "Phase 3", phaseValue: 3 },
        { phaseName: "Phase 4", phaseValue: 4 },
        { phaseName: "Phase 5", phaseValue: 5 },
      ])
    );
  }),

  rest.get("/user", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem("is-authenticated");

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized",
        })
      );
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      })
    );
  }),
];
