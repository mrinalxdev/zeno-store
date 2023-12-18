const { describe, it } = require("mocha");
const { expect } = require("chai");
import {ZenoStore} from "../src/zenoStore.js"
import {PresistenceMiddleware} from "../src/presistentMiddleware.js"

//Will contain only basic tests for initial features. More test for other features will be added soon!
describe("ZenoStore", () => {
  it("should set and get state correctly", () => {
    const zenoStore = new ZenoStore();
    const initialState = { count: 0 };

    zenoStore.setState(initialState);

    const currentState = zenoStore.getState();
    expect(currentState).to.deep.equal(initialState);
  });

  it("should subscribe and notify listeners on state change", () => {
    const zenoStore = new ZenoStore();
    const initialState = { count: 0 };
    let callbackCalled = false;

    zenoStore.subscribe(() => {
      callbackCalled = true;
    });

    zenoStore.setState(initialState);
    expect(callbackCalled.to.equal(true));
  });
});

describe("PresistenceMiddleware", () => {
  it("should save and load state correctly", async () => {
    const presistentMiddleware = new PresistenceMiddleware("test-state.json");
    const initialState = { count: 0 };

    await presistentMiddleware.saveState(initialState);
    const loadState = await presistentMiddleware.loadState()
    expect(loadState).to.deep.equal(initialState)
  });

  it('should presist state after applying middleware'), async ()=> {
    const presistentMiddleware = new PresistenceMiddleware('test-state.json')
    const initialState = { count : 0}
    const nextState = {count : 1}

    await presistentMiddleware.presistState(initialState, nextState);

    const loadedState = await presistentMiddleware.loadState()
    expect(loadedState).to.deep.equal(nextState)
  }
});
