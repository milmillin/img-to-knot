# img-to-knot

This repository contains a web interface to create a [knitout](https://textiles-lab.github.io/knitout/knitout.html) file with "knot" stiches from an image.

## The "knot" stitch

![Knot stitch](/knot-stitch-01.png)

## Usage

Open the prebuilt `dist/index.html`, and select an image file. The knot will be created on the white pixels by default.

### Parameters
- Desired width: the number of stiches in each row.
- Threshold: the threshold to create black-and-white image.
- Number of knots: the number of times a yarn goes around the stich.
- Knot on black: whether to create a knot on a black pixel

![Screenshot](/screenshot.png)

## Rebuilding img-to-knot

We use [webpack](https://webpack.js.org/) to compile our javascript codes. Make sure you have Node and npm installed. To build the site, run

```
npx webpack
```

### `src/knot.js`

Contains a function that creates a rectangular piece with knot stitches at specified positions and returns a `knitout` string.

- `knotData`: an object with keys `width`, `height`, and `data`. `knotData.data` is a 2-dimensional array of boolean indicating whether to create a knot stitch on that position.
- `invert`: a boolean; if set to `True`, create a knot on stitch on position where `knotData.data` is `False`.
- `numKnots`: an integer denoting a number of times the yarn will be wrapped around at each position.

Modify this file if you want to change the header or the yarn carrier of the generated `knitout` file.

### `src/knitout.js`

A javascript frontend for `knitout` file. Modified version of [https://github.com/textiles-lab/knitout-frontend-js](https://github.com/textiles-lab/knitout-frontend-js).

### `src/index.js`

An interface between the DOM elements and `src/knot.js`.
