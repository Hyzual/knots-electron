# knots-electron
> Turn your source code into a graph

Have you ever found yourself staring at a file someone else had written, wondering where it all starts ? You pick a place at random and look for a function that's calling it, and slowly you painstakingly retrace the path the code takes. What if you had a map 🗺 to follow that path ?

Maybe you want to estimate how difficult it will be to modify a piece of code. Most of the time, you don't take time to look at what will need to be modified. But then, when you're actually modifying a function, it turns out that it was called by a lot of other functions, and if you modify it you'll need to also change all these other functions. Usually, the actual feature becomes a lot more difficult than you had estimated. What if you could have known ? What if you could run a tool and look at a graph and know exactly which functions would be affected by that change ?

## What Knots does

knots-electron is an [electron][electron] app using [knotsjs][knotsjs] to parse your javascript code for you and identify all the functions and the links between them. Which function calls which others ? How many dependencies does this function have ?  What about the _transitive_ dependencies, how many functions do my dependencies call ? Knots can help you see them.

Why only functions ? Because the function is the atom of code. Ultimately, it's all functions calling other functions.

Choose a javascript file or a folder containing javascript files and Knots will parse them and render an interactive [D3.js][d3js] graph that you can explore to follow the function calls in your source code.

Here is what source code turned into a graph looks like:

![Rendered graph][knots-screenshot]

See the [Example][example] section for an explanation of the graph.


## Installation

```sh
$ git clone https://github.com/Hyzual/knots-electron.git
$ npm install
```

## Usage

```sh
$ npm run start
```

Then, choose a javascript (`.js`) file to parse or choose a folder containing javascript files. Knotsjs will search recursively for any javascript file in it and parse them all together.

## Example of result

For example, say you have the following code:

```js
function baz() {
  // nothing
}

function bar() {
  baz();
}

function foo() {
  bar();
}
```

After you parse it, this is what the rendered graph looks like:

![Rendered graph][example-three-func]

Knots graphs follow the same convention as [Spoiklin Soice][spoiklin] graphs as it was the inspiration for this program.

1. Each function is a colored circle 🔴 ◯. The more it tends to the color red, the more it has dependencies and/or the more it is depended upon. In this example, all three functions have the same red hue because:
  - `foo` depends on `bar` which depends on `baz`: 2 transitive dependencies.
  - `bar` depends on `baz`, but is depended upon by `foo`: 1 transitive dependency, 1 transitive dependent.
  - `baz` depends on nothing, but `bar` depends on it and transitively so does `foo`: 2 transitive dependents.

  Red circles 🔴 represent paths of potential change because they either:
    - are called by a lot of functions, which means that changing their return value or their arguments means changing every function calling them.
    - call a lot of other functions, which means that if any of those other functions change, this one will likely change too.

  White circles ◯ represent functions that are relatively standalone and should not be so difficult to change.

  Here is [another example][other-example] with more functions to see the variations.
2. Each function is ordered on levels. The higher the level is, the less depended upon the function. In other words, function that are "top-level" and are never called by anyone are on the highest level. Functions that have the highest maximum dependent depth are on the lowest level.

  - `foo` is never called by anyone and is at the highest level.
  - `baz` is called by `bar` which is called by `foo`, it is at the lowest level. It has a max dependent depth of 2.

  Levels are indicated with bands of alternating grey and white background.

  Having lots of levels indicates potential maintenance problems. See this [blog post on code depth][edmundkirwan-depth] by Edmund Kirwan, creator of [Spoiklin Soice][spoiklin].
3. Dependencies between functions can be one of two types:
  - straight line, the most common, is a dependency from top to bottom, from a function on a higher level to a function on a lower level.
  - curved line, this indicates some sort of cycle in the graph. It happens with circular dependencies. You should avoid having curved lines in your graphs ;).

You can hover on a node to display more information such as:

- the sum of transitive dependencies. If I hover on `foo`, it will be the sum of how many functions `foo` directly calls (here it's 1) and how many functions its dependencies themselves call (`bar` calls 1 function), so a sum of 2.
- the sum of its transitive dependents. If I hover on `baz`, it will be the sum of how many functions call `baz`
 (only `bar`, so 1) and how many functions call those functions (here `foo` calls `bar`, so 1), the sum will then be 2.

<a id="other-example"></a>

## An example closer to reality

![Knots parsing knotsjs source code][knots-screenshot]

This graph actually represents the `index.js` file of the [knotsjs source code][knotsjs-screenshot-source-code].

Using knots-electron, you can zoom in the graph using the mouse wheel, hover on a node to display additional information and pan around drag and drop.

![Highlighting a node][knots-screenshot-highlight]

You can also click on a particular node to highlight it and all its transitive dependencies and dependents. Here, I have clicked on `dependencies.get`.

## Limitations

See [knotsjs limitations][knotsjs-limitations].

## Contributing

There is an npm script to make your life easier. It will refresh whenever you change one of the files in `app/` and will reload electron when you change `main.js`.

```sh
$ npm run watch
```

## License

GPL v3 © Joris "Hyzual" MASSON

[example-three-func]: ./media/example-three-func.png
[knots-screenshot-highlight]: ./media/knots-screenshot-highlight.png
[knots-screenshot]: ./media/knots-screenshot.png

[d3js]: https://d3js.org
[edmundkirwan-depth]: http://edmundkirwan.com/general/tuples.html
[electron]: http://electron.atom.io/
[example]: #example-of-result
[knotsjs-limitations]: https://github.com/Hyzual/knotsjs#limitations
[knotsjs-screenshot-source-code]: https://github.com/Hyzual/knotsjs/blob/c7fe55c588477ba6a3740e5c1c6473a430f01550/lib/index.js
[knotsjs]: https://github.com/Hyzual/knotsjs
[other-example]: #other-example
[spoiklin]: http://edmundkirwan.com/general/spoiklin.html
