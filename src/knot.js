// import the knitoutWriter code and instantiate it as an object
var knitout = require("./knitout");

const Knot = (knotData, invert, numKnots) => {
  // swatch variables
  var height = knotData.height;
  var width = knotData.width;
  var data = knotData.data;

  const k = new knitout.Writer({
    carriers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  });

  k.addHeader("Machine", "SWG091N2");
  k.addHeader("Gauge", "15");

  const wrapAround = (k, direction, bed, needle, carrier, times) => {
    const otherBed = bed === "f" ? "b" : "f";
    if (direction === "+") {
      for (let i = 0; i < times; i++) {
        k.miss("+", "f" + (needle + 1), carrier);
        k.xfer(bed + needle, otherBed + needle);
        k.miss("-", "f" + (needle - 1), carrier);
        k.xfer(otherBed + needle, bed + needle);
      }
      //k.miss("+", bed + (needle - 1), carrier);
    } else {
      for (let i = 0; i < times; i++) {
        k.miss("-", "f" + (needle - 1), carrier);
        k.xfer(bed + needle, otherBed + needle);
        k.miss("+", "f" + (needle + 1), carrier);
        k.xfer(otherBed + needle, bed + needle);
      }
      //k.miss("-", bed + (needle + 1), carrier);
    }
  };


  var carrier = "5";

  // bring in carrier using yarn inserting hook
  k.inhook(carrier);

  // cast on
  // tuck on alternate needles to cast on
  for (var s = width; s > 0; s--) {
    if (s % 2 == 0) {
      k.tuck("-", "f" + s, carrier);
    } else {
      k.miss("-", "f" + s, carrier);
    }
  }
  for (var s = 1; s <= width; s++) {
    if (s % 2 != 0) {
      k.tuck("+", "f" + s, carrier);
    } else {
      k.miss("+", "f" + s, carrier);
    }
  }

  // release the yarn inserting hook
  k.releasehook(carrier);

  // knit some rows back and forth
  for (var h = 0; h < height; h++) {
    // we knit from bottom
    const y = height - h - 1;

    if (h % 2 === 0) {
      for (var s = width; s > 0; s--) {
        const x = s - 1;
        if (data[y][x] !== invert) {
          wrapAround(k, "-", "f", s, carrier, numKnots);
        }
        k.knit("-", "f" + s, carrier);
      }
    } else {
      for (var s = 1; s <= width; s++) {
        const x = s - 1;
        if (data[y][x] !== invert) {
          wrapAround(k, "+", "f", s, carrier, numKnots);
        }
        k.knit("+", "f" + s, carrier);
      }
    }
  }

  // bring the yarn out with the yarn inserting hook
  k.outhook(carrier);

  // write the knitout to a file called "out.k"
  return k.toKnitoutString();
};

module.exports = Knot;
