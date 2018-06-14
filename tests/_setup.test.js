const STORAGE_NAME = 'REACT_EASY_STORAGE';

history.replaceState(undefined, '', '/items?page=12&limit=&order');
localStorage.setItem(STORAGE_NAME, JSON.stringify({ initial: true }));
