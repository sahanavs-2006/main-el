import React from 'react';

const features = [
  { title: 'ಕನ್ನಡ ಮಾತು', desc: 'Speech/ಟೈಪ್ ಇನ್‌ಪುಟ್', icon: '🗣️' },
  { title: 'ಕೋಡ್ ರಚನೆ', desc: 'CodeT5 ಮೂಲಕ', icon: '⚙️' },
  { title: 'ಚಲನ/ಪರೀಕ್ಷೆ', desc: 'Local/Trinket IO', icon: '▶️' },
  { title: 'ದೋಷ ಅನುವಾದ', desc: 'ಕನ್ನಡದಲ್ಲಿ ವ್ಯಾಖ್ಯಾನ', icon: '📝' },
];

const FeatureCards = () => {
  return (
    <section id="features" className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-kannada text-3xl font-bold text-slate-900 mb-6">ವೈಶಿಷ್ಟ್ಯಗಳು</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">{f.icon}</div>
              <div className="mt-3 font-kannada text-xl text-slate-900">{f.title}</div>
              <p className="text-slate-600 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
