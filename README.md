# img-to-knot

This repository contains a web interface to create a [knitout](https://textiles-lab.github.io/knitout/knitout.html) file with "knot" stiches from an image.

## Usage

Open the prebuilt `dist/index.html`, and select an image file. The knot will be created on the white pixels by default.

### Parameters
- Desired width: the number of stiches in each row.
- Threshold: the threshold to create black-and-white image.
- Number of knots: the number of times a yarn goes around the stich.
- Knot on black: whether to create a knot on a black pixel

![Screenshot](/screenshot.png)
