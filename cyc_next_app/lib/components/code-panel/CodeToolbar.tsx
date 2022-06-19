import React, { Fragment, useEffect, useState } from "react";
import {
    CodeToolbar as StyledCodeToolbar,
    FileNameTab,
    PanelDivider,
    FileCloseIcon as StyledFileCloseIcon,
    FileCloseIconContainer,
} from "../StyledComponents";
import { IconButton, stepConnectorClasses } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { setFileToClose, setInView } from "../../../redux/reducers/ProjectManagerRedux";
import store, { RootState } from "../../../redux/store";
import { isRunQueueBusy } from "./libCodeEditor";
import ScrollIntoViewIfNeeded from "react-scroll-into-view-if-needed";
import { setNotification } from "../../../redux/reducers/NotificationRedux";
import { OPERATION_DISABLED_MSG } from "../../interfaces/IApp";
import { runQueueSafe } from "../libs/utils";

const FileCloseIcon = (props) => {
    return (
        <FileCloseIconContainer>
            <StyledFileCloseIcon fontSize="small" {...props} />
        </FileCloseIconContainer>
    );
};

const CodeToolbar = () => {
    const openFiles = useSelector((state: RootState) => state.projectManager.openFiles);
    // const executorID = useSelector((state: RootState) => state.projectManager.executorID);
    const inViewID = useSelector((state: RootState) => state.projectManager.inViewID);
    // const fileSaved = useSelector((state: RootState) => state.codeEditor.fileSaved);
    const fileToSave = useSelector((state: RootState) => state.projectManager.fileToSave);
    const fileToSaveState = useSelector((state: RootState) => state.projectManager.fileToSaveState);
    const savingFile = useSelector((state: RootState) => state.projectManager.savingFile);
    const savingStateFile = useSelector((state: RootState) => state.projectManager.savingStateFile);
    const runQueueBusy = useSelector((state: RootState) =>
        isRunQueueBusy(state.codeEditor.runQueue)
    );
    const [displayState, setDisplayState] = useState<{ [id: string]: {} }>({});
    const dispatch = useDispatch();

    const onClick = (id: string) => {
        dispatch(setInView(id));
    };

    const onClose = (event, id: string) => {
        event.stopPropagation();
        dispatch(setFileToClose(openFiles[id].path));
    };

    /** Set inViewID whenever there is a new openFiles */
    useEffect(() => {
        // let inViewID = store.getState().projectManager.inViewID;
        let openOrder = store.getState().projectManager.openOrder;
        // let keys = Object.keys(openFiles);
        dispatch(setInView(openOrder[openOrder.length - 1]));
    }, [openFiles]);

    const renderFileNameComponent = (id: string, name: string) => {
        return (
            <Fragment key={id}>
                <FileNameTab
                    // toolbarName={name}
                    selected={id === inViewID}
                    component="span"
                    /** not allow switching tab when the runQueue is busy */
                    onClick={(event: React.MouseEvent) => runQueueSafe(event, () => onClick(id))}
                    // className={id == inViewID && runQueueBusy ? `ft-runqueuebusy` : ``}
                    runQueueBusy = {id == inViewID && runQueueBusy}
                    fileSaved={
                        !fileToSave.includes(id) &&
                        savingFile !== id &&
                        !fileToSaveState.includes(id) &&
                        savingStateFile !== id
                    }
                    onMouseEnter={(event: React.MouseEvent) => {
                        // {console.log('CodeToolbar onMouseEnter: ', id, name, displayState)}
                        let newDisplay = { ...displayState };
                        newDisplay[id] = { display: "inline-block" };
                        /** need to do the following to avoid race condition */
                        Object.keys(newDisplay).map((key) => {
                            key !== id ? (newDisplay[key] = { display: "none" }) : null;
                        });
                        setDisplayState(newDisplay);
                    }}
                    onMouseLeave={(event: React.MouseEvent) => {
                        // {console.log('CodeToolbar onMouseEnter: ', id, name, displayState)}
                        let newDisplay = { ...displayState };
                        newDisplay[id] = { display: "none" };
                        setDisplayState(newDisplay);
                    }}
                >
                    {name}
                    <FileCloseIcon
                        style={id in displayState ? displayState[id] : { display: "none" }}
                        onClick={(event: React.MouseEvent) => onClose(event, id)}
                    />
                </FileNameTab>
                <PanelDivider orientation="vertical" color="light" />
                {id == inViewID && (
                    <ScrollIntoViewIfNeeded
                        options={{
                            // active: true,
                            block: "nearest",
                            inline: "center",
                            behavior: "auto",
                            // boundary: document.getElementById(codeOutputContentID),
                        }}
                    />
                )}
            </Fragment>
        );
    };

    return (
        <StyledCodeToolbar>
            {Object.keys(openFiles).map((id: string) => {
                return renderFileNameComponent(id, openFiles[id].name);
            })}
        </StyledCodeToolbar>
    );
};

export default CodeToolbar;
