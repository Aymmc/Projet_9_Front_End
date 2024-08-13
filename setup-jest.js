import $ from 'jquery';
global.$ = global.jQuery = $;
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]), // Vous pouvez modifier cela pour retourner des données simulées spécifiques
    })
  );