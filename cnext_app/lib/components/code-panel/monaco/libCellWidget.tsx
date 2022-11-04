import { setCellCommand } from "../../../../redux/reducers/CodeEditorRedux";
import store from "../../../../redux/store";
import { CellCommand, ICodeLine, LineStatus } from "../../../interfaces/ICodeEditor";
import { getCodeLine } from "./libCodeEditor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const createCellWidgetDom = (
    groupID: string,
    afterLineNumber: number,
    endBoundaryWidget: boolean,
    activeClass: string,
    status: any
) => {
    let wrapDiv = document.createElement("div");
    const cellItems = [
        {
            text: "Run Cell",
            cellCommand: CellCommand.RUN_CELL,
            svg: `<svg style="font-size:20px" class="icon-cellcommand MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="PlayArrowIcon"><path d="M8 5v14l11-7z"></path></svg>`,
        },
        {
            text: "Run Above",
            cellCommand: CellCommand.RUN_ABOVE_CELL,
            svg: `<svg class="MuiSvgIcon-fontSizeSmall icon-cellcommand" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" fill="currentColor"><path d="M1.77 1.01L1 1.42v12l.78.42 9-6v-.83l-9.01-6zM2 12.49V2.36l7.6 5.07L2 12.49zM12.15 8h.71l2.5 2.5-.71.71L13 9.56V15h-1V9.55l-1.65 1.65-.7-.7 2.5-2.5z"/></svg>`,
        },
        {
            text: "Run Below",
            cellCommand: CellCommand.RUN_BELOW_CELL,
            svg: `<svg class="MuiSvgIcon-fontSizeSmall icon-cellcommand" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" fill="currentColor"><path d="M1.8 1.01l-.78.41v12l.78.42 9-6v-.83l-9-6zm.22 11.48V2.36l7.6 5.07-7.6 5.06zM12.85 15h-.71l-2.5-2.5.71-.71L12 13.44V8h1v5.45l1.65-1.65.71.71L12.85 15z"/></svg>`,
        },
        {
            text: "Clear Result",
            cellCommand: CellCommand.CLEAR,
            svg: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall icon-cellcommand" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="PlaylistRemoveIcon"><path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41 19.59 22 21 20.59 18.41 18 21 15.41 19.59 14 17 16.59 14.41 14 13 15.41 15.59 18 13 20.59 14.41 22z"></path></svg>`,
        },
        {
            text: "Add Cell",
            cellCommand: CellCommand.ADD_CELL,
            svg: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall icon-cellcommand" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="AddCardIcon"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h10v-2H4v-6h18V6c0-1.11-.89-2-2-2zm0 4H4V6h16v2zm4 9v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3z"></path></svg>`,
        },
        {
            text: "Delete Cell",
            cellCommand: CellCommand.DELL_CELL,
            svg: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall icon-cellcommand" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteOutlineIcon" aria-label="fontSize large"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path></svg>`,
        },
        {
            text: "Add text",
            cellCommand: CellCommand.ADD_TEXT,
            svg: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall icon-cellcommand" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="FormatColorTextIcon"><path d="M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61 2.03-5.79h.12l2.03 5.79H9.91z"></path></svg>`,
        },
    ];
    for (let i = 0; i < cellItems.length; i++) {
        const element = cellItems[i];
        let dom = document.createElement("span");
        let tooltip = document.createElement("span");

        dom.innerHTML = element.svg;
        if (element.cellCommand === CellCommand.RUN_CELL && status === LineStatus.EXECUTING) {
            // let circlExcuting = document.createElement("span");
            // circlExcuting.className = "circle-excuting";
            // dom.appendChild(circlExcuting);
            dom.className = `cellcommand circle-excuting`;
        } else {
            dom.className = `cellcommand`;
        }

        tooltip.textContent = element.text;
        tooltip.className = `tooltiptext`;
        dom.appendChild(tooltip);
        wrapDiv.appendChild(dom);

        dom.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            store.dispatch(setCellCommand(element.cellCommand));
        });
    }

    /** widget of the next cell will also has the top boundary to mark the end of prev cell */
    wrapDiv.className = "cellwidget celllastline " + activeClass;
    wrapDiv.id = `cellwidget-${groupID}`;
    let parentDiv = document.createElement("div");
    parentDiv.className = "";

    let divAI = document.createElement("div");
    parentDiv.appendChild(divAI);
    divAI.className = `cellwidget-input`;
    divAI.id = `cellwidget-input-${groupID}`;
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Text to code";
    input.oninput = eventInput;
    divAI.appendChild(input);

    function eventInput(e) {
        console.log("Text to code=>>", e.target.value);
    }

    parentDiv.appendChild(wrapDiv);
    let zone = null;
    if (endBoundaryWidget) {
        zone = {
            afterLineNumber: afterLineNumber + 2,
            heightInLines: 2, // yes this is 0, this is not a bug
            domNode: parentDiv,
        };
    } else {
        zone = {
            afterLineNumber: afterLineNumber,
            heightInLines: 4,
            domNode: parentDiv,
        };
    }

    return zone;
};

const widgetViewZones = [];

const addCellWidgets = (changeAccessor) => {
    // remove existing view zones
    for (let viewZoneId of widgetViewZones) changeAccessor.removeZone(viewZoneId);

    let state = store.getState();
    const activeGroup = state.codeEditor.activeGroup;
    let inViewID = state.projectManager.inViewID;
    if (inViewID) {
        let lines: ICodeLine[] | null = getCodeLine(state);
        // console.log("Monaco: ", lines);
        if (lines && lines.length > 0) {
            let currentGroupID = null;
            for (let ln = 0; ln < lines.length; ln++) {
                if (!lines[ln].generated) {
                    const groupID = lines[ln].groupID;
                    const active_clazz = activeGroup === groupID ? "active show-toolbar" : "";
                    let zone = null;
                    if (groupID) {
                        if (groupID != currentGroupID) {
                            zone = createCellWidgetDom(
                                groupID,
                                ln,
                                false,
                                active_clazz,
                                lines[ln].status
                            );
                            if (zone) {
                                let viewZoneId = changeAccessor.addZone(zone);
                                widgetViewZones.push(viewZoneId);
                            }
                        }

                        if (ln + 1 === lines.length) {
                            /** add a special widget here if the line and also the last cell
                             * this is used to marked the end boundary of the cell */
                            zone = createCellWidgetDom(groupID, ln, true, "");
                            if (zone) {
                                let viewZoneId = changeAccessor.addZone(zone);
                                widgetViewZones.push(viewZoneId);
                            }
                        }
                    }
                }
                currentGroupID = lines[ln].groupID;
            }
        }
    }
};

export const setCellWidgets = (editor) => {
    editor.changeViewZones(addCellWidgets);
};
