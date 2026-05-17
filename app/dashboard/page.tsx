'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Dashboard.module.css';

const FIELDS = [
  { id: 'engineering', name: 'Engineering', subs: ['AI & Robotics', 'Aerospace', 'Biomedical', 'Civil', 'Electrical', 'Mechanical', 'Nanotechnology', 'Nuclear', 'Software', 'Structural'] },
  { id: 'cs', name: 'Computer Science', subs: ['Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Game Development', 'Machine Learning', 'Networking', 'Quantum Computing', 'Software Engineering', 'Systems', 'Web Development'] },
  { id: 'medicine', name: 'Medicine & Health', subs: ['Cardiology', 'Dermatology', 'Genomics', 'Immunology', 'Mental Health', 'Neurology', 'Oncology', 'Pharmacology', 'Public Health', 'Surgery'] },
  { id: 'life', name: 'Life Sciences', subs: ['Biochemistry', 'Cell Biology', 'Ecology', 'Evolutionary Biology', 'Genetics', 'Marine Biology', 'Microbiology', 'Molecular Biology', 'Physiology', 'Zoology'] },
  { id: 'psychology', name: 'Psychology', subs: ['Behavioral', 'Clinical', 'Cognitive', 'Developmental', 'Forensic', 'Health Psychology', 'Neuropsychology', 'Positive Psychology', 'Social', 'Sports Psychology'] },
  { id: 'neuroscience', name: 'Neuroscience', subs: ['Brain-Computer Interfaces', 'Cognitive Neuroscience', 'Computational Neuroscience', 'Human Brain', 'Memory & Learning', 'Neuroplasticity', 'Neuropsychology', 'Psychopharmacology', 'Sensory Systems', 'Sleep Science'] },
  { id: 'physics', name: 'Physics', subs: ['Astrophysics', 'Atomic Physics', 'Condensed Matter', 'Nuclear Physics', 'Optics', 'Particle Physics', 'Quantum Mechanics', 'Relativity', 'Thermodynamics', 'Wave Physics'] },
  { id: 'math', name: 'Mathematics', subs: ['Abstract Algebra', 'Calculus & Analysis', 'Cryptography', 'Discrete Math', 'Game Theory', 'Geometry', 'Number Theory', 'Probability', 'Statistics', 'Topology'] },
  { id: 'chemistry', name: 'Chemistry', subs: ['Analytical Chemistry', 'Biochemistry', 'Environmental Chemistry', 'Inorganic Chemistry', 'Medicinal Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Polymer Chemistry', 'Spectroscopy', 'Thermochemistry'] },
  { id: 'astronomy', name: 'Astronomy & Space', subs: ['Astrobiology', 'Astrophysics', 'Black Holes', 'Cosmology', 'Dark Matter', 'Exoplanets', 'Planetary Science', 'Space Exploration', 'Space Technology', 'Stellar Evolution'] },
  { id: 'environment', name: 'Environmental Science', subs: ['Climate Change', 'Conservation', 'Ecology', 'Environmental Policy', 'Geoscience', 'Hydrology', 'Oceanography', 'Renewable Energy', 'Soil Science', 'Wildlife Biology'] },
  { id: 'kinesiology', name: 'Kinesiology', subs: ['Athletic Training', 'Biomechanics', 'Exercise Physiology', 'Human Movement', 'Motor Learning', 'Nutrition & Performance', 'Physical Therapy', 'Rehabilitation', 'Sports Medicine', 'Sports Psychology'] },
  { id: 'arts', name: 'Arts & Design', subs: ['Animation', 'Digital Art', 'Fashion Design', 'Film & Cinema', 'Graphic Design', 'Industrial Design', 'Interior Design', 'Photography', 'Sculpture', 'UX/UI Design'] },
  { id: 'music', name: 'Music', subs: ['Acoustics', 'Classical Music', 'Electronic Music', 'Ethnomusicology', 'Jazz', 'Music Production', 'Music Psychology', 'Music Theory', 'Sound Design', 'World Music'] },
  { id: 'literature', name: 'Literature & Writing', subs: ['Creative Writing', 'Journalism', 'Literary Criticism', 'Mythology', 'Poetry', 'Rhetoric', 'Screenwriting', 'Translation', 'World Literature', 'Young Adult Fiction'] },
  { id: 'architecture', name: 'Architecture', subs: ['Architectural History', 'Building Technology', 'Interior Architecture', 'Landscape Architecture', 'Structural Design', 'Sustainable Architecture', 'Urban Design', 'Urban Planning', 'Virtual Architecture', 'Housing'] },
  { id: 'philosophy', name: 'Philosophy', subs: ['Applied Ethics', 'Epistemology', 'Existentialism', 'Logic', 'Metaphysics', 'Philosophy of Mind', 'Philosophy of Science', 'Political Philosophy', 'Social Philosophy', 'Philosophy of Language'] },
  { id: 'history', name: 'History', subs: ['Ancient History', 'Art History', 'Colonial History', 'Cultural History', 'Economic History', 'Military History', 'Modern History', 'Political History', 'Religious History', 'Science History'] },
  { id: 'economics', name: 'Economics', subs: ['Behavioral Economics', 'Development Economics', 'Econometrics', 'Environmental Economics', 'Financial Economics', 'Game Theory', 'International Economics', 'Labour Economics', 'Macroeconomics', 'Microeconomics'] },
  { id: 'business', name: 'Business', subs: ['Accounting', 'Entrepreneurship', 'Finance & Investing', 'Human Resources', 'International Business', 'Leadership', 'Marketing', 'Operations', 'Organizational Behavior', 'Strategy'] },
  { id: 'law', name: 'Law', subs: ['Business Law', 'Constitutional Law', 'Criminal Law', 'Environmental Law', 'Human Rights Law', 'Immigration Law', 'Intellectual Property', 'International Law', 'Medical Law', 'Tax Law'] },
  { id: 'polisci', name: 'Political Science', subs: ['Comparative Politics', 'Electoral Studies', 'Geopolitics', 'Governance', 'International Relations', 'Political Theory', 'Policy Studies', 'Public Administration', 'Security Studies', 'Social Movements'] },
  { id: 'social', name: 'Social Sciences', subs: ['Cultural Studies', 'Demography', 'Gender Studies', 'Human Geography', 'Media Studies', 'Migration Studies', 'Race & Ethnicity', 'Rural Studies', 'Science & Technology Studies', 'Urban Studies'] },
  { id: 'anthropology', name: 'Anthropology', subs: ['Archaeology', 'Biological Anthropology', 'Cultural Anthropology', 'Forensic Anthropology', 'Linguistic Anthropology', 'Medical Anthropology', 'Paleoanthropology', 'Social Anthropology', 'Visual Anthropology', 'Primatology'] },
  { id: 'linguistics', name: 'Linguistics', subs: ['Applied Linguistics', 'Computational Linguistics', 'Discourse Analysis', 'Language Acquisition', 'Phonetics', 'Pragmatics', 'Psycholinguistics', 'Semantics', 'Sociolinguistics', 'Syntax'] },
  { id: 'education', name: 'Education', subs: ['Curriculum Design', 'Early Childhood', 'Educational Psychology', 'Educational Technology', 'Higher Education', 'Inclusive Education', 'Language Education', 'STEM Education', 'Special Education', 'Teacher Training'] },
  { id: 'sociology', name: 'Sociology', subs: ['Crime & Deviance', 'Cultural Sociology', 'Environmental Sociology', 'Family Studies', 'Health Sociology', 'Inequality & Stratification', 'Political Sociology', 'Religion & Society', 'Social Networks', 'Work & Organizations'] },
];

type FieldState = {
  selected: boolean;
  selectedSubs: Set<string>;
  expanded: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(
    Object.fromEntries(FIELDS.map(f => [f.id, { selected: false, selectedSubs: new Set(), expanded: false }]))
  );
  const [error, setError] = useState(false);

  const toggleField = (id: string) => {
    setError(false);
    setFieldStates(prev => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }));
  };

  const toggleSub = (fieldId: string, sub: string) => {
    setError(false);
    setFieldStates(prev => {
      const next = new Set(prev[fieldId].selectedSubs);
      next.has(sub) ? next.delete(sub) : next.add(sub);
      return { ...prev, [fieldId]: { ...prev[fieldId], selectedSubs: next } };
    });
  };

  const toggleExpanded = (id: string) => {
    setFieldStates(prev => ({ ...prev, [id]: { ...prev[id], expanded: !prev[id].expanded } }));
  };

  const hasAnySelection = Object.values(fieldStates).some(s => s.selected || s.selectedSubs.size > 0);

  const handleNext = async () => {
    if (!hasAnySelection) { setError(true); return; }

    // Build flat list of selections to save
    const selections: { fieldId: string; fieldName: string; subTopic?: string }[] = [];
    FIELDS.forEach(field => {
      const state = fieldStates[field.id];
      if (state.selected) {
        selections.push({ fieldId: field.id, fieldName: field.name });
      }
      state.selectedSubs.forEach(sub => {
        selections.push({ fieldId: field.id, fieldName: field.name, subTopic: sub });
      });
    });

    await fetch('/api/save-interests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections }),
    });

    router.push('/welcome');
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Explore</h1>
        <p className={styles.sub}>Select the fields you want articles from</p>
      </div>

      <div className={styles.grid}>
        {FIELDS.map(field => {
          const state = fieldStates[field.id];
          const hasSelection = state.selected || state.selectedSubs.size > 0;

          return (
            <div key={field.id} className={styles.cardWrapper}>
              <div className={`${styles.card} ${hasSelection ? styles.cardSelected : ''}`}>
                <button
                  className={styles.expandBtn}
                  onClick={() => toggleExpanded(field.id)}
                >
                  {state.expanded ? '−' : '+'}
                </button>

                {hasSelection && <span className={styles.checkmark}>✓</span>}

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
                      <span className={`${styles.subCheck} ${state.selectedSubs.has(sub) ? styles.subCheckFilled : ''}`}>
                        {state.selectedSubs.has(sub) ? '✓' : ''}
                      </span>
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        {error && <p className={styles.error}>Please select at least one field before continuing.</p>}
        <button className={styles.nextBtn} onClick={handleNext}>Next →</button>
      </div>
    </main>
  );
}
