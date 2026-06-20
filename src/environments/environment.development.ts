/**
 * Development environment. Points the SPA at the local json-server instance
 * (npm run server) which serves server/db.json under /api/v1/*.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',

  notesEndpointPath: '/notes',
  eventsEndpointPath: '/events',
  quizzesEndpointPath: '/quizzes',
  notebooksEndpointPath: '/notebooks',
};
