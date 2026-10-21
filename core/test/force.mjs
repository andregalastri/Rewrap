import assert from 'node:assert/strict'
import {rewrap, rewrapForced, noCustomMarkers} from '../dist/dev/Main.js'

const settings = {
  column: 12, tabWidth: 4, doubleSentenceSpacing: false,
  reformat: false, wholeComment: true,
}
const point = (line, character = 0) => ({line, character})
const cursor = line => ({anchor: point(line), active: point(line)})
const range = (start, end, character = 0) => ({anchor: point(start), active: point(end, character)})
const file = {path: 'example.md', language: 'markdown', getMarkers: () => noCustomMarkers}
let passed = 0

function check(name, input, expected, selections = [], options = {}, force = true) {
  const lines = input.split('\n')
  const getLine = i => i < lines.length ? lines[i] : null
  const config = {...settings, ...options}
  const edit = force
    ? rewrapForced(config, selections, getLine)
    : rewrap(file, config, selections, getLine)
  const actual = [
    ...lines.slice(0, edit.startLine), ...edit.lines, ...lines.slice(edit.endLine + 1),
  ].join('\n')
  assert.equal(actual, expected, name)
  assert.deepEqual(edit.selections, selections, `${name}: selections retained for editor mapping`)
  passed++
}

const text = 'one two three four five six'
const wrapped = 'one two\nthree four\nfive six'
check('cursor inside a fence', `before\n\`\`\`text\n${text}\n\`\`\`\nafter`,
  `before\n\`\`\`text\n${wrapped}\n\`\`\`\nafter`, [cursor(2)])
check('whole document keeps adjacent fence lines', `before\n\`\`\`text\n${text}\n\`\`\`\nafter`,
  `before\n\`\`\`text\n${wrapped}\n\`\`\`\nafter`)
check('tilde and indented fence delimiters', `  ~~~~ text\n${text}\n  ~~~~`,
  `  ~~~~ text\n${wrapped}\n  ~~~~`)
check('long fence language label remains intact', `\`\`\`some-very-long-language-name\n${text}\n\`\`\``,
  `\`\`\`some-very-long-language-name\n${wrapped}\n\`\`\``)
check('unclosed fence', `\`\`\`\n${text}`, `\`\`\`\n${wrapped}`)
check('indented code', `    ${text}`, '    one two\n    three\n    four\n    five six')
check('source code is ordinary text', 'const value = one + two + three;',
  'const value\n= one + two\n+ three;')
check('Markdown headings are ordinary text', '# one two three four five', '# one two\nthree four\nfive')
check('selection affects only selected lines and excludes end at column zero',
  `\`\`\`\n${text}\n${text}\n\`\`\``, `\`\`\`\n${wrapped}\n${text}\n\`\`\``, [range(1, 2)])
check('reversed selection', `\`\`\`\n${text}\n${text}\n\`\`\``,
  `\`\`\`\n${wrapped}\n${text}\n\`\`\``, [{anchor: point(2), active: point(1)}])
check('multiple cursors in separate paragraphs', `\`\`\`\n${text}\n\n${text}\n\`\`\``,
  `\`\`\`\n${wrapped}\n\n${wrapped}\n\`\`\``, [cursor(1), cursor(3)])
check('blank lines and trailing newline', `${text}\n\n${text}\n`, `${wrapped}\n\n${wrapped}\n`)
check('configured width', text, 'one two three four\nfive six', [], {column: 18})
check('explicit hard breaks', 'one two  \nthree four', 'one two  \nthree four')
check('empty document', '', '', [cursor(0)])
check('normal command still preserves code blocks', `\`\`\`\n${text}\n\`\`\``,
  `\`\`\`\n${text}\n\`\`\``, [cursor(1)], {}, false)
console.log(`Forced wrapping: ${passed} regression tests passed`)
