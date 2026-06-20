/**
 * Production environment. Endpoint paths are declared here (Open/Closed):
 * adding a resource means adding a path, never touching endpoint clients.
 */
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',

  // board (Tablero)
  notesEndpointPath: '/notes',
  // scheduling (Calendario)
  eventsEndpointPath: '/events',
  // assessment (Exámenes)
  quizzesEndpointPath: '/quizzes',
  // notebook (Cuaderno)
  notebooksEndpointPath: '/notebooks',
};
