import React from "react";

export type RecvCodeOutput = (output: Message) => void;

// export interface CodeOutput {
//     type: string;
//     content: string;
// };

// export interface Message {
//     request_originator: string;    
//     command_type: string;    
//     content_type: string;
//     content: string|object;
//     error: boolean;
//     meta: object;
// };

export interface Message {
    webapp_endpoint: string; // the web client component which sends 
														 // and/or receives this message    
    command_name: string;    // 'code_area_command'|'updated_dataframe_list'|
														 // 'plot_column_histogram'|'plot_count_na'|
														 // 'query_data'|'row_difference'|'column_difference' 
	seq_number: number;      // sequence number of the command. This is needed 
														 // for commands that requires more than one command
    content_type: string;    // the object type of the output content
    content: string|object;  // the command string and output string|object
    error: boolean;
    metadata: object;            // store info about the dataframe and columns 
                             // related to this command
};

export enum UpdateType {
    add_cols = 'add_cols',
    del_cols = 'del_cols',
    add_rows = 'add_rows',
    del_rows = 'del_rows',
    update_cells = 'update_cell',
    new_index = 'update_index',
    new_df = 'new_df',
    no_update = 'no_update',
}

// export interface DataTableContent {
//     name: string;
//     column_names: string[];
//     rows: ((string|number)[])[];
// };

export enum CommandName {  
    code_area_command = 'code_area_command',
    active_df_status = 'active_df_status',
    plot_column_histogram = 'plot_column_histogram',
    get_countna = 'get_countna',
    plot_countna = 'plot_countna',
    get_table_data = 'get_table_data'
};

export enum ContentType {  
    str = 'str',
    dict = 'dict',
    pandas_dataframe = 'pandas_dataframe',
    plotly_fig = 'plotly_fig',
    none = 'none'
};
// 'code_area_command'|'active_df_status'|
// 'plot_column_histogram'|'plot_count_na'|
// 'query_data'|'row_difference'|'column_difference'

export enum WebAppEndpoint {
    DataFrameManager = 'DataFrameManager',
    CodeEditorComponent = 'CodeEditorComponent'
};

export enum ReviewType {
    col = 'col',
    row = 'row',
    cell = 'cell'
};

export enum ReviewRequestType {
    repeat = 'repeat',
    next = 'next',
    prev = 'prev',
    index = 'index'
};

export interface IDFUpdates {
    update_type: UpdateType,
    update_content: (string)[] | (number)[]
}

export interface IReviewRequest {
    type: ReviewRequestType,
    index: number
}
export const UndefReviewIndex = -1;
// export class DFUpdatesReview {
//     enable: boolean = false;
//     index: number = -1;
//     count: number = -1;
// };

export interface IDFUpdatesReview {
    enable: boolean;
    index: number; // 'index' represents the position of the review in the review list
    name: string | number; // 'name' represents the row index or column name
    count: number; // 'count' is used to support 'repeat' review. when 'repeat', no other variable changed except for 'cout'
    type: ReviewType;
    length: number; // length of the review list
};

// export class DFUpdates {
//     update_type: UpdateType = UpdateType.no_update;
//     update_content: string[] | number[] | [number, number][] = [];
// }
//     constructor(update_type: UpdateType, update_content: string[] | number[] | [number, number][]) {
//         this.update_type = update_type;
//         this.update_content = update_content;
//     }
// }

// export class ReduxDFUpdates extends DFUpdates {
//     review: DFUpdatesReview = new DFUpdatesReview();
// }

// export interface IReduxDF {
//     activeDataFrame: number | null;
//     tableData: {};
//     columnMetaData: {};
//     columnHistogram: {};
//     columnDataSummary: {};
//     dfUpdates: {};
//     dfUpdatesReview: {[df_id: string]: IDFUpdatesReview};
//     tableDataReady: boolean;
// }