const fs = require('fs');
const file = 'src/components/InstitutionProfile.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const \[profile, setProfile\] = useState\(\{[\s\S]*?\}\)\);/g, `const [profile, setProfile] = useState({
    name: '',
    address: '',
    name_mts: '',
    address_mts: '',
    logo_mts: '',
    principal_name: '',
    principal_name_mts: '',
    coordinator_name: '',
    halaqoh_teacher_name: '',
    academic_year: '2025/2026',
    report_date: new Date().toISOString().split('T')[0],
    logo: '',
    principal_signature: '',
    coordinator_signature: '',
    principal_signature_mts: '',
    coordinator_signature_mts: '',
    principal_signature_size: 80,
    coordinator_signature_size: 80,
    principal_signature_size_mts: 80,
    coordinator_signature_size_mts: 80,
    theme_color: 'emerald' as const,
    reminder_enabled: false,
    reminder_time: '15:00'
  });`);

code = code.replace(/setProfile\(prev => \(\{ \.\.\.prev, \[field\]: dataUrl \}\)\)\);/g, "setProfile(prev => ({ ...prev, [field]: dataUrl }));");

code = code.replace(/if \(data\) setProfile\(\(prev: any\) => \(\{\s*\.\.\.prev,\s*\.\.\.data,/g, "if (data) setProfile((prev: any) => ({ ...prev, ...data,");

fs.writeFileSync(file, code);
console.log('Fixed InstitutionProfile revert');
