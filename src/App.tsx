import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useDechaTime } from './hooks/useDechaTime';
import { 
  useTheme, 
  useShowProgressBars, 
  useShowEarthTime, 
  useDisplayFormat, 
  useShowDayContext, 
  useUse24HourEarth, 
  useEnableAppBadge, 
  useEnableHourlyNotifications, 
  useToggleEarthTime 
} from './stores/selectors';
import { useAppBadge } from './hooks/useAppBadge';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotifications } from './hooks/useNotifications';
import { useStats } from './hooks/useStats';
import { useShare } from './hooks/useShare';
import { requestNotificationPermission } from './utils/notifications';
import { Header } from './components/Header';
import { TimeDisplay } from './components/TimeDisplay';
import { ProgressBars } from './components/ProgressBars';
import { EarthTimeDisplay } from './components/EarthTimeDisplay';
import { DayContext } from './components/DayContext';
import { InstallBanner } from './components/InstallBanner';
import { ShareButton } from './components/ShareButton';
import { WakeLockButton } from './components/WakeLockButton';
import { TimezoneDisplay } from './components/TimezoneDisplay';
import { NotificationPermission } from './components/NotificationPermission';

const Settings = lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const TimeConverter = lazy(() => import('./components/TimeConverter').then(module => ({ default: module.TimeConverter })));
const AlarmManager = lazy(() => import('./components/AlarmManager').then(module => ({ default: module.AlarmManager })));
const Calendar = lazy(() => import('./components/Calendar').then(module => ({ default: module.Calendar })));
const StatsPanel = lazy(() => import('./components/StatsPanel').then(module => ({ default: module.StatsPanel })));
const KeyboardHelp = lazy(() => import('./components/KeyboardHelp').then(module => ({ default: module.KeyboardHelp })));
const MultiTimezoneConverter = lazy(() => import('./components/MultiTimezoneConverter').then(module => ({ default: module.MultiTimezoneConverter })));

const themeBackgrounds = {
  navy: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  sunset: 'bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700',
  matrix: 'bg-gradient-to-br from-green-950 via-emerald-900 to-green-950',
  cosmic: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900',
  minimal: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
};

type ModalType = 'settings' | 'converter' | 'alarms' | 'calendar' | 'stats' | 'help' | 'multi-timezone' | null;

function App() {
  const { dechaTime, earthTime } = useDechaTime();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { shareTime } = useShare();

  const theme = useTheme();
  const displayFormat = useDisplayFormat();
  const showEarthTime = useShowEarthTime();
  const showProgressBars = useShowProgressBars();
  const showDayContext = useShowDayContext();
  const use24HourEarth = useUse24HourEarth();
  const enableAppBadge = useEnableAppBadge();
  const enableHourlyNotifications = useEnableHourlyNotifications();
  const toggleEarthTime = useToggleEarthTime();

  useAppBadge(dechaTime.hours, enableAppBadge);
  useNotifications(dechaTime);
  useStats();

  useEffect(() => {
    if (enableHourlyNotifications) {
      requestNotificationPermission();
    }
  }, [enableHourlyNotifications]);

  useEffect(() => {
    if (activeModal) {
      document.body.classList.add('modal-open');
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  useKeyboardShortcuts({
    onSettings: () => setActiveModal(activeModal === 'settings' ? null : 'settings'),
    onConverter: () => setActiveModal('converter'),
    onAlarms: () => setActiveModal('alarms'),
    onCalendar: () => setActiveModal('calendar'),
    onStats: () => setActiveModal('stats'),
    onMultiTimezone: () => setActiveModal('multi-timezone'),
    onHelp: () => setActiveModal('help'),
    onShare: () => shareTime(dechaTime, earthTime),
    onToggleEarthTime: toggleEarthTime,
    onClose: () => setActiveModal(null),
  });

  return (
    <div className={`min-h-screen ${themeBackgrounds[theme]} transition-colors duration-1000`}>
      <div className="min-h-screen backdrop-blur-3xl flex flex-col">
        <Header
          onSettingsClick={() => setActiveModal('settings')}
          onConverterClick={() => setActiveModal('converter')}
          onAlarmsClick={() => setActiveModal('alarms')}
          onCalendarClick={() => setActiveModal('calendar')}
          onStatsClick={() => setActiveModal('stats')}
          onMultiTimezoneClick={() => setActiveModal('multi-timezone')}
          onHelpClick={() => setActiveModal('help')}
        />

        <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
          <TimeDisplay time={dechaTime} format={displayFormat} />

          <div className="flex flex-wrap gap-3 justify-center">
            <ShareButton dechaTime={dechaTime} earthTime={earthTime} />
            <WakeLockButton />
          </div>

          {showProgressBars && <ProgressBars time={dechaTime} />}

          <div className="flex flex-wrap gap-4 justify-center">
            {showEarthTime && (
              <EarthTimeDisplay time={earthTime} use24Hour={use24HourEarth} />
            )}
            {showDayContext && <DayContext time={dechaTime} />}
          </div>

          <div className="mt-8 text-center space-y-2">
            <TimezoneDisplay />
            <p className="text-white/40 text-sm">
              1 DECHA day = 10 hours = 100 minutes/hour = 100 seconds/minute
            </p>
            <p className="text-white/30 text-xs">
              Time designed for the digital age
            </p>
          </div>
        </main>

        <Suspense fallback={null}>
          <Settings isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} />
          <TimeConverter isOpen={activeModal === 'converter'} onClose={() => setActiveModal(null)} />
          <AlarmManager isOpen={activeModal === 'alarms'} onClose={() => setActiveModal(null)} />
          <Calendar isOpen={activeModal === 'calendar'} onClose={() => setActiveModal(null)} />
          <StatsPanel isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} />
          <KeyboardHelp isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} />
          <MultiTimezoneConverter isOpen={activeModal === 'multi-timezone'} onClose={() => setActiveModal(null)} />
        </Suspense>

        <InstallBanner />
        <NotificationPermission />
        <VercelAnalytics />
      </div>
    </div>
  );
}

export default App;