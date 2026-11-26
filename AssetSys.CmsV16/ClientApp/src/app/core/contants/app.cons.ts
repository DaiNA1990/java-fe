export const AppCons = {
    /** Prefix gateway, URL đầy đủ: /gateway/<BasePath>/v1/<resource>. */
    API_GATEWAY: 'gateway',

    API_VERSION: 'v1',

    /** Base path của từng service trên gateway. */
    API_BASE: {
        BUDGET_PLAN: 'BudgetPlan',
        DEVELOP_TOOL: 'DevelopTool',
        MANAGE_SYSTEM: 'ManageSystem',
        REPORT: 'Report',
        WORKFLOW: 'Workflow',
        JOB_SERVER: 'JobServer'
    },

    /** pageSize tối đa backend nhận ở GetList/Autocomplete. */
    MAX_PAGE_SIZE: 1000,

    LANGUAGE_KEY: 'lang'
};
