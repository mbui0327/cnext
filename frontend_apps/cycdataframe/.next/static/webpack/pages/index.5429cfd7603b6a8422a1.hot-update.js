"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./lib/materialui/layouts/CodePanelComponent.tsx":
/*!*******************************************************!*\
  !*** ./lib/materialui/layouts/CodePanelComponent.tsx ***!
  \*******************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Users_bachbui_works_auto_task_frontend_apps_cycdataframe_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty */ \"./node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _StyledComponents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StyledComponents */ \"./lib/materialui/layouts/StyledComponents.tsx\");\n/* harmony import */ var _WorkingPanelDivider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WorkingPanelDivider */ \"./lib/materialui/layouts/WorkingPanelDivider.tsx\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\nvar _jsxFileName = \"/Users/bachbui/works/auto_task/frontend_apps/cycdataframe/lib/materialui/layouts/CodePanelComponent.tsx\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_Users_bachbui_works_auto_task_frontend_apps_cycdataframe_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\n\n\n\nvar Editor = function Editor(props) {\n  if (true) {\n    var AceEditor = __webpack_require__(/*! react-ace */ \"./node_modules/react-ace/lib/index.js\").default;\n\n    __webpack_require__(/*! ace-builds/src-noconflict/mode-python */ \"./node_modules/ace-builds/src-noconflict/mode-python.js\");\n\n    __webpack_require__(/*! ace-builds/src-noconflict/theme-xcode */ \"./node_modules/ace-builds/src-noconflict/theme-xcode.js\");\n\n    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(AceEditor, _objectSpread({}, props), void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 12,\n      columnNumber: 14\n    }, _this);\n  }\n\n  return null;\n};\n\n_c = Editor;\n\nvar CodePanelComponent = function CodePanelComponent() {\n  _s();\n\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false),\n      mounted = _useState[0],\n      setMounted = _useState[1];\n\n  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {\n    setMounted(true);\n  });\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_StyledComponents__WEBPACK_IMPORTED_MODULE_2__.CodePanel, {\n    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_StyledComponents__WEBPACK_IMPORTED_MODULE_2__.CodeToolbar, {}, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 28,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_WorkingPanelDivider__WEBPACK_IMPORTED_MODULE_3__.default, {}, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 30,\n      columnNumber: 13\n    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(_StyledComponents__WEBPACK_IMPORTED_MODULE_2__.CodeArea, {\n      children: mounted ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(Editor, {\n        placeholder: \"Placeholder Text\",\n        mode: \"python\",\n        theme: \"xcode\",\n        name: \"CodeEditor\" // onLoad={this.onLoad}\n        // onChange={this.onChange}\n        ,\n        fontSize: 14,\n        showPrintMargin: true,\n        showGutter: true,\n        highlightActiveLine: true,\n        value: \"def hellow_world: \\n\\tprint(\\\"Hello world\\\"); \\n\\t\",\n        setOptions: {\n          enableBasicAutocompletion: true,\n          enableLiveAutocompletion: false,\n          enableSnippets: false,\n          showLineNumbers: true,\n          tabSize: 2\n        }\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 33,\n        columnNumber: 17\n      }, _this) : null\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 31,\n      columnNumber: 13\n    }, _this)]\n  }, void 0, true, {\n    fileName: _jsxFileName,\n    lineNumber: 27,\n    columnNumber: 9\n  }, _this);\n};\n\n_s(CodePanelComponent, \"LrrVfNW3d1raFE0BNzCTILYmIfo=\");\n\n_c2 = CodePanelComponent;\n/* harmony default export */ __webpack_exports__[\"default\"] = (CodePanelComponent);\n\nvar _c, _c2;\n\n$RefreshReg$(_c, \"Editor\");\n$RefreshReg$(_c2, \"CodePanelComponent\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvbWF0ZXJpYWx1aS9sYXlvdXRzL0NvZGVQYW5lbENvbXBvbmVudC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTs7O0FBRUEsSUFBTU8sTUFBTSxHQUFHLFNBQVRBLE1BQVMsQ0FBQ0MsS0FBRCxFQUFnQjtBQUMzQixZQUFtQztBQUNqQyxRQUFNQyxTQUFTLEdBQUdDLHFGQUFsQjs7QUFDQUEsSUFBQUEsbUJBQU8sQ0FBQyxzR0FBRCxDQUFQOztBQUNBQSxJQUFBQSxtQkFBTyxDQUFDLHNHQUFELENBQVA7O0FBRUEsd0JBQU8sOERBQUMsU0FBRCxvQkFBZUYsS0FBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQVA7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQVZIOztLQUFNRDs7QUFhTixJQUFNSSxrQkFBa0IsR0FBRyxTQUFyQkEsa0JBQXFCLEdBQU07QUFBQTs7QUFDN0Isa0JBQThCVCwrQ0FBUSxDQUFDLEtBQUQsQ0FBdEM7QUFBQSxNQUFPVSxPQUFQO0FBQUEsTUFBZ0JDLFVBQWhCOztBQUVBWixFQUFBQSxnREFBUyxDQUFDLFlBQU07QUFDWlksSUFBQUEsVUFBVSxDQUFDLElBQUQsQ0FBVjtBQUNILEdBRlEsQ0FBVDtBQUlBLHNCQUNJLDhEQUFDLHdEQUFEO0FBQUEsNEJBQ0ksOERBQUMsMERBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURKLGVBR0ksOERBQUMseURBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUhKLGVBSUksOERBQUMsdURBQUQ7QUFBQSxnQkFDS0QsT0FBTyxnQkFDUiw4REFBQyxNQUFEO0FBQ0ksbUJBQVcsRUFBQyxrQkFEaEI7QUFFSSxZQUFJLEVBQUMsUUFGVDtBQUdJLGFBQUssRUFBQyxPQUhWO0FBSUksWUFBSSxFQUFDLFlBSlQsQ0FLSTtBQUNBO0FBTko7QUFPSSxnQkFBUSxFQUFFLEVBUGQ7QUFRSSx1QkFBZSxFQUFFLElBUnJCO0FBU0ksa0JBQVUsRUFBRSxJQVRoQjtBQVVJLDJCQUFtQixFQUFFLElBVnpCO0FBV0ksYUFBSyxzREFYVDtBQVlJLGtCQUFVLEVBQUU7QUFDUkUsVUFBQUEseUJBQXlCLEVBQUUsSUFEbkI7QUFFUkMsVUFBQUEsd0JBQXdCLEVBQUUsS0FGbEI7QUFHUkMsVUFBQUEsY0FBYyxFQUFFLEtBSFI7QUFJUkMsVUFBQUEsZUFBZSxFQUFFLElBSlQ7QUFLUkMsVUFBQUEsT0FBTyxFQUFFO0FBTEQ7QUFaaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURRLEdBb0JOO0FBckJOO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFKSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FESjtBQThCRCxDQXJDSDs7R0FBTVA7O01BQUFBO0FBdUNKLCtEQUFlQSxrQkFBZiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9saWIvbWF0ZXJpYWx1aS9sYXlvdXRzL0NvZGVQYW5lbENvbXBvbmVudC50c3g/YzExZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUeXBvZ3JhcGh5IH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDb2RlQXJlYSwgQ29kZVBhbmVsLCBDb2RlVG9vbGJhciB9IGZyb20gXCIuL1N0eWxlZENvbXBvbmVudHNcIjtcbmltcG9ydCBXb3JraW5nUGFuZWxEaXZpZGVyQ29tcG9uZW50IGZyb20gXCIuL1dvcmtpbmdQYW5lbERpdmlkZXJcIjtcblxuY29uc3QgRWRpdG9yID0gKHByb3BzOiBhbnkpID0+IHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IEFjZUVkaXRvciA9IHJlcXVpcmUoJ3JlYWN0LWFjZScpLmRlZmF1bHQ7XG4gICAgICByZXF1aXJlKCdhY2UtYnVpbGRzL3NyYy1ub2NvbmZsaWN0L21vZGUtcHl0aG9uJyk7XG4gICAgICByZXF1aXJlKCdhY2UtYnVpbGRzL3NyYy1ub2NvbmZsaWN0L3RoZW1lLXhjb2RlJyk7XG4gIFxuICAgICAgcmV0dXJuIDxBY2VFZGl0b3Igey4uLnByb3BzfS8+XG4gICAgfVxuICBcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcblxuY29uc3QgQ29kZVBhbmVsQ29tcG9uZW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHNldE1vdW50ZWQodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Q29kZVBhbmVsPlxuICAgICAgICAgICAgPENvZGVUb29sYmFyPiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvQ29kZVRvb2xiYXI+XG4gICAgICAgICAgICA8V29ya2luZ1BhbmVsRGl2aWRlckNvbXBvbmVudCAvPlxuICAgICAgICAgICAgPENvZGVBcmVhPlxuICAgICAgICAgICAgICAgIHttb3VudGVkID9cbiAgICAgICAgICAgICAgICA8RWRpdG9yXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGxhY2Vob2xkZXIgVGV4dFwiXG4gICAgICAgICAgICAgICAgICAgIG1vZGU9XCJweXRob25cIlxuICAgICAgICAgICAgICAgICAgICB0aGVtZT1cInhjb2RlXCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cIkNvZGVFZGl0b3JcIlxuICAgICAgICAgICAgICAgICAgICAvLyBvbkxvYWQ9e3RoaXMub25Mb2FkfVxuICAgICAgICAgICAgICAgICAgICAvLyBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9ezE0fVxuICAgICAgICAgICAgICAgICAgICBzaG93UHJpbnRNYXJnaW49e3RydWV9XG4gICAgICAgICAgICAgICAgICAgIHNob3dHdXR0ZXI9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtgZGVmIGhlbGxvd193b3JsZDogXFxuXFx0cHJpbnQoXCJIZWxsbyB3b3JsZFwiKTsgXFxuXFx0YH1cbiAgICAgICAgICAgICAgICAgICAgc2V0T3B0aW9ucz17e1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlQmFzaWNBdXRvY29tcGxldGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZUxpdmVBdXRvY29tcGxldGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVTbmlwcGV0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93TGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJTaXplOiAyLFxuICAgICAgICAgICAgICAgIH19Lz4gXG4gICAgICAgICAgICAgICAgOiBudWxsfVxuICAgICAgICAgICAgPC9Db2RlQXJlYT5cbiAgICAgICAgPC9Db2RlUGFuZWw+XG4gICAgKTtcbiAgfTtcbiAgXG4gIGV4cG9ydCBkZWZhdWx0IENvZGVQYW5lbENvbXBvbmVudDtcblxuXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkNvZGVBcmVhIiwiQ29kZVBhbmVsIiwiQ29kZVRvb2xiYXIiLCJXb3JraW5nUGFuZWxEaXZpZGVyQ29tcG9uZW50IiwiRWRpdG9yIiwicHJvcHMiLCJBY2VFZGl0b3IiLCJyZXF1aXJlIiwiQ29kZVBhbmVsQ29tcG9uZW50IiwibW91bnRlZCIsInNldE1vdW50ZWQiLCJlbmFibGVCYXNpY0F1dG9jb21wbGV0aW9uIiwiZW5hYmxlTGl2ZUF1dG9jb21wbGV0aW9uIiwiZW5hYmxlU25pcHBldHMiLCJzaG93TGluZU51bWJlcnMiLCJ0YWJTaXplIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/materialui/layouts/CodePanelComponent.tsx\n");

/***/ })

});