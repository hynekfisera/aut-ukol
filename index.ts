type X = 0 | 5 | 10 | 15 | 17.5 | 20 | 25 | 30 | 35 | 40 | 45 | 50;
type Y = 0 | 5 | 10 | 12.5 | 15;

type Bod = {
  x: X;
  y: Y;
  posledni: boolean; // byl **předchozí** bod poslední v dané části? pokud ano tak se nástroj před přesunem na tento bod zvedne nad materiál
};

const otacky = 1500; // ot/min
const rychlost = 100; // mm/min
const hloubka = -0.1; // mm

const body: Bod[] = [];

const pridej = (x: X, y: Y, posledni?: boolean) => body.push({ x, y, posledni: posledni ?? false });

// F
pridej(0, 0);
pridej(0, 10);
pridej(5, 10);
pridej(0, 5, true);
pridej(5, 5);

// I
pridej(10, 10, true);
pridej(10, 0);

// S
pridej(15, 0, true);
pridej(20, 0);
pridej(20, 5);
pridej(15, 5);
pridej(15, 10);
pridej(20, 10);

// háček nad S
pridej(15, 15, true);
pridej(17.5, 12.5);
pridej(20, 15);

// E
pridej(30, 10, true);
pridej(25, 10);
pridej(25, 0);
pridej(25, 5, true);
pridej(30, 5);
pridej(25, 0, true);
pridej(30, 0);

// R
pridej(35, 0, true);
pridej(35, 10);
pridej(40, 10);
pridej(40, 5);
pridej(35, 5);
pridej(40, 0);

// A
pridej(45, 0, true);
pridej(45, 10);
pridej(50, 10);
pridej(50, 0);
pridej(45, 5, true);
pridej(50, 5);

// zpet na vychozi bod
pridej(0, 0, true);

const instrukce: string[] = [];

instrukce.push(`G00 X0 Y0 Z100`);

body.forEach((bod, i) => {
  // zacina se zde obrabet?
  const prvni = i === 0 || (i !== 0 && !bod.posledni && body[i - 1].posledni);

  if (i === 0) {
    instrukce.push(`M03 S${otacky}`);
  }

  // zapnout obrabeni a jet dolu
  if (prvni) {
    instrukce.push(`G01 Z${hloubka} F${rychlost}`);
  }

  if (bod.posledni) {
    instrukce.push(`G00 Z2`);
  }

  let tempInstrukce = ``;
  tempInstrukce += bod.posledni ? "G00 " : "G01 ";

  // nová souřadnice x
  if (i === 0 || (i !== 0 && body[i - 1].x !== bod.x)) {
    tempInstrukce += `X${bod.x} `;
  }
  // nová souřadnice y
  if (i === 0 || (i !== 0 && body[i - 1].y !== bod.y)) {
    tempInstrukce += `Y${bod.y} `;
  }
  i !== 0 && instrukce.push(tempInstrukce);
});

instrukce.push(`M05`);
instrukce.push(`G00 Z100`);
instrukce.push(`M30`);

let result = "";

instrukce.forEach((i, index) => {
  if (index + 1 < 10) {
    result += `N0${index + 1} ${i}`;
  } else {
    result += `N${index + 1} ${i}`;
  }
  switch (index) {
    case 0:
      result += "; zvednutí nad materiál";
      break;
    case 2:
      result += "; písmeno F";
      break;
    case 11:
      result += "; písmeno I";
      break;
    case 15:
      result += "; písmeno Š";
      break;
    case 28:
      result += "; písmeno E";
      break;
    case 41:
      result += "; písmeno R";
      break;
    case 49:
      result += "; písmeno A";
      break;
    case 58:
      result += "; spuštění do výchozího bodu";
      break;
    default:
      break;
  }
  result += "<br>";
});

document.write(result);
