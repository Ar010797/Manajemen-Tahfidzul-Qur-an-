const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add state for syncMetadata
code = code.replace(
  /const \[globalData, setGlobalData\] = useState<Record<string, any>>\(\{\}\);/,
  "const [globalData, setGlobalData] = useState<Record<string, any>>({});\n  const [syncMetadata, setSyncMetadata] = useState<Record<string, any>>({});"
);

// 2. Add metadata population in fetchGlobalData
const loopStart = "const newDocIds: Record<string, string> = {};";
code = code.replace(
  loopStart,
  loopStart + "\n      const newMetadata: Record<string, any> = {};"
);

const newDataAssignment = "newData[data.username] = safeJsonParse(rawJsonString);";
code = code.replace(
  newDataAssignment,
  newDataAssignment + "\n               newMetadata[data.username] = { updatedAt: data.updatedAt };"
);

const setGlobalDataStr = "setGlobalData(newData);";
code = code.replace(
  setGlobalDataStr,
  setGlobalDataStr + "\n      setSyncMetadata(newMetadata);"
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Patched AdminDashboard.tsx to include metadata!');
