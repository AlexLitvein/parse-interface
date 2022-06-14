const lineReader = require("line-reader");
const fs = require("fs");
const path = require("node:path");
const proc = require("node:process");
const { argv } = require("process");
const closeTag = "}";
const openTag = "{";

const userTypes = new Map();

function parseCb(fileIn) {
  let currNode = null;
  let lvl = 0;
  let isOpen = false;

  console.log(`parseFile: ${fileIn}`);

  function createNode(name) {
    return {
      name: name,
      childs: [],
    };
  }

  function onOpenTag(line) {
    isOpen = true;
    lvl++;

    if (lvl <= 1) {
      const parts = line.split(" ");
      currNode = createNode(parts[2]);
    }
  }

  function onCloseTag(line) {
    if (lvl <= 1) {
      isOpen = false;
    }
    lvl--; // after!!!
  }

  function onChild(line) {
    if (line.length === 0 || line.includes("//")) return;
    if (lvl > 1) return;

    const parts = line.trim().replace(/;+/, "").split(" ");
    currNode.childs.push({ [parts[2]]: parts[1] });
  }

  return (line, last) => {
    if (line.includes(closeTag)) {
      onCloseTag(line);
    } else {
      if (line.includes(openTag)) {
        onOpenTag(line);
      } else {
        if (isOpen) {
          onChild(line);
        }
      }
    }

    if (last) {
      userTypes.set(currNode.name, currNode.childs);

      //   console.log("Last line printed.");
      //   const used = process.memoryUsage().heapUsed / 1024 / 1024;
      //   console.log(
      //     `The script uses approximately ${Math.round(used * 100) / 100} MB`
      //   );
    }
  };
}

function parseFile(fileName) {
  lineReader.eachLine(fileName, parseCb(fileName));
}

async function scanDir(pathIn) {
  const entries = fs.readdirSync(pathIn, { withFileTypes: true });
  let name = "";
  for (const ent in entries) {
    const element = entries[ent];
    name = path.join(pathIn, element.name);

    if (element.isDirectory()) {
      scanDir(name);
    } else {
      parseFile(name);
    }
  }
}

function processItem(obj, typesMap) {
  for (const key in obj) {
    const el = obj[key];
    let tp = typesMap.get(el);
    if (tp) {
    }
  }
}

function createComponents(pathIn, typesMap) {
  typesMap.forEach((value, key, map) => {
    fs.appendFileSync(pathIn, `<${key}>\n`);
    value.forEach((el, idx) => {
      fs.appendFileSync(
        pathIn,
        `  <Typography sx={{}}>{${key}.${Object.values(el)[0]}}</Typography>\n`
      );
    });
    fs.appendFileSync(pathIn, `</${key}>\n\n`);
  });
}
// scanDir("d:/inet/ForHouseClub-Base/src/main/java/club/forhouse/dto");
// scanDir("d:/work/parseInterface/dto");
scanDir(proc.argv[2]);

setTimeout(() => {
  // proc.argv.forEach((val, index) => {
  //   console.log(`${index}: ${val}`);
  // });

  fs.mkdirSync(proc.argv[3], { recursive: true });
  let pathIn = path.resolve(proc.argv[3], "components.jsx");

  fs.writeFileSync(pathIn, "", {
    encoding: "utf8",
    flag: "w",
  });

  createComponents(pathIn, userTypes);
  console.log(userTypes.entries());
}, 2000);
