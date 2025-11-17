
import { ElementsMap, ComprehensionQuestion } from '../types';

import { STORM_ELEMENTS, STORM_VALID_CAUSE_COMBOS, STORM_INITIAL_AVAILABLE_ELEMENTS } from './storm';
import { CIRCUITS_ELEMENTS, CIRCUITS_VALID_CAUSE_COMBOS, CIRCUITS_INITIAL_AVAILABLE_ELEMENTS } from './circuits';
import { MATH_LOGIC_ELEMENTS, MATH_LOGIC_VALID_CAUSE_COMBOS, MATH_LOGIC_INITIAL_AVAILABLE_ELEMENTS } from './mathLogic';
import { CELL_ELEMENTS, CELL_VALID_CAUSE_COMBOS, CELL_INITIAL_AVAILABLE_ELEMENTS } from './cellDivision';
import { ENGLISH_LOGIC_ELEMENTS, ENGLISH_LOGIC_VALID_CAUSE_COMBOS, ENGLISH_LOGIC_INITIAL_AVAILABLE_ELEMENTS } from './englishLogic';

interface LevelData {
  elements: ElementsMap;
  combos: { [effectId: string]: { combos: string[][]; phrase: string; }; };
  initial: Set<string>;
  title: string;
  description: string;
  story?: string;
  videoUrl?: string;
  comprehensionQuestions?: ComprehensionQuestion[];
}

export const levelData: Record<string, LevelData> = {
  storm: {
    elements: STORM_ELEMENTS,
    combos: STORM_VALID_CAUSE_COMBOS,
    initial: STORM_INITIAL_AVAILABLE_ELEMENTS,
    title: 'Level 1: How a Storm Forms',
    description: 'Connect the ingredients of a thunderstorm to see how they create dangerous weather.',
    videoUrl: 'https://www.youtube.com/watch?v=pcZn3dGWQ-U',
    comprehensionQuestions: [
        { question: "Thunderstorms need moisture, unstable air, and lift to form.", answer: true },
        { question: "Unstable air is when cold, moist air is near the ground.", answer: false },
        { question: "Updrafts are downward winds in a thunderstorm.", answer: false },
        { question: "The most dangerous stage of a storm is when updrafts and downdrafts happen at the same time.", answer: true },
        { question: "A storm strengthens when it runs out of updrafts.", answer: false }
    ],
    story: `Moisture in the air, Unstable air, and Lift Because of these ingredients, a storm cloud begins to form. a storm cloud begins to form This leads to strong winds move up and down inside the cloud. strong winds move up and down inside the cloud which results in dangerous weather like heavy rain and strong winds. dangerous weather like heavy rain and strong winds As a result, trees might get blown down.`
  },
  circuits: {
    elements: CIRCUITS_ELEMENTS,
    combos: CIRCUITS_VALID_CAUSE_COMBOS,
    initial: CIRCUITS_INITIAL_AVAILABLE_ELEMENTS,
    title: 'Level 2: How Circuits Work',
    description: 'Watch the video to learn the basics of circuits, then build a chain to light up a bulb.',
    videoUrl: 'https://www.youtube.com/watch?v=R3hdaLpq2AA',
    comprehensionQuestions: [
        { question: "Potential difference, also known as voltage, is the force driving the flow of electrons.", answer: true },
        { question: "An electrical circuit must be a closed loop.", answer: true },
        { question: "Resistance is something that stops or opposes the flow of electrons.", answer: true },
        { question: "Current is a measure of the flow of electrons, measured in Amps.", answer: true },
        { question: "Conventional current flows from the negative terminal to the positive one.", answer: false }
    ],
    story: `A power source providing potential difference (voltage) establishes voltage being established across the circuit. a wire forming a closed loop for electrons to flow, a switch being closed to complete the circuit, and conductive material allowing electron movement combine to form a complete conductive path being formed. voltage being established across the circuit and a complete conductive path being formed together result in electric current flowing through the circuit. electric current flowing through the circuit and a component (like a lamp) adding resistance flowing through resistance causes electrons colliding with atoms in the resistance. electrons colliding with atoms in the resistance which leads to electrical energy converting to heat and light. electrical energy converting to heat and light producing the result that the bulb emitting light (e.g., a flashlight turning on). electrical energy converting to heat and light also resulting in the circuit component producing heat. Separately, an open circuit preventing electron flow prevents flow, so no current flowing.`
  },
  math: {
    elements: MATH_LOGIC_ELEMENTS,
    combos: MATH_LOGIC_VALID_CAUSE_COMBOS,
    initial: MATH_LOGIC_INITIAL_AVAILABLE_ELEMENTS,
    title: 'Level 3: Math Logic Problem',
    description: 'Solve a word problem by building a chain of calculations. You must select the correct data and operations while ignoring irrelevant information.',
    // No story for this level, as text analysis is not appropriate for the problem-solving format.
  },
  cell: {
    elements: CELL_ELEMENTS,
    combos: CELL_VALID_CAUSE_COMBOS,
    initial: CELL_INITIAL_AVAILABLE_ELEMENTS,
    title: 'Level 4: Cell Division',
    description: 'Discover the stages of mitosis. See how one event triggers others, sometimes creating multiple effects, to divide a cell.',
    story: `a cell receiving a growth signal triggers the DNA replicating. the DNA replicating allowing chromosomes condensing. chromosomes condensing followed by the nuclear envelope dissolving. chromosomes condensing and spindle fibers forming. the nuclear envelope dissolving and spindle fibers forming so that chromosomes aligning at the center. chromosomes aligning at the center next sister chromatids separating. sister chromatids separating resulting in two new nuclei forming. sister chromatids separating while the the cell membrane pinching inward. two new nuclei forming and the cell membrane pinching inward to finally create two identical daughter cells being created.`
  },
  english: {
      elements: ENGLISH_LOGIC_ELEMENTS,
      combos: ENGLISH_LOGIC_VALID_CAUSE_COMBOS,
      initial: ENGLISH_LOGIC_INITIAL_AVAILABLE_ELEMENTS,
      title: "Level 5: Why did George do it?",
      description: "Analyze the climax of 'Of Mice and Men'. Use the text to build the strongest argument for George's final decision. Beware of misleading paths and incomplete conclusions!",
      story: `Lennie's love for soft things and Curley’s wife being lonely and seeking conversation leads to the moment of Curley's wife letting him stroke her hair. Curley's wife letting him stroke her hair but this combined with Lennie not understanding his own strength tragically results in Lennie panicking when she tried to pull away. Lennie panicking when she tried to pull away tragically results in Lennie accidentally killing her. Lennie accidentally killing her means their dream of a farm being impossible. Lennie accidentally killing her and Curley wanting brutal revenge, not justice means Curley gathering men to hunt Lennie down. Curley gathering men to hunt Lennie down means George knowing what the mob would do to Lennie. George knowing what the mob would do to Lennie leads to George providing a final, tragic act of mercy. George providing a final, tragic act of mercy and their dream of a farm being impossible proving that George's action being a tragic mercy killing, an act of love to spare his friend from a brutal fate.`
  }
};