import React, { forwardRef, RefObject, SyntheticEvent, useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import {RecvCodeOutput, Message, DataTableContent, WebAppEndpoint, ContentType, CommandName} from "../../interfaces/IApp";

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setTableData } from "../../../redux/reducers/DataFramesRedux";
import { update as vizDataUpdate } from "../../../redux/reducers/vizDataSlice";
import shortid from "shortid";
import store from '../../../redux/store';
import socket from "../Socket";

// import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "@codemirror/basic-setup";
import { bracketMatching } from "@codemirror/matchbrackets";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { oneDark } from "@codemirror/theme-one-dark";
// import { python } from '@codemirror/lang-python';
import { python } from "../../codemirror-grammar/lang-cnext-python";
import {keymap, EditorView, ViewUpdate, DecorationSet, Decoration} from "@codemirror/view"
import { indentUnit } from "@codemirror/language";
import { lineNumbers, gutter, GutterMarker } from "@codemirror/gutter";
import { CodeEditMarker, StyledCodeEditor, StyledCodeMirror } from "../StyledComponents";
import { languageServer } from "codemirror-languageserver";
import { addPlotResult, initCodeDoc, updateLines, setLineStatus, setActiveLine, setLineGroupStatus, setRunQueue as setReduxRunQueue, compeleteRunLine } from "../../../redux/reducers/CodeEditorRedux";
import { ICodeLineStatus as ILineStatus, ICodeResultMessage, ILineUpdate, ILineContent, LineStatus, MessageMetaData, ICodeLineStatus, ICodeLine, ICodeLineGroupStatus, SetLineGroupCommand, RunQueueStatus, ILineRange } from "../../interfaces/ICodeEditor";
import { EditorSelection, EditorState, SelectionRange, StateEffect, StateField, Transaction, TransactionSpec } from "@codemirror/state";
import { keyframes } from "styled-components";
// import { extensions } from './codemirror-extentions/extensions';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { CodeGenResult, CodeGenStatus, IInsertLinesInfo, IMagicInfo, LINE_SEP, MagicPlotData, MAGIC_STARTER, TextRange } from "../../interfaces/IMagic";
import { magicsGetPlotCommand } from "../../cnext-magics/magic-plot-gen";
import { CNextPlotKeyword, CNextDataFrameExpresion, CNextPlotExpression, CNextPlotXDimExpression, CNextPlotYDimExpression, CNextXDimColumnNameExpression, CNextYDimColumnNameExpression } from "../../codemirror-grammar/cnext-python.terms";

const ls = languageServer({
    serverUri: "ws://localhost:3001/python",
    rootUri: 'file:///',
    documentUri: 'file:///',
    languageId: 'python'
});
  
// const CodeEditorComponent = React.memo((props: {recvCodeOutput: RecvCodeOutput}) => {
const CodeEditor = (props: any) => {
    const [initialized, setInitialized] = useState(false);
    const codeLines: ICodeLine[] = useSelector(state => state.codeEditor.codeLines);
    const inViewID = useSelector(state => state.fileManager.inViewID);
    const codeText = useSelector(state => state.codeEditor.text);    
    const runQueue = useSelector(state => state.codeEditor.runQueue);
    const dispatch = useDispatch();
    const editorRef = useRef();
    const [magicInfo, setMagicInfo] = useState<IMagicInfo | undefined>();
    
    const _handlePlotData = (message: Message) => {
        console.log(`${WebAppEndpoint.CodeEditor} got plot data`);
        let result: ICodeResultMessage = {
            content: message.content, 
            type: message.content_type,
            metadata: message.metadata
        };

        // content['plot'] = JSON.parse(content['plot']);      
        console.log("dispatch plot data");                  
        dispatch(addPlotResult(result));     
    }

    /**
     * Init component socket connection. This should be run only once on the first mount.
     */
    function _socketInit(){
        socket.emit("ping", WebAppEndpoint.CodeEditor);
        socket.on(WebAppEndpoint.CodeEditor, (result: string) => {
            // console.log("Got results: ", result, '\n');
            console.log("CodeEditor got results...");
            try {
                let codeOutput: Message = JSON.parse(result);                
                if (codeOutput.content_type == ContentType.STRING){
                    props.recvCodeOutput(codeOutput); //TODO: move this to redux
                } else {
                    if(codeOutput.error==true){
                        props.recvCodeOutput(codeOutput);
                    } else if (codeOutput.content_type==ContentType.PANDAS_DATAFRAME){
                        console.log("dispatch tableData");               
                        dispatch(setTableData(codeOutput.content));
                    } else if (codeOutput.content_type==ContentType.PLOTLY_FIG){
                        // _handlePlotData(codeOutput); 
                        _handlePlotData(codeOutput);                       
                    }
                    else {  
                        console.log("dispatch text output:", codeOutput);                        
                        props.recvCodeOutput(codeOutput);
                    }
                }
                let lineStatus: ILineStatus = {lineNumber: codeOutput.metadata.line_number, status: LineStatus.EXECUTED};
                dispatch(setLineStatus(lineStatus));
                /** set active code line to be the current line after it is excuted so the result will be show accordlingly
                 * not sure if this is a good design but will live with it for now */ 
                dispatch(setActiveLine(codeOutput.metadata.line_number)); 
                dispatch(compeleteRunLine(null));
            } catch {

            }
        });
    }
    useEffect(() => {
        _socketInit();
    }, []); 


    /**
     * FIXME: This is used to set onmousedown event handler. This does not seem to be the best way. 
     * Also set the SOLID effect for generated lines
     * */
    function _setCMPropertyOnMount(){
        let cm: ReactCodeMirrorRef = editorRef.current;                
        if (cm && cm.editor){
            cm.editor.onmousedown = onMouseDown;        

            if (cm.view) {
                cm.view.dispatch({effects: [StateEffect.appendConfig.of([generatedCodeDeco])]});
                cm.view.dispatch({effects: [generatedCodeStateEffect.of({type: GenCodeEffectType.SOLID})]});             
            }            
        }  
    }
    useEffect(() => {
        _setCMPropertyOnMount();
    });
    
    /**
     * Reset the code editor state when the doc is selected to be in view
     * */
    useEffect(() => {
        if(editorRef.current.view){
            setInitialized(false);
            // clear the state
            editorRef.current.view.setState(EditorState.create({doc: '', extensions: extensions}));
        }
    }, [inViewID]);

    /**
     * Init CodeEditor value with content load from the file if `initilized` is False
     */
    function _initCM(cm: ReactCodeMirrorRef){
        cm.view ? cm.view.setState(EditorState.create({doc: codeText.join('\n'), extensions: extensions})) : null;
    }
    useEffect(() => {
        let cm: ReactCodeMirrorRef = editorRef.current;
        if (cm && cm.view && !initialized){            
            _initCM(cm);
            setInitialized(true);
        }
    }, [codeText]);

    function _create_message(content: ILineContent) {
        let message: Message = {
            webapp_endpoint: WebAppEndpoint.CodeEditor,
            command_name: CommandName.code_area_command,
            seq_number: 1,
            content: content.content,
            content_type: ContentType.STRING,
            error: false,
            metadata: {line_number: content.lineNumber}
        };
        
        return message;
    }

    function _send_message(content: ILineContent) {
        let message = _create_message(content);
        console.log(`send ${WebAppEndpoint.CodeEditor} message: `, message);
        socket.emit(message.webapp_endpoint, JSON.stringify(message));
    }

    /**
     * Important: the line number in the result will be 0-based indexed instead of 1-based index
     * @param editorView 
     * @returns 
     */
     function _getLineContent(editorView: EditorView): ILineContent {
        const doc = editorView.state.doc;
        const state = editorView.state;
        const anchor = state.selection.ranges[0].anchor;
        let line = doc.lineAt(anchor);
        let text: string = line.text;        
        let result: ILineContent;

        if(text.startsWith(MAGIC_STARTER)){
            let lines: ICodeLineStatus[] = store.getState().codeEditor.codeLines;            
            /** note that because the CM line index is 0-based, this if condition is looking at the next line*/
            if (lines[line.number].generated){
                line = doc.line(line.number+1);
                text = line.text;
            }
        } 

        console.log('Code line to run: ', text);
        // convert the line number to 0-based index, which is what we use internally
        result = {lineNumber: line.number-1, content: text}; 
        return result;
    }

    function runLine(editorView: EditorView) {
        let content: ILineContent = _getLineContent(editorView);
        _send_message(content);
        let lineStatus: ILineStatus = {lineNumber: content.lineNumber, status: LineStatus.EXECUTING};
        dispatch(setLineStatus(lineStatus));
        return true;
    }

    /** Functions that support runQueue */
    function _getLineContent2(lineNumber: number): string|undefined {
        let cm: ReactCodeMirrorRef = editorRef.current; 
        let text: string|undefined;
        if (cm && cm.view){ 
            const doc = cm.view.state.doc;
            /** convert lineNumber to 1-based */
            // console.log('CodeEditor', cm, doc, doc.line(10));
            let line = doc.line(lineNumber+1);
            text = line.text;         
            console.log('CodeEditor _getLineContent2 code line to run: ', lineNumber+1, text);
            // convert the line number to 0-based index, which is what we use internally
        }
        return text;
    }

    function setRunQueue(editorView: EditorView): boolean {
        const doc = editorView.state.doc;
        const state = editorView.state;
        const anchor = state.selection.ranges[0].anchor;
        let lineAtAnchor = doc.lineAt(anchor);
        let text: string = lineAtAnchor.text;   
        let lineNumberAtAnchor = lineAtAnchor.number - 1;     
        /** convert to 0-based which is used internally */
        let fromLine = doc.lineAt(anchor).number-1;
        let lineRange: ILineRange|undefined;

        if(text.startsWith(MAGIC_STARTER)){
            /** Get line range of group starting from next line */
            let codeEditorReduxLines: ICodeLineStatus[] = store.getState().codeEditor.codeLines;            
            /** this if condition is looking at the next line*/
            if (codeEditorReduxLines[lineNumberAtAnchor+1].generated){
                lineRange = _getLineRangeOfGroup(lineNumberAtAnchor+1);
            }
        } else {
            /** Get line range of group starting from the current line */
            /** convert to 0-based */
            lineRange = _getLineRangeOfGroup(lineNumberAtAnchor);
        }

        if (lineRange){
            console.log('CodeEditor setRunQueue: ', lineRange);
            dispatch(setReduxRunQueue(lineRange));
        }
        return true;
    }

    function execLine(){
        if(runQueue.status === RunQueueStatus.RUNNING){
            let text: string|undefined = _getLineContent2(runQueue.runningLine);
            if(text){
                console.log('CodeEditor execLine: ', runQueue.runningLine);
                let content: ILineContent = {lineNumber: runQueue.runningLine, content: text};
                _send_message(content);
                let lineStatus: ILineStatus = {lineNumber: content.lineNumber, status: LineStatus.EXECUTING};
                dispatch(setLineStatus(lineStatus));
            }
        }
    }
    useEffect(()=>{
        execLine()
    },[runQueue])
    /** */
    
    function onMouseDown(event){
        try {
            //Note: can't use editorRef.current.state.doc, this one is useless, did not update with the doc.
            let doc = editorRef.current.view.viewState.state.doc;
            let pos = editorRef.current.view.posAtDOM(event.target);
            // console.log(doc, pos, lineNumber);
            //convert to 0-based
            let lineNumber = doc.lineAt(pos).number-1;        
            dispatch(setActiveLine(lineNumber));        
        } catch(error) {
            console.log(error);
            console.trace();
        }
        
    }

    /** this will force the CodeMirror to refresh when codeLines update. Need this to make the gutter update 
     * with line status. This works but might need to find a better performant solution. */ 
    useEffect(() => {
        let cm: ReactCodeMirrorRef = editorRef.current;   
        if(cm && cm.view){            
            cm.view.dispatch();
        }         
    }, [codeLines]);
    
    /**
     * Any code change after initialization will be handled by this function
     * @param value 
     * @param viewUpdate 
     */
    function onCMChange(value: string, viewUpdate: ViewUpdate){
        try{
            let doc = viewUpdate.state.doc;    
            if (initialized){                
                // let startText = viewUpdate.startState.doc.text;
                // let text = viewUpdate.state.doc.text;
                let startDoc = viewUpdate.startState.doc;
                // let doc = viewUpdate.state.doc
                let text: string[] = doc.toJSON();
                // let startLineLength = (typeof startDoc == TextLeaf ? startDoc.text.length : startDoc.lines)
                let updatedLineCount = doc.lines - startDoc.lines;                
                let changes = viewUpdate.changes.toJSON();
                let changeStartLine = doc.lineAt(changes[0]);
                // convert the line number 0-based index, which is what we use internally
                let changeStartLineNumber = changeStartLine.number-1;          
                // console.log(changes); 
                // console.log('changeStartLineNumber', changeStartLineNumber);
                let updatedLineInfo: ILineUpdate = {text: text, updatedStartLineNumber: changeStartLineNumber, updatedLineCount: updatedLineCount};
                if (updatedLineCount>0){                
                    // Note 1: _getCurrentLineNumber returns line number indexed starting from 1.
                    // Convert it to 0-indexed by -1.
                    // Note 2: the lines being added are lines above currentLine.
                    // If there is new text in the current line then current line is `edited` not `added`                
                    dispatch(updateLines(updatedLineInfo));
                } else if (updatedLineCount<0){               
                    // Note 1: _getCurrentLineNumber returns line number indexed starting from 1.
                    // Convert it to 0-indexed by -1. 
                    // Note 2: the lines being deleted are lines above currentLine.
                    // If there is new text in the current line then current line is `edited`                            
                    dispatch(updateLines(updatedLineInfo));
                } else {
                    let lineStatus: ICodeLineStatus;
                    lineStatus = {text: text, lineNumber: changeStartLineNumber, status: LineStatus.EDITED, generated: false};                    
                    dispatch(setLineStatus(lineStatus));
                }
                
                _handleMagicsOnCMChange();
            }
        } catch(error) {
            throw(error);
        }
    }

    /**
     * This handle all the CNext magics.
     */
    function _handleMagicsOnCMChange(){
        if (editorRef.current){
            let cm: ReactCodeMirrorRef = editorRef.current
            if(cm.view){
                let state = cm.view.state;
                if(state){
                    let tree = state.tree;
                    let curPos = state.selection.ranges[0].anchor;             
                    let cursor = tree.cursor(curPos, 0);                    
                                        
                    if ([CNextDataFrameExpresion, CNextXDimColumnNameExpression, CNextYDimColumnNameExpression]
                        .includes(cursor.type.id)){
                        /** 
                         * Move the cursor up to CNextPlotExpression so we can parse the whole cnext text and
                         * generate the new inline plot command 
                         * */
                        cursor.parent();
                        cursor.parent();
                    }
                    console.log('_handleMagics: ', cursor.toString());
                    if (cursor.type.id === CNextPlotExpression) {                        
                        let text: string = state.doc.toString();
                        let newMagicText: string = text.substring(cursor.from, cursor.to);                         
                        let generatedLine = cm.view.state.doc.lineAt(cursor.to);
                        console.log('Magics current magicInfo: ', magicInfo);
                        /** 
                         * Check the status here to avoid circular update because this code will generate
                         * new content added to the editor, which will trigger onCMChange -> _handleMagic. 
                         * Note: if magicInfo status is CodeGenStatus.INSERTED, we also reset the magicInfo content
                         * */                       
                        if (magicInfo === undefined || (magicInfo && magicInfo.status === CodeGenStatus.INSERTED)) {            
                            let plotData = _parseMagicText(cursor, text);
                            let magicInfo: IMagicInfo = {
                                status: CodeGenStatus.INSERTING, 
                                magicText: newMagicText, 
                                plotData: plotData, 
                                line: generatedLine,
                                /** generatedLine.number in state.doc is 1 based, so convert to 0 base */ 
                                lineInfo: {
                                    fromLine: generatedLine.number-1, 
                                    fromPos: generatedLine.from,
                                    toLine: generatedLine.number, /** this will need to be replaced when the code is generated */
                                }
                            };
                            setMagicInfo(magicInfo);
                            console.log('Magics inserting magicInfo: ', magicInfo);                                              
                        } else if (magicInfo && magicInfo.status === CodeGenStatus.INSERTING && magicInfo.line && magicInfo.lineInfo) {
                            /** The second time _handleMagic being called is after new code has been inserted */
                            /** convert line number to 0-based */
                            // let lineStatus: ICodeLineStatus = {
                            //     lineNumber: magicInfo.lineInfo.fromLine, 
                            //     status: LineStatus.EDITED, 
                            //     generated: true
                            // };                        
                            // dispatch(setLineStatus(lineStatus));
                            let lineStatus: ICodeLineGroupStatus = {
                                fromLine: magicInfo.lineInfo.fromLine, 
                                toLine: magicInfo.lineInfo.toLine, 
                                status: LineStatus.EDITED, 
                                generated: true,
                                setGroup: SetLineGroupCommand.NEW,
                            };                        
                            dispatch(setLineGroupStatus(lineStatus));
                            // console.log('Magics after inserted lineStatus: ', lineStatus);
                            let newMagicInfo: IMagicInfo = { 
                                status: CodeGenStatus.INSERTED, 
                                line: magicInfo.line,
                                lineInfo: magicInfo.lineInfo,
                            };
                            setMagicInfo(newMagicInfo);         
                            console.log('Magics after inserted magicInfo: ', newMagicInfo);                
                        }                    
                    } 
                }
            }
        }        
    } 

    /**
     * Currently only implement the plot magic. The plot will start first with #! plot.
     * The current grammar will make good detection of CNextStatement except for when 
     * the command line ends with eof. Not sure why the grammar does not work with it.
     * The cnext plot pattern looks like this:
     * CNextPlotExpression(CNextPlotKeyword,
     * DataFrameExpresion,
     * CNextPlotYDimExpression(ColumnNameExpression),
     * CNextPlotAddDimKeyword(vs),
     * CNextPlotXDimExpression(ColumnNameExpression))
     * */
    function _parseMagicText(cursor, text) {
        let plotData: MagicPlotData = {
            magicTextRange: {from: cursor.from, to: cursor.to},
            df: null,
            x: null,
            y: null
        };              
        // let endPlotPos = cursor.to;  
        plotData.magicTextRange = {from: cursor.from, to: cursor.to};                      
        // while(cursor.to <= endPlotPos){
        cursor.next();
        if(cursor.type.id === CNextPlotKeyword){
            cursor.nextSibling(); //skip CNextPlotKeyword
        }
        // console.log(cursor.name);
        if (cursor.type.id == CNextDataFrameExpresion){
            // console.log('DF: ', text.substring(cursor.from, cursor.to));
            plotData.df = text.substring(cursor.from, cursor.to);
            cursor.nextSibling();
            // console.log(cursor.name);
        } 
        if (cursor.type.id === CNextPlotYDimExpression){
            let endYDim = cursor.to;
            plotData.y = []
            while((cursor.to <= endYDim) && cursor){
                if(cursor.type.id === CNextYDimColumnNameExpression){
                    // console.log('Y dim: ', text.substring(cursor.from, cursor.to));
                    // remove quotes
                    plotData.y.push(text.substring(cursor.from+1, cursor.to-1));
                }       
                cursor.next();     
                // console.log(cursor.name);       
            }         
            cursor.nextSibling(); //skip CNextPlotAddDimKeyword
            // console.log(cursor.name);
            if (cursor.type.id === CNextPlotXDimExpression){
                let endXDim = cursor.to;
                plotData.x = []
                while((cursor.to <= endXDim) && cursor){                                        
                    if(cursor.type.id === CNextXDimColumnNameExpression){
                        // console.log('X dim: ', text.substring(cursor.from, cursor.to));
                        // remove quotes
                        plotData.x.push(text.substring(cursor.from+1, cursor.to-1));
                    }
                    cursor.next();                  
                    // console.log(cursor.name);
                }         
            }
        }
        return plotData; 
    }

    /**
     * This useEffect handle the plot magic. This is used in conjunction with _handleMagics. 
     * This will be triggered when there are updates on magicInfo. 
     * Could not make it work when run this directly inside _handleMagics(), 
     * might be because that function is called within onCMUpdate which is in the middle of
     * a transaction.
     */
    function _handleNewMagicInfo(){
        let cm: ReactCodeMirrorRef = editorRef.current;
        console.log('_handleMagicInfoUpdate: ', magicInfo);
        if (cm && cm.editor && cm.view && magicInfo){
            if (magicInfo.status === CodeGenStatus.INSERTING){
                if (magicInfo.plotData !== undefined && magicInfo.lineInfo !== undefined) {          
                    // console.log('Magic inlinePlotData: ', inlinePlotData);
                    let result: Promise<CodeGenResult>|CodeGenResult = magicsGetPlotCommand(magicInfo.plotData);
                    if (isPromise(result)){
                        result.then((genCodeResult: CodeGenResult) => {
                            console.log('Magic code gen result: ', genCodeResult);
                            _processGenCodeResult(genCodeResult);
                        });
                    } else {
                        let genCodeResult: CodeGenResult = result;
                        console.log('Magic code gen result: ', genCodeResult);
                        _processGenCodeResult(genCodeResult)
                    } 
                }
            } else if (magicInfo.status === CodeGenStatus.INSERTED && magicInfo.lineInfo !== undefined) {
                _setFlashingEffect(cm.view);
            }
        }
    }
    
    useEffect(() => {
        _handleNewMagicInfo();
    }, [magicInfo])
    
    function isPromise(object) {
        if (Promise && Promise.resolve) {
            return Promise.resolve(object) == object;
        } else {
            throw "Promise not supported in your environment"; // Most modern browsers support Promises
        }
    }

    /** 
     * Implement the flashing effect after line is inserted.
     * This function also reset magicInfo after the animation completes. 
     * */
     function _setFlashingEffect(view: EditorView){
        console.log('Magic _setFlashingEffect', magicInfo);    
        if(magicInfo){
            view.dispatch({effects: [StateEffect.appendConfig.of([generatedCodeDeco])]});
        view.dispatch({effects: [generatedCodeStateEffect.of({lineInfo: magicInfo.lineInfo, type: GenCodeEffectType.FLASHING})]});             
        }        
    }

    /**
     * Get the line range of the group that contains lineNumber
     * @param lineNumber 
     * @returns line range which is from fromLine to toLine excluding toLine
     */
    function _getLineRangeOfGroup(lineNumber: number): ILineRange {
        let groupID = codeLines[lineNumber].groupID;
        let fromLine = lineNumber;
        let toLine = lineNumber;
        if (groupID === undefined){
            toLine = fromLine+1;
        } else {
            while(codeLines[fromLine-1].groupID && codeLines[fromLine-1].groupID === groupID){
                fromLine -= 1;
            }
            while(codeLines[toLine].groupID && codeLines[toLine].groupID === groupID){
                toLine += 1;
            }
        }        
        return {fromLine: fromLine, toLine: toLine};
    }

    /**
     * The replacement range will be identified from the line group that contains magicInfo.lineInfo.fromLine
     * @param genCodeResult 
     */
    function _processGenCodeResult(genCodeResult: CodeGenResult){
        let cm: ReactCodeMirrorRef = editorRef.current;
        if (cm.view){
            let state: EditorState = cm.view.state;
            if (!genCodeResult.error && genCodeResult.code && magicInfo && magicInfo.line && magicInfo.lineInfo){
                let genCode: string = genCodeResult.code;
                let lineCount: number|undefined = genCodeResult.lineCount;                
                let lineNumber = magicInfo.lineInfo.fromLine;
                let insertFrom =  magicInfo.lineInfo.fromPos; //magicInfo.line.from;
                let isLineGenerated = codeLines[lineNumber].generated;
                let lineRange = _getLineRangeOfGroup(lineNumber);
                
                let insertTo: number = insertFrom;
                if(isLineGenerated){
                    for(let i=lineRange.fromLine; i<lineRange.toLine; i++){
                        insertTo += codeText[i].length; 
                    }
                    /** add the number of the newline character between fromLine to toLine excluding the last one*/
                    insertTo += (lineRange.toLine-lineRange.fromLine-1); 
                }
                /** Update magicInfo with lineCount */
                magicInfo.lineInfo.toLine = magicInfo.lineInfo.fromLine + (lineCount?lineCount:0);
                setMagicInfo(magicInfo);

                console.log('Magic insert range: ', insertFrom, insertTo);
                let transactionSpec: TransactionSpec = {
                    changes: {
                        from: insertFrom, 
                        to: insertTo, 
                        insert: isLineGenerated ? genCode : genCode + LINE_SEP
                    }
                };                
                let transaction: Transaction = state.update(transactionSpec);
                cm.view.dispatch(transaction);                                     
            } else {
                setMagicInfo(undefined);       
            }
        }
    }
    /** */
    
    /** Implement line status gutter */
    const markerDiv = () => {
        let statusDiv = document.createElement('div');
        statusDiv.style.width = '2px';
        statusDiv.style.height = '100%';        
        return statusDiv;
    }

    const executedColor = '#42a5f5';
    const editedMarker = new class extends GutterMarker {
        toDOM() { 
            return markerDiv();
        }
    }

    const executingMarker = new class extends GutterMarker {
        toDOM() { 
            let statusDiv = markerDiv();
            statusDiv.animate([
                {backgroundColor: ''},
                {backgroundColor: executedColor, offset: 0.5}], 
                {duration: 2000, iterations: Infinity});
            return statusDiv;
        }
    }
    
    const executedMarker = new class extends GutterMarker {
        toDOM() { 
            let statusDiv = markerDiv();
            statusDiv.style.backgroundColor = executedColor;
            return statusDiv;
        }
    }

    /** 
     * This function should only be called after `codeLines` has been updated. However because this is controlled by CodeMirror 
     * intenal, we can't dictate when it will be called. To cope with this, we have to check the object existence carefully 
     * and rely on useEffect to force this to be called again when `codeLines` updated 
    */ 
    const editStatusGutter = gutter({
        lineMarker(view, line) {
            let lines = store.getState().codeEditor.codeLines;
            // line.number in state.doc is 1 based, so convert to 0 base
            let lineNumber = view.state.doc.lineAt(line.from).number-1;
            // console.log(lines.length);
            if(lines && lineNumber<lines.length){                                
                switch(lines[lineNumber].status){
                    case LineStatus.EDITED: return editedMarker;
                    case LineStatus.EXECUTING: return executingMarker;
                    case LineStatus.EXECUTED: return executedMarker;
                }
            }
            return null;
        },
        initialSpacer: () => executedMarker
    })
    /** */  

    /**
     * Implement the decoration for magic generated code lines
     */
    enum GenCodeEffectType {
        FLASHING,
        SOLID
    };
    /** note that this lineNumber is 1-based */
    const generatedCodeStateEffect = StateEffect.define<{lineInfo?: IInsertLinesInfo, type: GenCodeEffectType}>()
    const generatedCodeDeco = StateField.define<DecorationSet>({
        create() {
            return Decoration.none;
        },
        update(marks, tr) {
            let cm: ReactCodeMirrorRef = editorRef.current;  
            if (cm && cm.view){               
                // console.log('Magic: ', marks);
                marks = marks.map(tr.changes)
                for (let effect of tr.effects) if (effect.is(generatedCodeStateEffect)) {
                    if (effect.value.type == GenCodeEffectType.FLASHING) {
                        if (effect.value.lineInfo !== undefined){
                            let lineInfo = effect.value.lineInfo;
                            for (let i=lineInfo.fromLine; i<lineInfo.toLine; i++){
                                /** convert line number to 1-based */
                                let line = cm.view.state.doc.line(i+1);
                                // console.log('Magics line from: ', line, line.from);
                                marks = marks.update({
                                    add: [genCodeFlashCSS.range(line.from)]
                                })
                            }                            
                        }                        
                    } else { /** effect.value.type is SOLID */
                        let lines: ICodeLineStatus[] = store.getState().codeEditor.codeLines;
                        for (let l=0; l < lines.length; l++){
                            if (lines[l].generated === true){
                                let line = cm.view.state.doc.line(l+1);
                                marks = marks.update({
                                    add: [genCodeSolidCSS.range(line.from)]
                                })
                            }                            
                        }
                    }
                }                
                return marks
            }
        },
        provide: f => EditorView.decorations.from(f)
    });
    const genCodeFlashCSS = Decoration.line({attributes: {class: "cm-gencode-flash"}});
    const genCodeSolidCSS = Decoration.line({attributes: {class: "cm-gencode-solid"}});
    /** */
    
    const extensions = [
        basicSetup,
        // oneDark,
        EditorView.lineWrapping,
        lineNumbers(),
        editStatusGutter,
        bracketMatching(),
        defaultHighlightStyle.fallback,
        python(),
        ls,
        // keymap.of([{key: 'Mod-l', run: runLine}]),
        keymap.of([{key: 'Mod-l', run: setRunQueue}]),
        indentUnit.of('    '),
    ];

    return (
        <StyledCodeEditor>
            {console.log('Render CodeEditorComponent')}
            <StyledCodeMirror
                ref = {editorRef}
                height = "100%"
                style = {{fontSize: "14px"}}
                // extensions = {[python(), ls, keymap.of([{key: 'Mod-l', run: runLine}])]}                    
                // extensions = {[python(), keymap.of([{key: 'Mod-l', run: runLine}])]}                    
                extensions = {extensions}
                theme = 'light'                
                // onChange = {(text, viewUpdate) => onChange(text, viewUpdate)}    
                // onChange = {(text, viewUpdate) => onCMChange(text, viewUpdate)}                 
                // onUpdate = {(viewUpdate) => onCMUpdate(viewUpdate)}   
                onChange = {onCMChange}
            >
            </StyledCodeMirror> 
        </StyledCodeEditor>
    )
};

export default CodeEditor;



