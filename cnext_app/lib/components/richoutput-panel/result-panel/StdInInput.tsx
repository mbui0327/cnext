import { InputAdornment } from "@mui/material";
import React, { useContext, useRef } from "react";
import { SocketContext } from "../../Socket";
import { StdInInput } from "../../StyledComponents";
import { sendMessage } from "./libStdInInput";

export const InputComponent = ({ resultContent }) => {
    const socket = useContext(SocketContext);
    const inputRef = useRef(null);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && socket) {
            // console.log("InputComponent: ", event.target.value);
            sendMessage(socket, event.target.value);
        }
    };

    return (
        <StdInInput
            ref={inputRef}
            id="standard-basic"
            variant="outlined"
            size="small"
            autoFocus={true}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{ paddingLeft: "10px", fontSize: "5px" }}>
                        {resultContent.prompt}
                    </InputAdornment>
                ),
            }}
            onKeyPress={(event) => handleKeyPress(event)}
        />
    );
};
