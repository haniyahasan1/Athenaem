'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/Interests.module.css';

const FIELDS = [
  { id: 'chem_eng', name: 'Chemical Engineering', subs: ['Polymer Engineering', 'Process Engineering', 'Reaction Engineering', 'Thermodynamics', 'Petrochemicals', 'Materials'] },
  { id: 'civil_eng', name: 'Civil Engineering', subs: ['Construction Management', 'Geotechnical', 'Structural Engineering', 'Transportation', 'Urban Infrastructure', 'Water Resources'] },
  { id: 'elec_eng', name: 'Electrical Engineering', subs: ['Control Systems', 'Electronics', 'Embedded Systems', 'Power Systems', 'Signal Processing', 'Telecommunications'] },
  { id: 'mech_eng', name: 'Mechanical Engineering', subs: ['Fluid Mechanics', 'HVAC', 'Manufacturing', 'Materials Science', 'Robotics', 'Thermodynamics'] },
  { id: 'soft_eng', name: 'Computer/Software Engineering', subs: ['Compilers', 'DevOps', 'Distributed Systems', 'Operating Systems', 'Software Architecture', 'Systems Programming'] },
  { id: 'biomed_eng', name: 'Biomedical Engineering', subs: ['Biomechanics', 'Medical Devices', 'Medical Imaging', 'Neural Engineering', 'Prosthetics', 'Tissue Engineering'] },
  { id: 'env_eng', name: 'Environmental Engineering', subs: ['Air Quality', 'Environmental Remediation', 'Sustainable Engineering', 'Waste Management', 'Water Treatment'] },
  { id: 'mechatronics', name: 'Mechatronics', subs: ['Automation', 'CNC & Manufacturing', 'Control Systems', 'Embedded Systems', 'Robotics', 'Sensors & Actuators'] },
  { id: 'cs', name: 'Computer Science', subs: ['Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Game Development', 'Machine Learning', 'Quantum Computing', 'Web Development'] },
  { id: 'medicine', name: 'Medicine & Health', subs: ['Cardiology', 'Genomics', 'Immunology', 'Mental Health', 'Neurology', 'Oncology', 'Public Health', 'Surgery'] },
  { id: 'biology', name: 'Biology', subs: ['Cell Biology', 'Ecology', 'Evolutionary Biology', 'Genetics', 'Marine Biology', 'Microbiology', 'Molecular Biology', 'Zoology'] },
  { id: 'chemistry', name: 'Chemistry', subs: ['Biochemistry', 'Inorganic Chemistry', 'Medicinal Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Polymer Chemistry'] },
  { id: 'physics', name: 'Physics', subs: ['Astrophysics', 'Condensed Matter', 'Nuclear Physics', 'Optics', 'Particle Physics', 'Quantum Mechanics', 'Thermodynamics'] },
  { id: 'psychology', name: 'Psychology', subs: ['Behavioral', 'Clinical', 'Cognitive', 'Developmental', 'Forensic', 'Neuropsychology', 'Social Psychology'] },
  { id: 'neuroscience', name: 'Neuroscience', subs: ['Brain-Computer Interfaces', 'Cognitive Neuroscience', 'Computational Neuroscience', 'Human Brain', 'Neuroplasticity'] },
  { id: 'math', name: 'Mathematics', subs: ['Abstract Algebra', 'Calculus & Analysis', 'Cryptography', 'Game Theory', 'Number Theory', 'Statistics', 'Topology'] },
  { id: 'astronomy', name: 'Astronomy & Space', subs: ['Astrobiology', 'Black Holes', 'Cosmology', 'Exoplanets', 'Space Exploration'] },
  { id: 'environment', name: 'Environmental Science', subs: ['Climate Change', 'Conservation', 'Ecology', 'Environmental Policy', 'Oceanography', 'Renewable Energy'] },
  { id: 'kinesiology', name: 'Kinesiology', subs: ['Biomechanics', 'Exercise Physiology', 'Motor Learning', 'Sports Medicine', 'Sports Psychology'] },
  { id: 'arts', name: 'Arts & Design', subs: ['Digital Art', 'Fashion Design', 'Film & Cinema', 'Graphic Design', 'Photography', 'Sculpture', 'UX/UI Design'] },
  { id: 'music', name: 'Music', subs: ['Classical', 'Electronic Music', 'Music Production', 'Music Theory', 'Sound Design'] },
  { id: 'literature', name: 'Literature & Writing', subs: ['Creative Writing', 'Literary Criticism', 'Poetry', 'Screenwriting', 'World Literature'] },
  { id: 'architecture', name: 'Architecture', subs: ['Landscape Architecture', 'Structural Design', 'Sustainable Architecture', 'Urban Planning'] },
  { id: 'philosophy', name: 'Philosophy', subs: ['Applied Ethics', 'Epistemology', 'Logic', 'Metaphysics', 'Philosophy of Mind', 'Political Philosophy'] },
  { id: 'history', name: 'History', subs: ['Ancient History', 'Art History', 'Cultural History', 'Military History', 'Modern History', 'Science History'] },
  { id: 'economics', name: 'Economics', subs: ['Behavioral Economics', 'Development Economics', 'Environmental Economics', 'Macroeconomics', 'Microeconomics'] },
  { id: 'business', name: 'Business', subs: ['Entrepreneurship', 'Finance & Investing', 'Marketing', 'Organizational Behavior', 'Strategy'] },
  { id: 'law', name: 'Law', subs: ['Constitutional Law', 'Criminal Law', 'Environmental Law', 'Intellectual Property', 'International Law'] },
  { id: 'polisci', name: 'Political Science', subs: ['Comparative Politics', 'Electoral Studies', 'Geopolitics', 'International Relations', 'Policy Studies'] },
  { id: 'social', name: 'Social Sciences', subs: ['Cultural Studies', 'Gender Studies', 'Human Geography', 'Migration Studies', 'Urban Studies'] },
  { id: 'anthropology', name: 'Anthropology', subs: ['Archaeology', 'Cultural Anthropology', 'Forensic Anthropology', 'Physical Anthropology'] },
  { id: 'linguistics', name: 'Linguistics', subs: ['Computational Linguistics', 'Language Acquisition', 'Phonetics', 'Psycholinguistics', 'Semantics'] },
  { id: 'education', name: 'Education', subs: ['Curriculum Design', 'Early Childhood', 'Educational Psychology', 'Higher Education', 'Special Education'] },
];

type FieldState = {
  selected: boolean;
  selectedSubs: Set<string>;
  expanded: boolean;
};

export default function InterestsPage() {
  const router = useRouter();
  const [titleAtTop, setTitleAtTop] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(
    Object.fromEntries(FIELDS.map(f => [f.id, { selected: false, selectedSubs: new Set(), expanded: false }]))
  );

  useEffect(() => {
    const t1 = setTimeout(() => setTitleAtTop(true), 800);
    const t2 = setTimeout(() => setShowGrid(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const toggleField = (id: string) => {
    setFieldStates(prev => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }));
  };

  const toggleSub = (fieldId: string, sub: string) => {
    setFieldStates(prev => {
      const next = new Set(prev[fieldId].selectedSubs);
      next.has(sub) ? next.delete(sub) : next.add(sub);
      return { ...prev, [fieldId]: { ...prev[fieldId], selectedSubs: next } };
    });
  };

  const toggleExpanded = (id: string) => {
    setFieldStates(prev => ({ ...prev, [id]: { ...prev[id], expanded: !prev[id].expanded } }));
  };

  const selectedCount = Object.values(fieldStates).filter(s => s.selected || s.selectedSubs.size > 0).length;

  return (
    <main className={styles.page}>
      <div className={`${styles.titleArea} ${titleAtTop ? styles.titleAtTop : ''}`}>
        <h1 className={`${styles.title} ${titleAtTop ? styles.titleSmall : ''}`}>
          Select your fields of interest
        </h1>
        <p className={`${styles.counter} ${titleAtTop ? styles.counterVisible : ''}`}>
          {selectedCount} selected &mdash; minimum 5
        </p>
      </div>

      <div className={`${styles.grid} ${showGrid ? styles.gridVisible : ''}`}>
        {FIELDS.map(field => {
          const state = fieldStates[field.id];
          const hasSelection = state.selected || state.selectedSubs.size > 0;

          return (
            <div key={field.id} className={styles.cardWrapper}>
              <div className={`${styles.card} ${hasSelection ? styles.cardSelected : ''}`}>
                <button
                  className={styles.expandBtn}
                  onClick={() => toggleExpanded(field.id)}
                  title="Explore sub-topics"
                >
                  {state.expanded ? '−' : '+'}
                </button>

                <button
                  className={`${styles.circle} ${state.selected ? styles.circleFilled : ''} ${!state.selected && state.selectedSubs.size > 0 ? styles.circlePartial : ''}`}
                  onClick={() => toggleField(field.id)}
                />

                <button className={styles.cardBody} onClick={() => toggleField(field.id)}>
                  {field.name}
                </button>
              </div>

              {state.expanded && (
                <div className={styles.dropdown}>
                  {field.subs.map(sub => (
                    <button
                      key={sub}
                      className={`${styles.subItem} ${state.selectedSubs.has(sub) ? styles.subItemSelected : ''}`}
                      onClick={() => toggleSub(field.id, sub)}
                    >
                      <span className={`${styles.subCircle} ${state.selectedSubs.has(sub) ? styles.subCircleFilled : ''}`} />
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`${styles.footer} ${selectedCount >= 5 ? styles.footerVisible : ''}`}>
        <button className={styles.continueBtn} onClick={() => router.push('/dashboard')}>
          Continue →
        </button>
      </div>
    </main>
  );
}
