const assert = require('assert')
const {window, workspace, commands, Position, Selection} = require('vscode')
const {getCoreSettings} = require('../vscode/dist/Extension.js')

const testSettings = async (language, expected) => {
    const doc = await workspace.openTextDocument({language, content: ""})
    const editor = await window.showTextDocument(doc)
    const actual = getCoreSettings(editor, cs => cs[0])
    assert.deepStrictEqual(actual, expected)
}

const settingsData = {
    plaintext: {
        column: 45,
        doubleSentenceSpacing: true,
        wholeComment: false,
        reformat: true,
        tabWidth: 2,
    },
    markdown: {
        column: 60,
        doubleSentenceSpacing: false,
        wholeComment: true,
        reformat: false,
        tabWidth: 6,
    },
}

exports.run = async () => {
    // breaks when run in parallel (Promise.all)
    for(const [l, e] of Object.entries(settingsData)) { await testSettings(l,e) }
    await testForceCommand()

}

async function testForceCommand() {
    const line = 'one two three four five six seven eight nine ten eleven twelve'
    const content = ['```text', line, '', line, '```'].join('\n')
    const document = await workspace.openTextDocument({language: 'markdown', content})
    const editor = await window.showTextDocument(document)
    editor.selections = [1, 3].map(i => new Selection(new Position(i, 4), new Position(i, 4)))

    // The original command must still leave fenced text alone.
    await commands.executeCommand('rewrap.rewrapComment')
    assert.strictEqual(document.getText(), content)

    // Text-editor command callbacks apply edits asynchronously.
    const changed = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            subscription.dispose()
            reject(new Error('Force Rewrap did not change the document'))
        }, 10000)
        const subscription = workspace.onDidChangeTextDocument(event => {
            if (event.document !== document || !event.contentChanges.length) return
            clearTimeout(timer)
            subscription.dispose()
            resolve()
        })
    })
    await commands.executeCommand('rewrap.forceRewrap')
    await changed
    // Allow the editor to restore selections after applying the edit.
    await new Promise(resolve => setTimeout(resolve, 100))
    const wrapped = 'one two three four five six seven eight nine ten eleven\ntwelve'
    assert.strictEqual(document.getText(), ['```text', wrapped, '', wrapped, '```'].join('\n'))
    assert.strictEqual(document.languageId, 'markdown')
    assert.strictEqual(editor.selections.length, 2)
    for (const selection of editor.selections) {
        assert.strictEqual(document.lineAt(selection.active.line).text.slice(selection.active.character, selection.active.character + 3), 'two')
    }
    await commands.executeCommand('undo')
    assert.strictEqual(document.getText(), content)
}
