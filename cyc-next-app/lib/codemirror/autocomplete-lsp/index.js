//using a customized version of autocomplete instead of @codemirror/autocomplete
import { autocompletion } from './autocomplete';
import { hoverTooltip } from '@codemirror/tooltip';
import { ViewPlugin } from '@codemirror/view';

import LanguageServerPlugin from './ls-plugin';
import { rootUri, documentUri, languageId, serverUri } from './source';
import { CompletionTriggerKind } from 'vscode-languageserver-protocol';
import { signatureTooltip } from './signature';
import { baseTheme } from './theme';

/**
 * `dfFilter` option is added to support dfFilter component.
 * if `dfFilter=true`, no connection to server is needed.
 */
function languageServer(options) {
    let plugin = null;
    return [
        serverUri.of(options.serverUri),
        rootUri.of(options.rootUri),
        documentUri.of(options.documentUri),
        languageId.of(options.languageId),
        ViewPlugin.define((view) => (plugin = new LanguageServerPlugin(view))),
        signatureTooltip(async (view, pos) => {
            var _a;
            return (_a =
                plugin === null || plugin === void 0
                    ? void 0
                    : await plugin.requestSignatureTooltip(offsetToPos(view.state.doc, pos))) !==
                null && _a !== void 0
                ? _a
                : null;
        }),
        hoverTooltip((view, pos) => {
            var _a;
            return (_a =
                plugin === null || plugin === void 0
                    ? void 0
                    : plugin.requestHoverTooltip(view, offsetToPos(view.state.doc, pos))) !==
                null && _a !== void 0
                ? _a
                : null;
        }),
        autocompletion({
            override: [
                async (context) => {
                    if (plugin == null) return null;
                    const { state, pos, explicit } = context;
                    const line = state.doc.lineAt(pos);
                    let [trigKind, trigChar] = getTrigger(plugin, line, explicit);

                    return await plugin.requestCompletion_CodeEditor(
                        context,
                        offsetToPos(state.doc, pos),
                        {
                            triggerKind: trigKind,
                            triggerCharacter: trigChar,
                        }
                    );
                },
            ],
        }),
        baseTheme,
    ];
}

function getTrigger(plugin, line, explicit, pos) {
    var _a, _b, _c;
    let trigKind = CompletionTriggerKind.Invoked;
    let trigChar;
    if (
        !explicit &&
        ((_c =
            (_b =
                (_a = plugin.capabilities) === null || _a === void 0
                    ? void 0
                    : _a.completionProvider) === null || _b === void 0
                ? void 0
                : _b.triggerCharacters) === null || _c === void 0
            ? void 0
            : _c.includes(line.text[pos - line.from - 1]))
    ) {
        trigKind = CompletionTriggerKind.TriggerCharacter;
        trigChar = line.text[pos - line.from - 1];
    }
    return [trigKind, trigChar];
}

/**
 * This is special language server for the DFFilter component.
 * Use this to take advantage of the autocompletion feature in CodeMirror.
 * This won't connect to the real language server, only autocomplete column
 * name when relevant
 */
function dfFilterLanguageServer(options) {
    let plugin = null;
    return [
        languageId.of(options.languageId),
        ViewPlugin.define((view) => (plugin = new LanguageServerPlugin(view, true))),
        autocompletion({
            override: [
                async (context) => {
                    if (plugin == null) return null;
                    const { state, pos, explicit } = context;
                    const line = state.doc.lineAt(pos);
                    let [trigKind, trigChar] = getTrigger(plugin, line, explicit, pos);

                    if (
                        trigKind === CompletionTriggerKind.Invoked &&
                        !context.matchBefore(/[\w'"]+$/)
                    )
                        return null; //added match for ' and "

                    return await plugin.requestCompletion_DFFilter(
                        context,
                        offsetToPos(state.doc, pos),
                        {
                            triggerKind: trigKind,
                            triggerCharacter: trigChar,
                        }
                    );
                },
            ],
        }),
    ];
}

function offsetToPos(doc, offset) {
    const line = doc.lineAt(offset);
    return {
        line: line.number - 1,
        character: offset - line.from,
    };
}

export { languageServer, dfFilterLanguageServer };
