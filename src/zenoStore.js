class ZenoStore {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
    this.middlewares = [];
    this.eventListeners = {};
    this.undoStack = [];
    this.redoStack = [];
    this.prevState = { ...initialState };

    this.debouceTimeout = null;
    this.debounceDelay = 200;
    this.batchUpdatePending = false;
    this.batchUpdateQueue = [];

    //Deep State feature
    this.deepStateComparison = false;
    this.localStorageKey = "apiState";

    //Error Handling Config
    this.errorHandler = null;
  }

  getState() {
    return this.deepStateComparison
      ? JSON.parse(JSON.stringify(this.state))
      : { ...this.state };
  }

  setState(newState, addToUndoStack = true, debounce = false) {
    try {
      const nextState = this.deepStateComparison
        ? JSON.parse(JSON.stringify(newState))
        : { ...newState };

      if (debounce) {
        clearTimeout(this.debouceTimeout);
        this.debouceTimeout = setTimeout(() => {
          this.applyStateUpdate(nextState, addToUndoStack);
        }, this.debounceDelay);
      } else {
        this.applyStateUpdate(nextState, addToUndoStack);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  applyStateUpdate(nextState, addToUndoStack) {
    try {
      this.applyMiddlewares(this.prevState, nextState);

      if (addToUndoStack) {
        this.undoStack.push(
          this.deepStateComparison
            ? JSON.parse(JSON.stringify(this.state))
            : { ...this.state }
        );
        this.redoStack = [];
      }

      this.prevState = this.deepStateComparison
        ? JSON.parse(JSON.stringify(this.state))
        : { ...this.state };

      this.state = nextState;
      this.notifyListeners();
      this.presistentStateToLocalStorage();
    } catch (err) {
      this.handleError(err);
    }
  }

  subscribe(listeners) {
    this.listeners.push(listeners);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listeners);
    };
  }

  on(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName] = this.eventListeners[eventName].filter(
      (cb) => cb !== callback
    );
  }
  applyMiddleware(middleware, options = { selective: false }) {
    if (options.selective) {
      this.middlewares.push({ middleware, enabled: true });
    } else {
      this.middlewares.push({ middleware, enabled: true });
    }
  }
  applyMiddlewares(prevState, nextState) {
    //Async Middleware Support
    const enableMiddleware = this.middlewares
      .filter((m) => m.enabled)
      .map((m) => m.middleware);

    const middlewareChain = enableMiddleware.reduce((acc, middleware) => {
      return acc.then(() => middleware(prevState, nextState));
    }, Promise.resolve());

    return middlewareChain.catch((error) => {
      this.handleError(error);
    });
  }

  notifyListeners() {
    this.listeners.forEach((_listeners) => listener(this.getState()));
    this.notifyListeners();
  }

  notifyListeners() {
    Object.keys(this.eventListeners).forEach((eventName) => {
      if (this.state[eventName] !== undefined) {
        this.eventListeners[eventName].forEach((callback) =>
          callback(this.state[eventName])
        );
      }
    });
  }

  resetState() {
    const prevState = this.deepStateComparison
      ? JSON.parse(JSON.stringify(this.state))
      : { ...this.state };
    this.state = this.deepStateComparison
      ? JSON.parse(JSON.stringify(this.initialState))
      : { ...this.initialState };

    this.prevState = this.deepStateComparison
      ? JSON.parse(JSON.stringify(this.initialState))
      : { ...this.initialState };
    this.applyMiddleware(prevState, this.state);
    this.notifyListeners();
  }
}
