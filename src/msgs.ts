export default {
  missingOpenTag: (tag: string) => `${tag} is missing its open tag`,
  noHeadTag: 'There seems to be no head tag in the output, emitting styles to start',
  noBodyTag: 'There seems to be no body tag in the output, emitting scripts to end',
};