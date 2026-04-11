import { useLocation } from 'react-router-dom';

export default function RegistrationProgress() {
  const location = useLocation();
  const path = location.pathname;

  let step = 1;
  let textRight = 'Profile';
  if (path === '/verify-otp') {
    step = 2;
  } else if (path === '/financial-identity') {
    step = 3;
    textRight = 'Identity';
  } else if (path === '/trust-score') {
    step = 3;
    textRight = 'Trust Score';
  }

  return (
    <div className="w-full bg-surface pt-6 pb-2 px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-surface-container-high">
            {/* Progress Bar Fill */}
            <div style={{ width: `${(step / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#747cd3] transition-all duration-500 rounded-full"></div>
          </div>
          {/* Steps */}
          <div className="flex justify-between text-xs font-bold font-headline uppercase tracking-widest text-[#747cd3]/40">
            <div className={`text-left ${step >= 1 ? 'text-[#747cd3]' : ''}`}>Registration</div>
            <div className={`text-center ${step >= 2 ? 'text-[#747cd3]' : ''}`}>Verification</div>
            <div className={`text-right ${step >= 3 ? 'text-[#747cd3]' : ''}`}>{textRight}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
