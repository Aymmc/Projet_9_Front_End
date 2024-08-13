// Mock pour l'erreur 404
export const fetchMock404 = () => {
    global.fetch = jest.fn(() =>
      Promise.reject({
        status: 404,
        message: 'Not Found'
      })
    );
  };
  
  // Mock pour l'erreur 500
  export const fetchMock500 = () => {
    global.fetch = jest.fn(() =>
      Promise.reject({
        status: 500,
        message: 'Internal Server Error'
      })
    );
  };
  export const fetchMockPost = (response = {}, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status,
        json: () => Promise.resolve(response),
      })
    );
  };
  
  export const fetchMockPostError = (status) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status,
        json: () => Promise.reject(new Error('API error')),
      })
    );
  };