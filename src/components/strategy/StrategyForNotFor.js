import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const defaultFor = {
  bg: '#ecfdf5',
  border: '#a7f3d0',
  titleColor: '#065f46',
  textColor: '#334155',
  iconColor: '#059669',
};
const defaultNotFor = {
  bg: '#fef2f2',
  border: '#fecaca',
  titleColor: '#991b1b',
  textColor: '#334155',
  iconColor: '#dc2626',
};

export function StrategyForNotFor() {
  const { config } = useConfig();
  const f = config.strategyLayout?.forNotFor || {};
  const forItems = (f.forItems || []).filter(Boolean);
  const notForItems = (f.notForItems || []).filter(Boolean);

  const forStyle = {
    backgroundColor: (f.forBg && f.forBg.trim()) ? f.forBg.trim() : defaultFor.bg,
    borderColor: (f.forBorder && f.forBorder.trim()) ? f.forBorder.trim() : defaultFor.border,
  };
  const forTitleColor = (f.forTitleColor && f.forTitleColor.trim()) ? f.forTitleColor.trim() : defaultFor.titleColor;
  const forTextColor = (f.forTextColor && f.forTextColor.trim()) ? f.forTextColor.trim() : defaultFor.textColor;
  const forIconColor = (f.forIconColor && f.forIconColor.trim()) ? f.forIconColor.trim() : defaultFor.iconColor;

  const notForStyle = {
    backgroundColor: (f.notForBg && f.notForBg.trim()) ? f.notForBg.trim() : defaultNotFor.bg,
    borderColor: (f.notForBorder && f.notForBorder.trim()) ? f.notForBorder.trim() : defaultNotFor.border,
  };
  const notForTitleColor = (f.notForTitleColor && f.notForTitleColor.trim()) ? f.notForTitleColor.trim() : defaultNotFor.titleColor;
  const notForTextColor = (f.notForTextColor && f.notForTextColor.trim()) ? f.notForTextColor.trim() : defaultNotFor.textColor;
  const notForIconColor = (f.notForIconColor && f.notForIconColor.trim()) ? f.notForIconColor.trim() : defaultNotFor.iconColor;

  return (
    <section className="py-0 sm:py-16 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div
          className="scroll-reveal p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border min-w-0"
          style={{ ...forStyle, borderWidth: 1, borderStyle: 'solid' }}
        >
          <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 flex items-center gap-2" style={{ color: forTitleColor }}>
            <span className="material-symbols-outlined flex-shrink-0" style={{ color: forIconColor }}>check_circle</span>
            <span>{f.forTitle || 'Who This Is For'}</span>
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            {forItems.map((item, i) => (
              <li key={i} className="stagger-children-item flex items-start gap-3 text-sm sm:text-base min-w-0" style={{ color: forTextColor }}>
                <span className="material-symbols-outlined text-sm mt-0.5 flex-shrink-0" style={{ color: forIconColor }}>arrow_forward</span>
                <span>{typeof item === 'string' ? item : (item?.text ?? item?.label ?? '')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="scroll-reveal p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border min-w-0"
          style={{ ...notForStyle, borderWidth: 1, borderStyle: 'solid' }}
        >
          <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 flex items-center gap-2" style={{ color: notForTitleColor }}>
            <span className="material-symbols-outlined flex-shrink-0" style={{ color: notForIconColor }}>cancel</span>
            <span>{f.notForTitle || 'Who This Is Not For'}</span>
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            {notForItems.map((item, i) => (
              <li key={i} className="stagger-children-item flex items-start gap-3 text-sm sm:text-base min-w-0" style={{ color: notForTextColor }}>
                <span className="material-symbols-outlined text-sm mt-0.5 flex-shrink-0" style={{ color: notForIconColor }}>block</span>
                <span>{typeof item === 'string' ? item : (item?.text ?? item?.label ?? '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
