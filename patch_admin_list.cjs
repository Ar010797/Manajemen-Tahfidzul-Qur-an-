const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add lucide imports
code = code.replace(
  /import \{ Shield, RefreshCw, Download, Users, FileText, CheckCircle, Trash2, Eye \} from 'lucide-react';/,
  "import { Shield, RefreshCw, Download, Users, FileText, CheckCircle, Trash2, Eye, Clock, AlertTriangle } from 'lucide-react';"
);

// 2. Prepare the render loop
const renderLoopStart = "gurus.map(guru => {";
code = code.replace(
  renderLoopStart,
  `const currentMonthStr = new Date().toISOString().substring(0, 7);\n            ` + renderLoopStart
);

const insideMap = "const studentCount = d.students?.length || 0;";
const additionalLogic = `
              const lastSync = syncMetadata[guru]?.updatedAt;
              let isSyncedThisMonth = false;
              let syncText = "Belum sinkron";
              let statusColor = "bg-stone-100 text-stone-500 border-stone-200";
              let SyncIcon = Clock;
              
              if (lastSync) {
                const syncDate = new Date(lastSync);
                isSyncedThisMonth = lastSync.substring(0, 7) === currentMonthStr;
                syncText = syncDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                
                if (isSyncedThisMonth) {
                  statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  SyncIcon = CheckCircle;
                } else {
                  statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                  SyncIcon = AlertTriangle;
                  syncText = "Bulan ini belum: " + syncText;
                }
              }
`;
code = code.replace(
  insideMap,
  insideMap + additionalLogic
);

// 3. Inject the badge in the UI
const uiToInjectAfter = `<h3 className="font-bold text-stone-900 text-lg">{guru}</h3>`;
const badgeUI = `
                      <div className={\`mt-1 mb-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider \${statusColor}\`}>
                        <SyncIcon className="w-3 h-3" />
                        {syncText}
                      </div>`;
                      
code = code.replace(uiToInjectAfter, uiToInjectAfter + badgeUI);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Patched teacher list UI!');
