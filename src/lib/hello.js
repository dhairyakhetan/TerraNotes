import { MEMBERS, TEAMS, teamsOf } from '../data/team.js';
import { SITE } from '../data/site.js';

// A hello for anyone who opens the browser console. Names come from src/data/team.js.
const names = (team) => MEMBERS.filter((m) => teamsOf(m).includes(team)).map((m) => m.name.split(' ')[0]).join(', ');

export function sayHello() {
  const title = "font: 900 34px 'Archivo Black', Impact, sans-serif; color: #2464D2; text-shadow: 2px 2px 0 #0B1330; letter-spacing: -1px;";
  const hand = "font: 18px 'Caveat', cursive; color: #5B3A1E;";
  const mono = "font: 12px 'Space Mono', monospace; color: #1E2723; line-height: 1.7;";
  console.log('%cAQUATERRA', title);
  console.log('%cnotes from where the land meets the water.', hand);
  console.log(
    `%cpoking around the pegs, are we? 👀\n\n` +
    `  ${TEAMS.tech.label.toLowerCase()}    built this: ${names('tech')}\n` +
    `  ${TEAMS.design.label.toLowerCase()}  gave it its look: ${names('design')}\n` +
    `  ${TEAMS.writing.label.toLowerCase()} filled the line: ${names('writing')}\n\n` +
    `found a bug, or want to help build the next one? say hi → instagram.com/${SITE.instagram}\n` +
    `(yes, the words game answers are in here somewhere. no, don't. play it properly.)`,
    mono,
  );
}
