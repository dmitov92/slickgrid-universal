import { EventNamingStyle } from '@slickgrid-universal/event-pub-sub';

import { DelimiterType, FileType, GridAutosizeColsMode, OperatorType } from './enums/index';
import { Column, EmptyWarning, GridOption, TreeDataOption } from './interfaces/index';
import { Filters } from './filters';

/** Global Grid Options Defaults */
export const GlobalGridOptions: GridOption = {
  alwaysShowVerticalScroll: true,
  autoEdit: false,
  asyncEditorLoading: false,
  autoFitColumnsOnFirstLoad: true,
  autoFixResizeTimeout: 5 * 60 * 5, // interval is 200ms, so 4x is 1sec, so (5 * 60 * 5 = 5min)
  autoFixResizeRequiredGoodCount: 2,
  autoFixResizeWhenBrokenStyleDetected: false,
  autoParseInputFilterOperator: true,
  autoResize: {
    applyResizeToContainer: true,
    calculateAvailableSizeBy: 'window',
    bottomPadding: 20,
    minHeight: 180,
    minWidth: 300,
    rightPadding: 0
  },
  cellHighlightCssClass: 'slick-cell-modified',
  checkboxSelector: {
    cssClass: 'slick-cell-checkboxsel',
    width: 40
  },
  columnGroupSeparator: ' - ',
  columnPicker: {
    fadeSpeed: 0,
    hideForceFitButton: false,
    hideSyncResizeButton: true,
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  cellMenu: {
    autoAdjustDrop: true,
    autoAlignSide: true,
    hideCloseButton: true,
    hideCommandSection: false,
    hideOptionSection: false,
    showBulletWhenIconMissing: true,
  },
  compositeEditorOptions: {
    labels: {
      cancelButtonKey: 'CANCEL',
      cloneButtonKey: 'CLONE',
      resetEditorButtonTooltipKey: 'RESET_INPUT_VALUE',
      resetFormButtonKey: 'RESET_FORM',
      massSelectionButtonKey: 'APPLY_TO_SELECTION',
      massSelectionStatusKey: 'X_OF_Y_MASS_SELECTED',
      massUpdateButtonKey: 'APPLY_MASS_UPDATE',
      massUpdateStatusKey: 'ALL_X_RECORDS_SELECTED',
      saveButtonKey: 'SAVE',
    },
  },
  contextMenu: {
    autoAdjustDrop: true,
    autoAlignSide: true,
    hideCloseButton: true,
    hideClearAllGrouping: false,
    hideCollapseAllGroups: false,
    hideCommandSection: false,
    hideCopyCellValueCommand: false,
    hideExpandAllGroups: false,
    hideExportCsvCommand: false,
    hideExportExcelCommand: false,
    hideExportTextDelimitedCommand: true,
    hideMenuOnScroll: true,
    hideOptionSection: false,
    iconCollapseAllGroupsCommand: 'fa fa-compress mdi mdi-arrow-collapse',
    iconExpandAllGroupsCommand: 'fa fa-expand mdi mdi-arrow-expand',
    iconClearGroupingCommand: 'fa fa-times mdi mdi-close',
    iconCopyCellValueCommand: 'fa fa-clone mdi mdi-content-copy',
    iconExportCsvCommand: 'fa fa-download mdi mdi-download',
    iconExportExcelCommand: 'fa fa-file-excel-o mdi mdi-file-excel-outline',
    iconExportTextDelimitedCommand: 'fa fa-download mdi mdi-download',
    showBulletWhenIconMissing: true,
  },
  customFooterOptions: {
    dateFormat: 'YYYY-MM-DD, hh:mm a',
    hideRowSelectionCount: false,
    hideTotalItemCount: false,
    hideLastUpdateTimestamp: true,
    footerHeight: 25,
    leftContainerClass: 'col-xs-12 col-sm-5',
    rightContainerClass: 'col-xs-6 col-sm-7',
    metricSeparator: '|',
    metricTexts: {
      itemsKey: 'ITEMS',
      ofKey: 'OF',
      itemsSelectedKey: 'ITEMS_SELECTED'
    }
  },
  customTooltip: {
    tooltipTextMaxLength: 700,
    maxWidth: 500,
  },
  dataView: {
    // when enabled, this will preserve the row selection even after filtering/sorting/grouping
    syncGridSelection: {
      preserveHidden: false,
      preserveHiddenOnSelectionChange: true
    },
    syncGridSelectionWithBackendService: false, // but disable it when using backend services
  },
  datasetIdPropertyName: 'id',
  defaultFilter: Filters.input,
  defaultBackendServiceFilterTypingDebounce: 500,
  enableFilterTrimWhiteSpace: false, // do we want to trim white spaces on all Filters?
  defaultFilterPlaceholder: '🔎︎',
  defaultFilterRangeOperator: OperatorType.rangeInclusive,
  defaultColumnSortFieldId: 'id',
  defaultComponentEventPrefix: '',
  defaultSlickgridEventPrefix: '',
  draggableGrouping: {
    hideToggleAllButton: false,
    toggleAllButtonText: '',
    dropPlaceHolderTextKey: 'DROP_COLUMN_HEADER_TO_GROUP_BY',
  },
  editable: false,
  editorTypingDebounce: 450,
  filterTypingDebounce: 0,
  enableEmptyDataWarningMessage: true,
  emptyDataWarning: {
    className: 'slick-empty-data-warning',
    messageKey: 'EMPTY_DATA_WARNING_MESSAGE',
    hideFrozenLeftWarning: false,
    hideFrozenRightWarning: false,
    leftViewportMarginLeft: '40%',
    rightViewportMarginLeft: '40%',
    frozenLeftViewportMarginLeft: '0px',
    frozenRightViewportMarginLeft: '40%',
  } as unknown as EmptyWarning,
  enableAutoResize: true,
  enableAutoSizeColumns: true,
  enableCellNavigation: false,
  enableColumnPicker: true,
  enableColumnReorder: true,
  enableColumnResizeOnDoubleClick: true,
  enableContextMenu: true,
  enableExcelExport: false,
  enableTextExport: false,
  enableGridMenu: true,
  enableHeaderMenu: true,
  enableMouseHoverHighlightRow: true,
  enableSorting: true,
  enableTextSelectionOnCells: true,
  explicitInitialization: true,
  excelExportOptions: {
    addGroupIndentation: true,
    exportWithFormatter: false,
    filename: 'export',
    format: FileType.xlsx,
    groupingColumnHeaderTitle: 'Group By',
    groupCollapsedSymbol: '⮞',
    groupExpandedSymbol: '⮟',
    groupingAggregatorRowText: '',
    sanitizeDataExport: true,
  },
  textExportOptions: {
    delimiter: DelimiterType.comma,
    exportWithFormatter: false,
    filename: 'export',
    format: FileType.csv,
    groupingColumnHeaderTitle: 'Group By',
    groupingAggregatorRowText: '',
    sanitizeDataExport: true,
    useUtf8WithBom: true
  },
  gridAutosizeColsMode: GridAutosizeColsMode.none,
  eventNamingStyle: EventNamingStyle.lowerCase,
  forceFitColumns: false,
  frozenHeaderWidthCalcDifferential: 1,
  gridMenu: {
    dropSide: 'left',
    commandLabels: {
      clearAllFiltersCommandKey: 'CLEAR_ALL_FILTERS',
      clearAllSortingCommandKey: 'CLEAR_ALL_SORTING',
      clearFrozenColumnsCommandKey: 'CLEAR_PINNING',
      exportCsvCommandKey: 'EXPORT_TO_CSV',
      exportExcelCommandKey: 'EXPORT_TO_EXCEL',
      exportTextDelimitedCommandKey: 'EXPORT_TO_TAB_DELIMITED',
      refreshDatasetCommandKey: 'REFRESH_DATASET',
      toggleFilterCommandKey: 'TOGGLE_FILTER_ROW',
      togglePreHeaderCommandKey: 'TOGGLE_PRE_HEADER_ROW',
    },
    hideClearAllFiltersCommand: false,
    hideClearAllSortingCommand: false,
    hideClearFrozenColumnsCommand: true, // opt-in command
    hideExportCsvCommand: false,
    hideExportExcelCommand: false,
    hideExportTextDelimitedCommand: true,
    hideForceFitButton: false,
    hideRefreshDatasetCommand: false,
    hideSyncResizeButton: true,
    hideToggleFilterCommand: false,
    hideTogglePreHeaderCommand: false,
    iconCssClass: 'fa fa-bars mdi mdi-menu',
    iconClearAllFiltersCommand: 'fa fa-filter mdi mdi-filter-remove-outline',
    iconClearAllSortingCommand: 'fa fa-unsorted mdi mdi-swap-vertical',
    iconClearFrozenColumnsCommand: 'fa fa-times mdi mdi-pin-off-outline',
    iconExportCsvCommand: 'fa fa-download mdi mdi-download',
    iconExportExcelCommand: 'fa fa-file-excel-o mdi mdi-file-excel-outline',
    iconExportTextDelimitedCommand: 'fa fa-download mdi mdi-download',
    iconRefreshDatasetCommand: 'fa fa-refresh mdi mdi-sync',
    iconToggleFilterCommand: 'fa fa-random mdi mdi-flip-vertical',
    iconTogglePreHeaderCommand: 'fa fa-random mdi mdi-flip-vertical',
    menuWidth: 16,
    resizeOnShowHeaderRow: true,
    showBulletWhenIconMissing: true,
    headerColumnValueExtractor: pickerHeaderColumnValueExtractor
  },
  headerMenu: {
    autoAlign: true,
    autoAlignOffset: 4,
    minWidth: 140,
    iconClearFilterCommand: 'fa fa-filter mdi mdi mdi-filter-remove-outline',
    iconClearSortCommand: 'fa fa-unsorted mdi mdi-swap-vertical',
    iconFreezeColumns: 'fa fa-thumb-tack mdi mdi-pin-outline',
    iconSortAscCommand: 'fa fa-sort-amount-asc mdi mdi-flip-v mdi-sort-ascending',
    iconSortDescCommand: 'fa fa-sort-amount-desc mdi mdi-flip-v mdi-sort-descending',
    iconColumnHideCommand: 'fa fa-times mdi mdi-close',
    iconColumnResizeByContentCommand: 'fa fa-arrows-h mdi mdi-arrow-expand-horizontal',
    hideColumnResizeByContentCommand: false,
    hideColumnHideCommand: false,
    hideClearFilterCommand: false,
    hideClearSortCommand: false,
    hideFreezeColumnsCommand: true, // opt-in command
    hideSortCommands: false
  },
  ignoreAccentOnStringFilterAndSort: false,
  multiColumnSort: true,
  numberedMultiColumnSort: true,
  tristateMultiColumnSort: false,
  sortColNumberInSeparateSpan: true,
  suppressActiveCellChangeOnEdit: false,
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 0
  },
  headerRowHeight: 35,
  rowHeight: 35,
  topPanelHeight: 30,
  translationNamespaceSeparator: ':',
  resetFilterSearchValueAfterOnBeforeCancellation: true,
  resizeByContentOnlyOnFirstLoad: true,
  resizeByContentOptions: {
    alwaysRecalculateColumnWidth: false,
    cellCharWidthInPx: 7.8,
    cellPaddingWidthInPx: 14,
    defaultRatioForStringType: 0.88,
    formatterPaddingWidthInPx: 0,
    maxItemToInspectCellContentWidth: 1000,
    maxItemToInspectSingleColumnWidthByContent: 5000,
    widthToRemoveFromExceededWidthReadjustment: 50,
  },
  treeDataOptions: {
    exportIndentMarginLeft: 5,
    exportIndentationLeadingChar: '͏͏͏͏͏͏͏͏͏·',
  } as unknown as TreeDataOption
};

/**
 * Value Extractor for both ColumnPicker & GridMenu Picker
 * when using Column Header Grouping, we'll prefix the column group title
 * else we'll simply return the column name title
 */
function pickerHeaderColumnValueExtractor(column: Column, gridOptions?: GridOption) {
  const headerGroup = column?.columnGroup || '';
  const columnGroupSeparator = gridOptions?.columnGroupSeparator ?? ' - ';
  if (headerGroup) {
    return headerGroup + columnGroupSeparator + column.name;
  }
  return column?.name ?? '';
}
