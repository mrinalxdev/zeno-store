# ZenStore NPM Package 
> This manages complex state management in a web app

ZenStore NPM package is powerful state management solution designed to simplify complex state management in web applications. With a rich set of features, it provides developers with the tools needed to efficiently handle state in a scalable and maintainable way. 

## Features and usecase for the package .

### 1 . Middleware Support 

```js
const {Zenstore} = require('zen-store')

//Creating an instance
const zenStore = new ZenStore()

//Middleware Support
const middleare = (prevState, nextState) => {
    console.log('Middleware : State updated ', nextState)
}
zenStore.applyMiddleware(middleware)
```
ZenStore offers middleware support, allowing developers to inject custom logic into the state update process. This is particularly useful for tasks like logging, asynchronous operations, and third-party integrations.

### 2. Presistence Middleware

```js
const {PresistenceMiddleware} = require('zen-store')

const persistenceMiddleware = new PersistenceMiddleware('zen-store-state.json');
zenStore.applyMiddleware(persistenceMiddleware.persistState);
```

The package includes a Persistence Middleware, enabling seamless storage and retrieval of application state. This ensures that the state can persist across page reloads, improving the overall user experience.

### 3. Event Listeners and Custom Event Triggers 

```js
// Event Listeners

zenStore.on('userLoggedIn', user => {
  console.log(`Event Listener: User logged in - ${user.username}`);
});

//unsubscribing listeners
const listener = state => {
  console.log('Listener: State Updated', state);
};

const unsubscribe = zenStore.subscribe(listener);
setTimeout(unsubscribe, 5000) // to unsubsribe after some time

// Custom Event Trigger
zenStore.triggerEvent('userLoggedIn', { username: 'JohnDoe' });

```
Developers can subscribe to state changes using event listeners, facilitating responsive UI updates. Additionally, ZenStore allows the triggering of custom events, enhancing flexibility in handling various application events.

### 4. Undo/Redo Functionality

```js
zenStore.setState({ count: 44 });
zenStore.undo();
```
ZenStore introduces undo and redo functionality, enabling users to navigate through previous states. This is particularly beneficial in scenarios where users need to revert to a specific application state.

### 5. Debounce State Updates and Batch Update Configuration

```js
// Debounce State Updates
zenStore.setDebounceDelay(500);
zenStore.setState({ count: 45 }, true, true);

// Batch Update Config.
zenStore.startBatchUpdate();
zenStore.queueBatchUpdate({ count: 46 });
zenStore.endBatchUpdate();
```
The package includes features for controlling the frequency of state updates, offering debouncing options and batch update configurations. This ensures that state updates are optimized for performance.

### 6. Deep State Comparison

```js
zenStore.enableDeepStateComparison();
zenStore.setState({ nested: { prop: 'value' } });
zenStore.setState({ nested: { prop: 'updatedValue' } });
```

ZenStore supports deep state comparison, providing developers with granular control over state changes. This feature is valuable in scenarios where precise tracking of changes is crucial.

## Some Bonus Documentation of the features enhancements

```js
// Persistent State Storage Configuration
zenStore.setLocalStorageKey('custom-key');
zenStore.persistStateToLocalStorage();

// More Optimal Error Handling
zenStore.setErrorHandler(error => {
  console.error('Custom Error Handler:', error);
});

// Versioning
persistenceMiddleware.incrementVersion();

// Additional features from PersistenceMiddleware
persistenceMiddleware.saveState({ additionalData: 'Persisted Data' });
const loadedState = persistenceMiddleware.loadState();
console.log('Loaded State:', loadedState);

const fileInfo = persistenceMiddleware.getFileInfo();
console.log('File Information:', fileInfo);

persistenceMiddleware.renameFile('new-zen-store-state.json');
persistenceMiddleware.deleteFile();

console.log('Package features demonstration completed.');

```


## Upcoming Features

- Error Handling Enhancements
- Advanced Persistence Options
- Integration with Frameworks

Stay tuned for these exciting additions to the ZenStore package, as we continue to evolve and enhance the state management experience for web developers.``