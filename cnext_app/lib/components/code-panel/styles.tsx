import Editor from "@monaco-editor/react";
import styled from "styled-components";

export const MonacoEditor = styled(Editor)`
    .groupwidget {
        height: 18px;
        width: 100%;
        /* padding-left: 5px; */
        &.show {
            cursor: pointer;
            font-size: 11px;
            /* opacity: 0.9; */
            opacity: 0;
            color: rgba(0, 0, 0, 0.6);
            &:hover {
                opacity: 1;
            }
            /* padding-top: 4px; */
        }
        .cellcommand {
            display: inline-block;
            margin-left: 5px;
            position: relative;
            &:not(:last-child) {
                /* border-right: 1px solid #42a5f5; */
            }
            .icon-cellcommand {
                webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                width: 1em;
                height: 1em;
                display: inline-block;
                fill: currentColor;
                -webkit-flex-shrink: 0;
                -ms-flex-negative: 0;
                flex-shrink: 0;
                -webkit-transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                font-size: 1rem;
            }
            .tooltiptext {
                visibility: hidden;
                font-size: 11px;
                background-color: #727171;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 2px 4px;
                min-width: 35px;
                position: absolute;
                z-index: 1;
                bottom: -80%;
                left: 120%;
                margin-left: -5px;
                opacity: 1;
                transition: opacity 0.3s;
                &::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    /* border-color: #555 transparent transparent transparent; */
                }
            }
            &:hover {
                .tooltiptext {
                    visibility: visible;
                }
                /* color: #8a8989; */
                svg {
                    background-color: #f3f3f3;
                }
            }
        }
    }
`;
