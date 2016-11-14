[![npm version](https://badge.fury.io/js/react-redux-uuid.svg)](https://badge.fury.io/js/react-redux-uuid)

## react-redux-uuid

A place to keep your disposable but application-related component state data

### Why would you need this

Sometimes you write components that hold a state with data related to your application's data, in an
ideal world you would like to keep all of your's app state in the redux state, but sometimes these
components dont have an unique key in the redux state because there's an undefined number of instances
of your component across the app.

### Philosophy

The main goal is to register a unique sub-state for each component that needs it into the redux state,
this happens when the component mounts/unmounts.

The data in this state, very much like the data in the component's local state, isn't persistent and
is completely discarded in the unmount lifecycle.

Instead of initializing your component's state in its constructor you would do as you would with a
redux reducer declaring its initial state in the reducer's definition.

### Quick Example

```jsx
// declaration of your Autocomplete.js component

const Autocomplete = ({ options }) => (
  ...
)

const mapStateToProps = (state /* this is the componet's unique state */) => {
  return {
    options: state.options
  }
}

export default connectUUID('autocomplete', mapStateToProps)(Autocomplete);

// using it somewhere else

<div>
  <Autocomplete />
  <Autocomplete />
  <Autocomplete />
</div>

// each of the Autocomplete components opens up a new key in your app's state

uuid: {
  autocomplete: {
    // autogenerated uuids by this lib
    'bc1de127-0962-43a6-a224-9cc4716da4b6': {...},
    'cc94ccb8-85a3-407a-9fc0-cc895459b422': {...},
    '41952137-e54c-4f9e-be08-07ffe11ee554': {...}
  }
}
```

## API

### `createUUIDReducer(reducers)`

Creates your UUID reducer, make sure to place its result state under `state.uuid`

#### Arguments

* `reducers` (_Object\<key, reducer\>_): An object map of reducers, where each `<key>` sets the
reducer's *name* (see `connectUUID(name, ...args)`)

#### Returns

A reducer that will filter out redux actions that go through it to the corresponding reducer

#### Example

```js
const mainAppReducer = combineReducers({
  uuid: createUUIDReducer({
    counter: counterReducer,
    fizzbuzz: fizzbuzzReducer
  })
})
```

### `connectUUID(name, [mapStateToProps], [mapDispatchToProps])`

Creates a HoC to connect your component to it's corresponding reducer state, its very similar to
react-redux's `connect`

#### Arguments

* `name` (_String_): The name of the corresponding reducer that this HoC will use from the reducer
object map passed on to `createUUIDReducer` in the main reducer declaration
* `[mapStateToProps]`: See [react-redux's docs](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
* `[mapDispatchToProps]`: See [react-redux's docs](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)

#### Returns

A function that injects the inner state and wrapped action creators into your component.
