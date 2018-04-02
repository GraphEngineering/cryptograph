export * from "./types";
export * from "./actions";
export * from "./reducers";

import { Store, createStore } from "redux";

import { State } from "./types";
import reducers from "./reducers";

export const store: Store<State> = createStore(reducers);
